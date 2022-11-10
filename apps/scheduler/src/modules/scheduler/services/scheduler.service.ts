import { Injectable } from '@nestjs/common';
import * as Bull from 'bull';
import { v4 as uuidv4 } from 'uuid';
import { QueueFactoryService } from '../../../../../shared/src/services/queue-factory.service';
import { ExecutorService } from './executor.service';
import { CancelJob, CleanJobs, ScheduleJob } from '../../../../../shared/src/jobs/commands';

@Injectable()
export class SchedulerService {
  private readonly schedulerId = uuidv4();

  readonly jobsQueue: Bull.Queue;
  readonly executionQueue: Bull.Queue;

  constructor(
    private readonly queueFactoryService: QueueFactoryService,
    private readonly executorService: ExecutorService,
  ) {

    this.jobsQueue = queueFactoryService.createJobsQueue();
    this.executionQueue = queueFactoryService.createExecutionQueue(this.schedulerId);

    this.jobsQueue.process(ScheduleJob.commandName, async (job) => {
      return this.scheduleJob(ScheduleJob.fromPayload(job.data));
    }).catch(() => {})

    this.executionQueue.process(async (job) => {
      return this.executeJob(job);
    }).catch(() => {});
  }

  private async scheduleJob(command: ScheduleJob) {
    console.log('Schedule job', this.schedulerId, command.jobHandle)

    const cancelQueue = this.queueFactoryService.getCancelQueue(command.jobHandle)
    cancelQueue.process( async (job) => {
      return this.cancelJob(CancelJob.fromPayload(job.data));
    }).catch(() => {})

    await this.executionQueue.add({jobHandle: command.jobHandle}, {
      jobId: command.jobHandle,
      repeat: {
        every: 4000,
        limit: 99999,
      },
    })
  }

  private async cancelJob(command: CancelJob) {
    console.log('Clean job', this.schedulerId, command.jobHandle)
    const jobs = await this.executionQueue.getRepeatableJobs()

    // TODO: Just remove directly
    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      if (job.id == command.jobHandle) {
        await this.executionQueue.removeRepeatable(job.name, {
          every: job.every,
          jobId: job.id
        });
      }
    }

    const cancelQueue = this.queueFactoryService.getCancelQueue(command.jobHandle)
    await cancelQueue.obliterate({force: true})
  }

  private async executeJob(job: Bull.Job): Promise<void> {
    console.log("Execute", this.schedulerId, job.data.jobHandle)
    return this.executorService.execute(job.data);
  }

}
