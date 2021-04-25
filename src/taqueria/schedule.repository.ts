import { EntityRepository, Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { Schedule } from './schedule.entity';

@EntityRepository(Schedule)
export class ScheduleRepository extends Repository<Schedule> {
  private logger = new Logger('ScheduleRepository');
}
