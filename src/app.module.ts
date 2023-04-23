import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CricketModule } from './cricket/cricket.module';
import { ApiExecutionTimeInterceptor } from './shared/interceptors/api-execution-time.interceptor';
import { ApiResponseInterceptor } from './shared/interceptors/api-response.interceptor';

@Module({
  imports: [CricketModule],
  controllers: [AppController],
  providers: [AppService, ApiExecutionTimeInterceptor, ApiResponseInterceptor],
})
export class AppModule {}
