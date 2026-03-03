import { ConsoleLogger } from '@nestjs/common';
import { DiscordService } from '~@/shared/discord/discord.service';

// export class AppLogger extends Logger {
//   constructor(private _discordService: DiscordService, ...args: any[]) {
//     //@ts-ignore
//     super(...args);
//   }
//   // error(...args): void {
//   //   const error = args[0];
//   //   super.error(error.message, error.stack);
//   //   this._discordService.logError(error);
//   // }
// }

export class ShytttLogger extends ConsoleLogger {
  constructor(private _discordService: DiscordService, ...args: any[]) {
    //@ts-ignore
    super(...args);
  }
  warn(message: any, context?: string): void;
  warn(message: any, ...optionalParams: any[]): void;
  warn(message: any, context?: unknown, ...rest: unknown[]): void {
    //@ts-ignore
    super.warn(message, context, ...rest);
    this._discordService.logWarn(`[${context}] ${message}`);
  }
  error(...args): void {
    //@ts-ignore
    super.error(...args);
    console.error(args[0]);
    // const error = args[0];
    // //@ts-ignore
    // console.error(error);
    // this._discordService.logError(args[0]);
  }
}
