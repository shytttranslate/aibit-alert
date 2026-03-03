import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from '../../configuration';
import { DataSource } from 'typeorm';
import wait from 'wait';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
  ],
  providers: [
    ConfigService,
    {
      provide: DataSource,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger();
        const dt = new DataSource({
          ...configService.get('database'),
          poolErrorHandler: (err) => {
            logger.error(err);
          },
        } as PostgresConnectionOptions);

        const conn = async (delay = 0) => {
          await wait(delay);
          try {
            const conn = await dt.initialize();
            return conn;
          } catch (e) {
            logger.error(e);
            return conn(3000);
          }
        };
        return conn();
      },
    },
  ],
  exports: [ConfigService],
})
export class LazyModule {}
