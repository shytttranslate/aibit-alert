import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { Client, IntentsBitField, TextChannel } from 'discord.js';
import _ from 'lodash';
const MAX_RECONNECT_TIME = 3;
@Injectable()
export class DiscordService implements OnModuleInit {
  private _opts: {
    botToken: string;
    logChannel: string;
    bugChannel: string;
    warnChannel: string;
  };
  private client: Client;
  private reconnectTime = 0;
  private logger = new Logger(DiscordService.name);
  private _bugChannel: TextChannel;
  private _logChannel: TextChannel;
  private _warnChannel: TextChannel;
  constructor(private config: ConfigService) {
    this._opts = this.config.get('discord');
    // this.initSessionAndHandler();
  }
  async initSessionAndHandler() {
    this.client = new Client({
      intents: [IntentsBitField.Flags.GuildMessages],
    });
    this.client.on('ready', async () => {
      this.logger.log(`Logged in as ${this.client.user.tag}!`);

      this._logChannel = (await this.client.channels.fetch(this._opts.logChannel)) as TextChannel;

      this._bugChannel = (await this.client.channels.fetch(this._opts.bugChannel)) as TextChannel;
      this._warnChannel = (await this.client.channels.fetch(this._opts.warnChannel)) as TextChannel;
    });

    this.client.on('error', (err) => {
      console.log(err);
      this.logger.error(err);
      this._reconnect();
    });
    this.client.on('disconnect', this._reconnect.bind(this));
  }
  async onModuleInit() {
    // this._login();
  }
  async _login() {
    if (!this._opts.botToken || !this._opts.botToken.length) {
      this.logger.warn('Bot token is empty');
    }
    return this.client.login(this._opts.botToken).catch((err) => {
      this.logger.error(`Couldn't connect bot token ${this._opts.botToken}`);
    });
  }
  _reconnect() {
    this.logger.log(`Reconnecting`);
    try {
      if (this.reconnectTime <= MAX_RECONNECT_TIME) {
        this.reconnectTime++;
        this.client.removeAllListeners();
        this.client.destroy();
        this.client = undefined;
        this._bugChannel = undefined;
        this._logChannel = undefined;
        this._warnChannel = undefined;
      } else {
        this.logger.warn('Failed to reconnect to discord bot');
      }
    } catch {}

    this.initSessionAndHandler();
    return this._login();
  }

  async log(msg: string) {
    const isDiscordChannelNotReady = !this.client || !this.client.isReady || !this._logChannel;
    if (isDiscordChannelNotReady) {
      this.logger.log(msg);
      return;
    }

    this._logChannel.send(`${msg.slice(0, 1999)}`);
  }

  async logError(err: Error | AxiosError | string) {
    const isDiscordChannelNotReady = !this.client || !this.client.isReady || !this._bugChannel;
    if (isDiscordChannelNotReady) {
      return;
    }

    let errorMsg = '';
    if (typeof err === 'string') {
      return this._bugChannel.send(err.slice(0, 1999));
    }
    if (err instanceof AxiosError) {
      const requestHeaders = err?.config?.headers ?? {}; // Assign request headers to a variable
      const requestBody = err?.config?.data ?? null; // Assign request body to a variable
      const requestUrl = err?.config?.url ?? ''; // Assign request URL to a variable
      const responseData = _.get(err, 'response.data');
      const statusCode = _.get(err, 'response.status');
      errorMsg = `
\`\`\`
${err.stack}

${responseData}
\`\`\`
      `;
    } else {
      errorMsg = `
\`\`\`
${err.stack ? err.stack : ''}
\`\`\`
`;
    }
    this._bugChannel.send(errorMsg.slice(0, 1999));
  }
  async logWarn(msg: string) {
    const isDiscordChannelNotReady = !this.client || !this.client.isReady || !this._warnChannel;
    if (isDiscordChannelNotReady) {
      return;
    }
    this._warnChannel.send(`
 \`\`\`${msg.slice(0, 1999)}\`\`\``);
  }

  async logCritical(msg: string) {
    const isDiscordChannelNotReady = !this.client || !this.client.isReady || !this._bugChannel;
    if (isDiscordChannelNotReady) {
      this.logger.warn(msg);
      return;
    }
    this._bugChannel.send(` ${msg.slice(0, 1999)}`);
  }
}
