import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '../../../../shared/src/shared.module';

@Module({
  imports: [
    ConfigModule,
    SharedModule
  ],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}