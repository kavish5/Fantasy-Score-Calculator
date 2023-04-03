import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import config from 'config';
import { ApiExecutionTimeInterceptor } from './shared/interceptors/api-execution-time.interceptor';
import { ApiResponseInterceptor } from './shared/interceptors/api-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.enableCors(config.get('corsConfigurations'));
  app.use(helmet());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(compression());

  app.useGlobalInterceptors(
    app.get<ApiResponseInterceptor>(ApiResponseInterceptor),
    app.get<ApiExecutionTimeInterceptor>(ApiExecutionTimeInterceptor),
  );
  await app.listen(config.get('port'));
  console.log(`Application is running for ${config.get('host')} on: ${await app.getUrl()}`);
}
bootstrap();
