import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CricketModule } from './cricket/cricket.module';

@Module({
  imports: [CricketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
