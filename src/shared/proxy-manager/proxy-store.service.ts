import { Inject, Injectable } from '@nestjs/common';
import { PROXIES_LIST_KEY } from '../constants';
import { Proxy } from './types';
import { Redis } from 'ioredis';
import { DiscordService } from '../discord/discord.service';

@Injectable()
export class ProxyStoreService {
  constructor(
    @Inject('REDIS_CLIENT') private redisClient: Redis,
    private discordService: DiscordService,
  ) {}

  async getAllProxies(): Promise<Proxy[]> {
    const proxyKeys = await this.redisClient.keys(`${PROXIES_LIST_KEY}:*`);
    const tran = this.redisClient.multi();
    proxyKeys.forEach((proxyKey) => tran.hgetall(proxyKey));
    const trans = await tran.exec();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const proxies = trans.map(([_, data]) => data);
    return proxies as unknown as Proxy[];
  }
  async count() {
    const proxyKeys = await this.redisClient.keys(`${PROXIES_LIST_KEY}:*`);
    return proxyKeys.length;
  }

  async addProxy(proxy: Proxy, override = false) {
    const PROXY_KEY = `${PROXIES_LIST_KEY}:${proxy.host}`;
    const isExisted = await this.redisClient.exists(PROXY_KEY);
    if (isExisted && !override) {
      const existedError = new Error();
      existedError.name = 'Proxy Existed';
      existedError.message = `Proxy is existed: ${proxy.host}`;
      throw existedError;
    }
    return this.redisClient.hset(PROXY_KEY, proxy);
  }

  async deleteProxy(proxy: Proxy): Promise<void>;
  async deleteProxy(host: string): Promise<void>;
  async deleteProxy(arg: Proxy | string): Promise<void> {
    if (typeof arg === 'string') {
      const PROXY_KEY = `${PROXIES_LIST_KEY}:${arg}`;
      await this.redisClient.del(PROXY_KEY);
    } else {
      const PROXY_KEY = `${PROXIES_LIST_KEY}:${arg.host}`;
      await this.redisClient.del(PROXY_KEY);
    }
  }

  async clearProxies() {
    const proxyKeys = await this.redisClient.keys(`${PROXIES_LIST_KEY}:*`);
    if (proxyKeys.length) {
      this.redisClient.del(proxyKeys);
    }
  }

  async getProxy(host: string): Promise<Proxy> {
    const proxyKey = `${PROXIES_LIST_KEY}:${host}`;
    const proxy = await this.redisClient.hgetall(proxyKey);
    return proxy as unknown as Proxy;
  }
  async getProxies(proxyHosts: string[]) {
    const pipline = this.redisClient.pipeline();
    for (const proxyHost of proxyHosts) {
      pipline.hgetall(`${PROXIES_LIST_KEY}:${proxyHost}`);
    }
    const piplineResults = await pipline.exec();
    return piplineResults
      .map(([err, proxy]) => {
        if (!err) {
          return proxy as unknown as Proxy;
        } else {
          this.discordService.logError(err);
          return undefined;
        }
      })
      .filter((proxy) => proxy);
  }
}
