import { EntityRepository, Repository } from 'typeorm';
import { Taqueria } from './taqueria.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from '../auth/user.entity';
import { GetTaqueriaDto } from './dto/get-taqueria-dto';
import { CreateTaqueriaDto } from './dto/create-taqueria-dto';
import { TaqueriaStatus } from './taqueria-status.enum';

@EntityRepository(Taqueria)
export class TaqueriaRepository extends Repository<Taqueria> {
  private logger = new Logger('TaqueiraRepository');
  async getTaqueriaById(
    filterDto: GetTaqueriaDto,
    user: User,
  ): Promise<Taqueria[]> {
    // const { status, search } = filterDto;
    // const query = this.createQueryBuilder('taqueria');
    // query.where('taqueria.')
    return null;
  }

  async getAllTaquerias(filterDto: GetTaqueriaDto): Promise<Taqueria[]> {
    const { status, search } = filterDto;
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
      daysOfTheWeek,
    } = CreateTaqueriaDto;
    const taqueria = new Taqueria();
    taqueria.name = name;
    taqueria.description = description;
    taqueria.latitude = latitude;
    taqueria.longitude = longitude;
    taqueria.daysOfTheWeek = daysOfTheWeek;
    taqueria.status = TaqueriaStatus.CLOSED;
    taqueria.user = user;
    await taqueria.save();

    delete taqueria.user;

    return taqueria;
  }
}
