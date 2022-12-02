import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Bull from 'bull'

@Injectable()
export class QueueFactoryService {

  private readonly redisHost: string
  private readonly redisPort: number

  constructor(configService: ConfigService) {
    const redisHost = configService.get('REDIS_HOST')
    const redisPort = configService.get('REDIS_PORT')

    if (redisPort == undefined || redisHost == undefined) {
      const redisError = "Queue factor issue, host/port not defined in config!"
      console.log('Redis error', redisError)
      throw redisError
    }

    this.redisHost = redisHost
    this.redisPort = redisPort
  }

  createQueue(name: string): Bull.Queue {
    let queueOptions: Bull.QueueOptions = {
      redis: { host: this.redisHost, port: this.redisPort }
    };
    return new Bull(name, queueOptions)
  }

  createJobsQueue(): Bull.Queue {
    return this.createQueue('jobs')
  }

  getJobQueue(name: string): Bull.Queue {
    return this.createQueue(`job.${name}`)
  }

  getSchedulerQueue(name: string): Bull.Queue {
    return this.createQueue(`scheduler.${name}`)
  }

}