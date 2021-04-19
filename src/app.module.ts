import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaqueriaModule } from './taqueria/taqueria.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthController } from './auth/auth.controller';
import { GoogleUploadModule } from './google-upload/google-upload.module';

@Module({
  imports: [TaqueriaModule, AuthModule, TypeOrmModule.forRoot(typeOrmConfig), GoogleUploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
