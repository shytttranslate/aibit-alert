import { Controller, Get, Post } from '@nestjs/common';
import { AlertService } from './alert.service';

@Controller('alert')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  /**
   * GET /api/alert/check - Kiểm tra sức khỏe dịch vụ aibit (không gửi email).
   */
  @Get('check')
  async check() {
    return this.alertService.checkAibitHealth();
  }

  /**
   * POST /api/alert/run - Chạy kiểm tra và gửi email nếu lỗi (dùng cho cron ngoài hoặc test).
   */
  @Post('run')
  async run() {
    await this.alertService.runHealthCheckAndAlert();
    return { ok: true };
  }
}
