import { Injectable } from '@nestjs/common';
import * as Bull from 'bull';
import { v4 as uuidv4 } from 'uuid';
import { QueueFactoryService } from '../../../../../shared/src/services/queue-factory.service';
import { CancelJob, ScheduleJob } from '../../../../../shared/src/jobs/commands';
import { JobSchedule } from './job-schedule';
import { JobTask } from './job-task';

class PrintJobTask implements JobTask {

  constructor(private readonly schedulerId: string, private readonly jobHandle: string) {}

  execute(): Promise<void> {
    console.log("Working...", this.schedulerId, this.jobHandle)

    return Promise.resolve();
  }


}

@Injectable()
export class SchedulerService {
  private readonly schedulerId = uuidv4();

  readonly jobsQueue: Bull.Queue;

  private schedulesMap = new Map<string, JobSchedule>()

  constructor(
    private readonly queueFactoryService: QueueFactoryService,
  ) {

    this.jobsQueue = queueFactoryService.createJobsQueue();

    this.jobsQueue.process(async (job) => {
      return this.scheduleJob(ScheduleJob.fromPayload(job.data));
    }).catch(() => {})
  }

  private async scheduleJob(command: ScheduleJob) {
    console.log('Schedule job', this.schedulerId, command.jobHandle)

    const jobeQueue = this.queueFactoryService.getJobQueue(command.jobHandle)
    jobeQueue.process( async (job) => {
      return this.cancelJob(CancelJob.fromPayload(job.data));
    }).catch(() => {})

    const schedule = new JobSchedule(command.jobHandle, new PrintJobTask(this.schedulerId, command.jobHandle))
    this.schedulesMap.set(schedule.jobHandle, schedule)
    schedule.start()
  }

  private async cancelJob(command: CancelJob) {
    console.log('Cancel job', this.schedulerId, command.jobHandle)
    const schedule = this.schedulesMap.get(command.jobHandle)
    if (schedule === undefined) {
      return
    }

    schedule.stop()
    this.schedulesMap.delete(command.jobHandle)
    const jobQueue = this.queueFactoryService.getJobQueue(command.jobHandle)
    jobQueue.obliterate().catch(() => {})
  }

}
