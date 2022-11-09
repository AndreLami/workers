
export abstract class JobCommand {

  static commandName = "Generic"

  get commandName(): string {
    return (<typeof JobCommand>this.constructor).commandName
  }

}

export class ScheduleJob extends JobCommand {

  static commandName = "job.schedule"
  readonly jobHandle: string

  constructor(jobHandle: string) {
    super();

    this.jobHandle = jobHandle
  }

  static fromPayload(payload: any): ScheduleJob {
    return new ScheduleJob(payload.jobHandle)
  }

}

export class CancelJob extends JobCommand {

  static commandName = "job.cancel"
  readonly jobHandle: string

  constructor(jobHandle: string) {
    super();

    this.jobHandle = jobHandle
  }

  static fromPayload(payload: any): ScheduleJob {
    return new CancelJob(payload.jobHandle)
  }

}