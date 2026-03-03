import dotenvSafe from 'dotenv-safe';
dotenvSafe.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import express from 'express';
import { DiscordService } from './shared/discord/discord.service';
import { ShytttLogger } from './shared/logger/AppLogger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});
  app.enableCors({
    origin: '*',
  });
  app.setGlobalPrefix('/api');
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.use(
    express.urlencoded({
      extended: true,
      limit: '50mb',
    }),
  );
  app.use(
    express.json({
      limit: '50mb',
    }),
  );
  app.useGlobalPipes(new ValidationPipe());
  const discordService = app.get(DiscordService);
  app.useLogger(new ShytttLogger(discordService));
  await app.listen(process.env.PORT);
}
bootstrap();
