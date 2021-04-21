import { InjectRepository } from '@nestjs/typeorm';
import { TaqueriaRepository } from './taqueria.repository';
import { GetTaqueriaDto } from './dto/get-taqueria-dto';
import { User } from '../auth/user.entity';
import { Taqueria } from './taqueria.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaqueriaDto } from './dto/create-taqueria-dto';
import { TaqueriaStatus } from './taqueria-status.enum';

@Injectable()
export class TaqueriaService {
  constructor(
    @InjectRepository(TaqueriaRepository)
    private TaqueriaRepository: TaqueriaRepository,
  ) {}
  //   getTaquerias(filterDto: GetTaqueriaDto, user: User): Promise<Taqueria[]> {
  //     return this.TaqueriaRepository.getTaquerias(filterDto, user);
  //   }
  async getTaqueriaById(id: number): Promise<Taqueria> {
    const found = await this.TaqueriaRepository.findOne({
      where: { id },
    });
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }
  async getMyTaquerias(userId: number): Promise<Taqueria[]> {
    const found = await this.TaqueriaRepository.find({ where: { userId } });
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }
  getAllTaquerias(filterDto: GetTaqueriaDto): Promise<Taqueria[]> {
    return this.TaqueriaRepository.getAllTaquerias(filterDto);
  }

  createTaqueria(
    CreateTaqueriaDto: CreateTaqueriaDto,
    user: User,
  ): Promise<Taqueria> {
    return this.TaqueriaRepository.createTaqueria(CreateTaqueriaDto, user);
  }

  async updateTaqueriaStatus(
    id: number,
    status: TaqueriaStatus,
    user: User,
  ): Promise<Taqueria> {
    const taqueria = await this.TaqueriaRepository.findOne({
      where: { id, userId: user.id },
    });
    taqueria.status = status;
    await taqueria.save();
    return taqueria;
  }

  async updateTaqueriaInfo(
    id: number,
    Taqueria: Taqueria,
    user: User,
  ): Promise<Taqueria> {
    const taqueria = await this.TaqueriaRepository.findOne({
      where: { id, userId: user.id },
    });
    taqueria.latitude = Taqueria.latitude;
    taqueria.longitude = Taqueria.longitude;
    taqueria.name = Taqueria.name;
    taqueria.description = Taqueria.description;
    await taqueria.save();
    return taqueria;
  }
}
