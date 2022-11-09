import { Module } from '@nestjs/common';
import { SchedulerService } from './services/scheduler.service';
import { ExecutorService } from './services/executor.service';
import { SharedModule } from '../../../../shared/src/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [],
  providers: [SchedulerService, ExecutorService],
})
export class SchedulerModule {}
