import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';


@Entity({ name: 'jobs', schema: 'public' })
export class JobEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
}