import { Module } from '@nestjs/common';
import { DreamTeamService } from './dream-team.service';

@Module({
  imports: [],
  providers: [DreamTeamService],
  exports: [DreamTeamService],
})
export class DreamTeamModule {}
