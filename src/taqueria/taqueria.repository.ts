import { EntityRepository, Repository } from 'typeorm';
import { Taqueria } from './taqueria.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from '../auth/user.entity';
import { GetTaqueriaDto } from './dto/get-taqueria-dto';
import { CreateTaqueriaDto } from './dto/create-taqueria-dto';
import { TaqueriaStatus } from './taqueria-status.enum';
import { Schedule } from './schedule.entity';

@EntityRepository(Taqueria)
export class TaqueriaRepository extends Repository<Taqueria> {
  private logger = new Logger('TaqueiraRepository');

  async getAllTaquerias(filterDto: GetTaqueriaDto): Promise<Taqueria[]> {
    const { status, search, days } = filterDto;
    const query = this.createQueryBuilder('taqueria');

    if (status) {
      query.where('taqueria.status=:status', { status });
    }
    if (search) {
      query.andWhere(
        '(lower(taqueria.name) LIKE :search OR lower(taqueria.description) LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (days) {
      const daysString = days
        .split(',')
        .map((day, idx, arr) => {
          return `${day} = :trueDay ${arr.length - 1 == idx ? '' : ' OR '}`;
        })
        .join('');
      query
        .leftJoinAndSelect(
          Schedule,
          'schedule',
          'schedule.taqueriaId = taqueria.id',
        )
        .andWhere(daysString, {
          trueDay: true,
        });
    }
    try {
      const taqueria = query.getMany();
      return taqueria;
    } catch (error) {
      this.logger.error(`Failed to get task"`, error.stack);
      throw new InternalServerErrorException();
    }
  }

  async createTaqueria(
    CreateTaqueriaDto: CreateTaqueriaDto,
    user: User,
  ): Promise<Taqueria> {
    const {
      name,
      description,
      latitude,
      longitude,
      openDays,
    } = CreateTaqueriaDto;
    const taqueria = new Taqueria();
    taqueria.name = name;
    taqueria.description = description;
    taqueria.latitude = latitude;
    taqueria.longitude = longitude;
    taqueria.status = TaqueriaStatus.CLOSED;
    taqueria.user = user;
    taqueria.createDate = new Date();
    const taco = await taqueria.save();
    const schedule = new Schedule({});
    openDays.split(',').map(day => (schedule[day] = true));
    schedule.createDate = new Date();
    schedule.taqueriaId = taco.id;
    await schedule.save();
    delete schedule.taqueriaId;
    delete taqueria.user;

    return taqueria;
  }
}
