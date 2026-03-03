import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import NRP from 'node-redis-pubsub';
@Injectable()
export class PubsubService {
  nrp: NRP.NodeRedisPubSub;

  constructor(private config: ConfigService) {
    const proxyRedis = this.config.get('proxyRedis');
    // this.nrp = NRP({
    //   host: proxyRedis.host,
    //   port: proxyRedis.port,
    // });
  }
  listen(channel: string, callback) {
    this.nrp.subscribe(channel, callback);
  }
  publish(channel: string, payload: string) {
    this.nrp.publish(channel, payload);
  }
}
