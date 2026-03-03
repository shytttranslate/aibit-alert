import { Global, Module } from '@nestjs/common';
import { UserAgentService } from './user-agent/user-agent.service';
import { ErrorService } from './error/error.service';
import { DiscordService } from './discord/discord.service';
import { RequestService } from './request/request.service';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { ProxyStoreService } from './proxy-manager/proxy-store.service';
import { PubsubService } from './pubsub/pubsub.service';
import { DBService } from './database.service';
@Global()
@Module({
  providers: [
    UserAgentService,
    ErrorService,
    DiscordService,
    RequestService,
    DBService,
    PubsubService,
  ],
  exports: [
    UserAgentService,
    DiscordService,
    RequestService,
    DBService,
  ],
})
export class SharedModule {}
