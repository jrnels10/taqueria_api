import { EntityRepository, Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { GoogleFiles } from './google-upload.entity';
import { Taqueria } from '../taqueria/taqueria.entity';
import { User } from 'src/auth/user.entity';

@EntityRepository(GoogleFiles)
export class GoogleUploadRepository extends Repository<GoogleFiles> {
  private logger = new Logger('GoogleFiles');

  async createImage(
    image: any,
    taqueria: Taqueria,
    user: User,
  ): Promise<string> {
    const { fileUrl, fileName, fileSize } = image;

    const photo = new GoogleFiles();
    photo.fileName = fileName;
    photo.fileUrl = fileUrl;
    photo.fileSize = fileSize;
    photo.taqueria = taqueria;
    photo.user = user;
    photo.taqueriaId = taqueria.id;

    await photo.save();

    delete photo.user;
    delete photo.taqueria;

    return image;
  }
}
