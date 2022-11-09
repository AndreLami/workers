import { Injectable } from '@nestjs/common';
import * as Bull from 'bull'
import { v6 as uuidv6 } from 'uuid';
import { UnableToCancelJob, UnableToScheduleJob } from '../../../../shared/src/errors/task.errors';
import { CancelJob, ScheduleJob } from '../../../../shared/src/jobs/commands';
import { QueueFactoryService } from '../../../../shared/src/services/queue-factory.service';


@Injectable()
export class JobService {

  readonly jobsQueue: Bull.Queue

  constructor(queueFactoryService: QueueFactoryService) {
    this.jobsQueue = queueFactoryService.createJobsQueue()
  }

  async schedule(): Promise<string> {
    const jobHandle = JobService.generateJobHandle()
    try {
      await this.jobsQueue.add(ScheduleJob.commandName, new ScheduleJob(jobHandle))
    } catch (e) {
      throw new UnableToScheduleJob()
    }

    return jobHandle
  }

  async cancel(jobHandle: string) {
    try {
      await this.jobsQueue.add(CancelJob.commandName, new CancelJob(jobHandle))
    } catch (e) {
      throw new UnableToCancelJob(jobHandle)
    }
  }

  // async clean() {
  //   const jobs = await this.queue.getRepeatableJobs()
  //   for (let i = 0; i < jobs.length; i++) {
  //     const job = jobs[i];
  //     await this.queue.removeRepeatable(job.name, {
  //       every: job.every,
  //       jobId: job.id
  //     });
  //
  //     console.log('Removed', job.name, job.id, job.every)
  //   }
  //
  // }

  private static generateJobHandle(): string {
    return uuidv6();
  }

}
