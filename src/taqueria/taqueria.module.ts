import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { TaqueriaController } from './taqueria.controller';
import { TaqueriaRepository } from './taqueria.repository';
import { TaqueriaService } from './taqueria.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaqueriaRepository]), AuthModule],
  controllers: [TaqueriaController],
  providers: [TaqueriaService],
})
export class TaqueriaModule {}
