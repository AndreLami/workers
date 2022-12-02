import { JobTask } from './job-task';

export class JobSchedule {

  private scheduleId: ReturnType<typeof setInterval> | null = null

  constructor(
    public readonly jobHandle: string,
    private readonly task: JobTask
  ) {}

  start() {
    if (this.scheduleId !== null) {
      return
    }

    this.scheduleId = setInterval(() => {
      this.task.execute().catch()
    }, 2000)
  }

  stop() {
    if (this.scheduleId === null) {
      return
    }

    clearInterval(this.scheduleId)
    this.scheduleId = null
  }

  private execute() {
    this.task.execute().catch(() => {
      console.log('Error', this.jobHandle)
    })
  }

}