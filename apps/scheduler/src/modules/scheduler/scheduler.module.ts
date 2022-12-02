import { Module } from '@nestjs/common';
import { SchedulerService } from './services/scheduler.service';
import { SharedModule } from '../../../../shared/src/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [],
  providers: [SchedulerService],
})
export class SchedulerModule {}
