import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ErrorService {
  private logger: Logger = new Logger(ErrorService.name);
  constructor() {
    this.listen();
  }
  listen() {
    //@ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    process.on('unhandledRejection', async (err: Error) => {
      this.logger.error(err);
    });
    process.on('uncaughtException', async (err: Error) => {
      this.logger.error(err);
    });
  }
}
