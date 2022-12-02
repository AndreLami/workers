import { Controller, Get, Query } from '@nestjs/common';
import { JobService } from './job.service';
import { JobEntity } from '../../../../shared/src/entities/job.entity';

@Controller('api/job')
export class JobController {

  constructor(
    private jobService: JobService
  ) {}

  @Get('schedule')
  async schedule(): Promise<string> {
    return this.jobService.schedule()
  }

  @Get('cancel')
  async cancel(@Query('jobHandle') jobHandle: string): Promise<void> {
    return this.jobService.cancel(jobHandle)
  }

  @Get('clean')
  async clean(): Promise<void> {
    return await this.jobService.clean()
  }

  @Get('')
  async getAllJobs(): Promise<JobEntity[]> {
    return await this.jobService.getAllJobs()
  }


}
