import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobEntity } from '../../../../shared/src/entities/job.entity';
import { Repository } from 'typeorm';


@Injectable()
export class JobStorage {

  constructor(
    @InjectRepository(JobEntity) private readonly jobsRepository: Repository<JobEntity>,
  ) {}

  async getAllJobs(): Promise<JobEntity[]> {
    return this.jobsRepository.find()
  }

}