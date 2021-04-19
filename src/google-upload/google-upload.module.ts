import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { GoogleUploadController } from './google-upload.controller';
import { GoogleUploadService } from './google-upload.service';
import { GoogleUploadRepository } from './google-upload.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaqueriaRepository } from '../taqueria/taqueria.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([GoogleUploadRepository, TaqueriaRepository]),
    AuthModule,
  ],
  controllers: [GoogleUploadController],
  providers: [GoogleUploadService],
})
export class GoogleUploadModule {}
