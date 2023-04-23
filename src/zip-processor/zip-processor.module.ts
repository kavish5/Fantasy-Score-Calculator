import { Module } from '@nestjs/common';
import { ZipProcessorService } from './zip-processor.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ZipProcessorModule, HttpModule],
  providers: [ZipProcessorService],
  exports: [ZipProcessorService],
})
export class ZipProcessorModule {}
