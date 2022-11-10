import { Injectable } from '@nestjs/common';


@Injectable()
export class ExecutorService {

  async execute(jobData: any): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('Finished')
        resolve()
      }, 2000)
    })
  }

}