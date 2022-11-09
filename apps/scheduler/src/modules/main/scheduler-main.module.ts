import { Module } from '@nestjs/common';
import { SchedulerModule } from '../scheduler/scheduler.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../configuration/configuration';

@Module({
  imports: [
    ConfigModule.forRoot(configuration()),
    SchedulerModule
  ],
  controllers: [],
  providers: [],
})
export class SchedulerMainModule {}