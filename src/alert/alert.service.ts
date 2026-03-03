import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const TRANSLATOR_BODY = {
  from: 'auto',
  to: 'en',
  text: 'hello',
  provider: 'google',
};

@Injectable()
export class AlertService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AlertService.name);
  private lastAlertSentAt: number = 0;
  private readonly alertCooldownMs: number;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor(private readonly configService: ConfigService) {
    // Cooldown mặc định 10 phút, có thể override bằng ALERT_COOLDOWN_MS (ms)
    const envCooldown =
      Number(process.env.ALERT_COOLDOWN_MS) ||
      Number(this.configService.get<number>('alert.cooldownMs'));
    this.alertCooldownMs = envCooldown && envCooldown > 0 ? envCooldown : 10 * 60 * 1000;
  }

  onModuleInit() {
    const intervalMs = this.configService.get<number>('alert.checkIntervalMs');
    if (intervalMs > 0) {
      this.intervalId = setInterval(() => {
        this.runHealthCheckAndAlert().catch((err) =>
          this.logger.error(`Health check error: ${err?.message}`),
        );
      }, intervalMs);
      this.logger.log(`Alert health check scheduled every ${intervalMs / 1000}s`);
      // Chạy lần đầu sau 10s để app kịp khởi động
      setTimeout(() => this.runHealthCheckAndAlert().catch(() => {}), 10000);
    }
  }

  onModuleDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  /**
   * Gọi API translator để kiểm tra dịch vụ aibit có hoạt động không.
   */
  async checkAibitHealth(): Promise<{ ok: boolean; error?: string }> {
    const url = this.configService.get<string>('alert.translatorUrl');
    const headers = this.configService.get<Record<string, string>>('alert.translatorHeaders');

    try {
      const res = await axios.post(url, TRANSLATOR_BODY, {
        headers: { ...headers, 'Content-Type': 'application/json' },
        timeout: 15000,
        validateStatus: () => true,
      });

      if (res.status >= 200 && res.status < 300) {
        return { ok: true };
      }

      return {
        ok: false,
        error: `HTTP ${res.status}: ${JSON.stringify(res.data?.message || res.data || res.statusText)}`,
      };
    } catch (err: any) {
      const message = err?.response?.data
        ? JSON.stringify(err.response.data)
        : err?.message || String(err);
      this.logger.warn(`Aibit health check failed: ${message}`);
      return {
        ok: false,
        error: message,
      };
    }
  }

  /**
   * Gửi email cảnh báo qua API email.aibitranslator.com.
   */
  async sendAlertEmail(subject: string, message: string): Promise<boolean> {
    const url = this.configService.get<string>('alert.emailApiUrl');
    const toEmail = this.configService.get<string>('alert.alertEmail');
    const requestId = uuidv4();

    try {
      await axios.post(
        url,
        {
          email: toEmail,
          subject,
          message,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'aibit-request-id': requestId,
          },
          timeout: 10000,
        },
      );
      this.logger.log(`Alert email sent to ${toEmail}, request-id: ${requestId}`);
      return true;
    } catch (err: any) {
      this.logger.error(
        `Failed to send alert email: ${err?.response?.data ? JSON.stringify(err.response.data) : err?.message}`,
      );
      return false;
    }
  }

  /**
   * Chạy kiểm tra và gửi email nếu dịch vụ lỗi (có cooldown để tránh spam).
   */
  async runHealthCheckAndAlert(): Promise<void> {
    const result = await this.checkAibitHealth();

    if (result.ok) {
      this.logger.debug('Aibit health check OK');
      return;
    }

    const now = Date.now();
    if (now - this.lastAlertSentAt < this.alertCooldownMs) {
      this.logger.warn(
        `Aibit down but alert cooldown active (next in ${Math.ceil((this.alertCooldownMs - (now - this.lastAlertSentAt)) / 60000)} min)`,
      );
      return;
    }

    const subject = `[Aibitranslator] System Alert - Service Down`;
    const message = `Dịch vụ Aibitranslator không phản hồi bình thường.\n\nLỗi: ${result.error}\nThời gian: ${new Date().toISOString()}`;

    const sent = await this.sendAlertEmail(subject, message);
    if (sent) {
      this.lastAlertSentAt = now;
    }
  }
}
