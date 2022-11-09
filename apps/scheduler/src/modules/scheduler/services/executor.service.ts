import { Injectable } from '@nestjs/common';


@Injectable()
export class ExecutorService {

  async execute(jobData: any): Promise<void> {
    console.log('Handled job')
  }

}