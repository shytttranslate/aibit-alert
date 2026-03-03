import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AxiosError } from 'axios';
import { DiscordService } from '~@/shared/discord/discord.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger = new Logger(AllExceptionsFilter.name);
  constructor(private readonly httpAdapterHost: HttpAdapterHost, private discordService: DiscordService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // this.trackingService.trackHttpError(exception, host);
    const responseBody: any = {};
    if (exception instanceof Error && !(exception instanceof HttpException)) {
      this.logger.error(exception);
    }
    if (exception instanceof AxiosError) {
      responseBody.statusCode = 400;
      responseBody.message = 'Something went wrong please try again later';
    } else if (exception instanceof HttpException) {
      responseBody.message = exception.getResponse();
      responseBody.statusCode = exception.getStatus();
    } else {
      responseBody.statusCode = 400;
      responseBody.message = 'Something went wrong please try again later';
    }

    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    if (responseBody.statusCode === 302) {
      res.setHeader('Location', 'https://downloads.tatoeba.org/exports/sentences_detailed.tar.bz2');
    }
    httpAdapter.reply(res, responseBody, responseBody.statusCode || 400);
  }
}
