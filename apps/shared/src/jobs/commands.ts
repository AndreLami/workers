
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

export class MonitorJob extends JobCommand {

  static commandName = "job.monitor"
  readonly schedulerId: string

  constructor(schedulerId: string) {
    super();

    this.schedulerId = schedulerId
  }

  static fromPayload(payload: any): MonitorJob {
    return new MonitorJob(payload.schedulerId)
  }

}


export class LiveProbeJob extends JobCommand {

  static commandName = "job.live_probe"

  static fromPayload(payload: any): LiveProbeJob {
    return new LiveProbeJob()
  }

}

export class CancelJob extends JobCommand {

  static commandName = "job.cancel"
  readonly jobHandle: string

  constructor(jobHandle: string) {
    super();

    this.jobHandle = jobHandle
  }

  static fromPayload(payload: any): CancelJob {
    return new CancelJob(payload.jobHandle)
  }

}

export class CleanJobs extends JobCommand {

  static commandName = "job.clean"

  constructor() {
    super();
  }

  static fromPayload(payload: any): CleanJobs {
    return new CleanJobs()
  }

}