import { Controller, Get, Query } from '@nestjs/common';
import { JobService } from './job.service';

@Controller('api/job')
export class JobController {

  constructor(
    private workerApiService: JobService
  ) {}

  @Get('schedule')
  async schedule(): Promise<string> {
    return this.workerApiService.schedule()
  }

  @Get('cancel')
  async cancel(@Query('jobHandle') jobHandle: string): Promise<void> {
    return this.workerApiService.cancel(jobHandle)
  }

  @Get('clean')
  async clean(): Promise<void> {
    return await this.workerApiService.clean()
  }


}
