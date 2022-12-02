import { Injectable } from '@nestjs/common';
import * as Bull from 'bull'
import { v4 as uuidv4 } from 'uuid';
import { UnableToCancelJob, UnableToCleanJobs, UnableToScheduleJob } from '../../../../shared/src/errors/task.errors';
import { CancelJob, CleanJobs, ScheduleJob } from '../../../../shared/src/jobs/commands';
import { QueueFactoryService } from '../../../../shared/src/services/queue-factory.service';
import { JobEntity } from '../../../../shared/src/entities/job.entity';
import { JobStorage } from './job.storage';


@Injectable()
export class JobService {

  readonly jobsQueue: Bull.Queue

  constructor(
    private readonly jobStorage: JobStorage,
    private readonly queueFactoryService: QueueFactoryService
  ) {
    this.jobsQueue = queueFactoryService.createJobsQueue()
  }

  async schedule(): Promise<string> {
    const jobHandle = this.generateJobHandle()

    try {
      await this.jobsQueue.add(new ScheduleJob(jobHandle))
    } catch (e) {
      throw new UnableToScheduleJob()
    }

    return jobHandle
  }

  async getAllJobs(): Promise<JobEntity[]> {
    return this.jobStorage.getAllJobs()
  }

  async cancel(jobHandle: string) {
    try {
      const cancelQueue = this.queueFactoryService.getJobQueue(jobHandle)
      await cancelQueue.add(new CancelJob(jobHandle))
    } catch (e) {
      throw new UnableToCancelJob(jobHandle)
    }
  }

  async clean() {
    try {
      await this.jobsQueue.add(CleanJobs.commandName, new CleanJobs())
    } catch (e) {
      throw new UnableToCleanJobs()
    }
  }

  private generateJobHandle(): string {
    return uuidv4();
  }

}
