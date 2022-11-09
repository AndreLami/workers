import { Injectable } from '@nestjs/common';
import * as Bull from 'bull';
import { v6 as uuidv6 } from 'uuid';
import { QueueFactoryService } from '../../../../../shared/src/services/queue-factory.service';
import { ExecutorService } from './executor.service';
import { CancelJob, ScheduleJob } from '../../../../../shared/src/jobs/commands';

@Injectable()
export class SchedulerService {
  private readonly schedulerId = uuidv6();

  readonly jobsQueue: Bull.Queue;
  readonly executionQueue: Bull.Queue;

  constructor(
    queueFactoryService: QueueFactoryService,
    private readonly executorService: ExecutorService,
  ) {

    this.jobsQueue = queueFactoryService.createJobsQueue();
    this.executionQueue = queueFactoryService.createExecutionQueue(this.schedulerId);

    this.jobsQueue.process(ScheduleJob.commandName, async (job, done) => {
      return this.scheduleJob(new ScheduleJob(job.data), done);
    }).catch((err) => {
      console.log('Unable to subscribe to schedule job command', err);
    });

    this.jobsQueue.process(CancelJob.commandName, async (job, done) => {
      return this.cancelJob(new CancelJob(job.data), done);
    }).catch((err) => {
      console.log('Unable to subscribe to cancel job command', err);
    });

    this.executionQueue.process(async (job, done) => {
      return this.executeJob(job, done);
    }).catch((err) => {
      console.log('Unable to subscribe to execution queue', err);
    });
  }

  private async scheduleJob(command: ScheduleJob, done: Bull.DoneCallback) {
    try {
      await this.executionQueue.add({}, {
        jobId: command.jobHandle,
        repeat: {
          every: 2000,
          limit: 99999,
        },
      })
      done()
    } catch(err) {
      console.log('Failed to schedule job', command.jobHandle, err);
      done(err)
    }
  }

  private async cancelJob(command: CancelJob, done: Bull.DoneCallback) {
    try {
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
      done()
    } catch (err) {
      console.log('Failed to cancel job', command.jobHandle, err);
      done(err)
    }
  }

  private async executeJob(job: Bull.Job, done: Bull.DoneCallback) {
    console.log('Schedule handle hob', this.schedulerId)
    try {
      await this.executorService.execute(job.data);
      done();
    } catch (e) {
      done(e);
    }
  }

}
