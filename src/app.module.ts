import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CricketModule } from './cricket/cricket.module';
import { ApiExecutionTimeInterceptor } from './shared/interceptors/api-execution-time.interceptor';
import { ApiResponseInterceptor } from './shared/interceptors/api-response.interceptor';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...config.get('databaseConfigurations'),
    }),
    CricketModule,
  ],
  controllers: [AppController],
  providers: [AppService, ApiExecutionTimeInterceptor, ApiResponseInterceptor],
})
export class AppModule {}
