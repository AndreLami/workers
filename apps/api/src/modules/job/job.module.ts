import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '../../../../shared/src/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobEntity } from '../../../../shared/src/entities/job.entity';
import { JobStorage } from './job.storage';

@Module({
  imports: [
    ConfigModule,
    SharedModule,
    TypeOrmModule.forFeature([JobEntity]),
  ],
  controllers: [JobController],
  providers: [JobService, JobStorage],
})
export class JobModule {}