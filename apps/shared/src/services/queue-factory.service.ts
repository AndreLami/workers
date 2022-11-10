import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Bull from 'bull'

@Injectable()
export class QueueFactoryService {

  private readonly redisHost: string
  private readonly redisPort: string

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
    return new Bull(name, {
      redis: { host: this.redisHost, port: this.redisPort }
    })
  }

  createJobsQueue(): Bull.Queue {
    return this.createQueue('jobs')
  }

  createExecutionQueue(name: string): Bull.Queue {
    return this.createQueue(`execution.${name}`)
  }

  getCancelQueue(name: string): Bull.Queue {
    return this.createQueue(`cancel.${name}`)
  }

}