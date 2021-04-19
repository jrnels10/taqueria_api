import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UploadedFile,
} from '@nestjs/common';
import * as moment from 'moment';
import { GoogleUploadRepository } from './google-upload.repository';
import { Storage } from '@google-cloud/storage';
import { InjectRepository } from '@nestjs/typeorm';
import { TaqueriaRepository } from 'src/taqueria/taqueria.repository';
import { User } from 'src/auth/user.entity';
const keyFilename = './config/grandmasRecipes-49091d2bc82f.json';

@Injectable()
export class GoogleUploadService {
  constructor(
    @InjectRepository(GoogleUploadRepository)
    private GoogleUploadRepository: GoogleUploadRepository,
    @InjectRepository(TaqueriaRepository)
    private TaqueriaRepository: TaqueriaRepository,
  ) {}
  private googleService = new Storage({
    projectId: 'grandmasrecipes',
    keyFilename,
  });

  async createTacoImage(
    id: number,
    @UploadedFile() file: Express.Multer.File,
    user: User,
  ): Promise<string> {
    const tacoBucket = this.googleService.bucket('mi-taqueria-dev');
    const originaName = file.originalname.split('.');
    const fileName = `${originaName[0]}_${moment(new Date()).format(
      'MMDDYYYY_HH:mm:ss',
    )}.${originaName[1]}`;
    const blob = tacoBucket.file(fileName);
    const blobStream = blob.createWriteStream();
    blobStream.on('error', err => {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Error uploading image!',
        },
        HttpStatus.FORBIDDEN,
      );
    });

    blobStream.end(file.buffer);
    const onCreatePromise = (stream: any) => {
      return new Promise<string>((res, rej) => {
        stream.on('finish', async () => {
          const publicUrl = `https://storage.googleapis.com/${tacoBucket.name}/${fileName}`;
          await blob.makePublic();
          res(publicUrl);
        });
        stream.on('error', rej);
      });
    };
    const fileUrl = await onCreatePromise(blobStream);
    const image = {
      fileName,
      fileUrl,
      fileSize: file.size,
    };
    const taqueria = await this.TaqueriaRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!taqueria) {
      throw new NotFoundException();
    }
    return this.GoogleUploadRepository.createImage(image, taqueria, user);
  }

  async deleteTacoImageById(id: number, user: User): Promise<void> {
    // Only the owner can delete the image.
    const foundFileMeta = await this.GoogleUploadRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!foundFileMeta) {
      throw new NotFoundException();
    }

    // If image is found in Postgres db, then initiate the delete from GoogleCloud
    try {
      this.googleService
        .bucket('mi-taqueria-dev')
        .file(foundFileMeta.fileName)
        .delete();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error,
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // If image was successfully from GoogleCloud, then delete from Postgres.
    const results = await this.GoogleUploadRepository.delete({
      id,
      userId: user.id,
    });
    if (results.affected === 0) {
      throw new NotFoundException(`Image with ID "${id}" not found`);
    }
  }
}
