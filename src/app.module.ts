import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { SharedModule } from './shared/shared.module';
import config from './configuration';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './exceptions/all.exceptions';
import { RequestID } from './middleware/request-id.middleware';
import { ThrottlerModule } from '@nestjs/throttler';
import { UserController } from './user/user.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { AlertModule } from './alert/alert.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    SharedModule,
    AlertModule,
    ThrottlerModule.forRoot([
      {
        ttl: 1000,
        limit: 18,
      },
    ]),

    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    // TrackingModule,
  ],
  controllers: [AppController, UserController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    // PromoteService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestID).forRoutes('*');
    // consumer.apply(HttpLogMiddleware).forRoutes('*');
  }
}
