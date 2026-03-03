import { Injectable, Logger } from '@nestjs/common';
import axios, { Axios, CanceledError, AxiosError, CreateAxiosDefaults } from 'axios';
import http from 'http';
import https from 'https';
import { DiscordService } from '../discord/discord.service';
import { Proxy } from '~@/shared/proxy-manager/types';
import { PubsubService } from '../pubsub/pubsub.service';
import _ from 'lodash';
import { getAxiosProxyStatus } from '../helpers';

class Base {
  private _c: Axios;
  private logger: Logger;
  constructor(config: CreateAxiosDefaults = {}) {
    this._c = axios.create(config);
    this._c.defaults.httpAgent = new http.Agent({ keepAlive: true });
    this._c.defaults.httpsAgent = new https.Agent({ keepAlive: true });
    this.logger = new Logger('Interceptor Axios');
  }

  setProxy(proxy: Proxy) {
    if (proxy.gce_cookie) {
      this._c.defaults.headers['Cookie'] = proxy.gce_cookie.split(';')[0];
    }
    this._c.defaults.proxy = {
      host: proxy.host,
      port: proxy.port,
      auth: {
        password: proxy.password,
        username: proxy.username,
      },
      protocol: 'http',
    };
    this._c.defaults['current-proxy'] = proxy;
  }

  setService(name: string) {
    this._c.defaults['service'] = name;
  }

  useProxyHandlingErrorInterceptors(pubsubService: PubsubService) {
    this._c.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error: CanceledError<any> | AxiosError) => {
        try {
          const responseStatus = _.get(error, 'response.status');
          const { config, message } = error;
          const proxy: Proxy = _.get(config, 'current-proxy');
          const isTimeout = error instanceof CanceledError || message.includes('timeout');
          const isBadProxy =
            message.includes('could not be established') ||
            message.includes('socket hang up') ||
            message.includes('network socket disconnected') ||
            message.includes('ECONNRESET') ||
            responseStatus === 500 ||
            responseStatus === 403;
          const isTempBlocked = responseStatus === 429;
          if (isTimeout) {
            config['current-proxy'].isTimeout = true;
          }
          if (isBadProxy) {
            config['current-proxy'].isBadProxy = true;
          }
          if (isTempBlocked) {
            config['current-proxy'].is429 = true;
          }
          if (isTimeout || isBadProxy || isTempBlocked) {
            this.logger.warn(`Proxy failed: ${proxy.host} ${getAxiosProxyStatus(error)}`);
            pubsubService.publish(
              'PROXY_DIE',
              JSON.stringify({
                ...proxy,
                service: config['service'],
                gce_status: getAxiosProxyStatus(error),
              }),
            );
          }
        } catch (err) {
          console.error(err);
        }
        return Promise.reject(error);
      },
    );
  }

  get(): Axios {
    return this._c;
  }
}
@Injectable()
export class RequestService {
  constructor(private discordservice: DiscordService, private pubsubService: PubsubService) {}

  async generate(
    opts: {
      proxy?: Proxy;
      axiosConfig?: CreateAxiosDefaults;
      service?: string;
    } = {},
  ): Promise<
    [
      Axios,
      {
        proxy: Proxy;
      },
    ]
  > {
    const { proxy, axiosConfig, service } = opts;
    const _base = new Base(axiosConfig);
    if (!proxy || !Object.keys(proxy).length) {
      this.discordservice.logError(new Error(`Request don't use proxy`));
    }
    if (proxy) {
      _base.setProxy(proxy);
      _base.useProxyHandlingErrorInterceptors(this.pubsubService);
    }
    if (service) {
      _base.setService(service);
    } else {
      _base.setService('gce');
    }

    return [
      _base.get(),
      {
        proxy,
      },
    ];
  }
}
