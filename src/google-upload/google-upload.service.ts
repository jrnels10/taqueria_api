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
const keyFile = './config/gcloud.json';
import * as config from 'config';
import { GoogleFiles } from './google-upload.entity';
import * as sharp from 'sharp';
import stream, { Stream } from 'stream';

const gCloudConfig = config.get('gcloud');
const keyFilename = process.env.GCLOUD_PROJECT || keyFile;
@Injectable()
export class GoogleUploadService {
  constructor(
    @InjectRepository(GoogleUploadRepository)
    private GoogleUploadRepository: GoogleUploadRepository,
    @InjectRepository(TaqueriaRepository)
    private TaqueriaRepository: TaqueriaRepository,
  ) {}
  private googleService = new Storage({
    projectId: process.env.GCLOUD_PROJECT_ID || gCloudConfig.GCLOUD_PROJECT_ID,
    keyFilename,
  });

  async createTacoImage(
    id: number,
    @UploadedFile() file: Express.Multer.File,
    user: User,
  ): Promise<GoogleFiles> {
    const dataStream = new Stream.PassThrough();
    const originaName = file.originalname.split('.');
    const fileName = `${originaName[0]}_${moment(new Date()).format(
      'MMDDYYYY_HH:mm:ss',
    )}.${originaName[1]}`;
    const gcFile = this.googleService
      .bucket(
        process.env.GCLOUD_STORAGE_BUCKET || gCloudConfig.GCLOUD_STORAGE_BUCKET,
      )
      .file(fileName);
    dataStream.push(file.buffer);
    dataStream.push(null);
    const resizer = sharp().resize(800, 600);
    const onCreatePromise = (stream: any) => {
      return new Promise((resolve, reject) => {
        stream
          .pipe(resizer)
          .pipe(
            gcFile.createWriteStream({
              resumable: false,
              validation: false,
              metadata: { 'Cache-Control': 'public, max-age=31536000' },
            }),
          )
          .on('error', (error: Error) => {
            reject(error);
          })
          .on('finish', () => {
            const publicUrl = `https://storage.googleapis.com/${process.env
              .GCLOUD_STORAGE_BUCKET ||
              gCloudConfig.GCLOUD_STORAGE_BUCKET}/${fileName}`;
            gcFile.makePublic();
            resolve(publicUrl);
          });
      });
    };
    const fileUrl = await onCreatePromise(dataStream);
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

  async deleteTacoImageById(id: number, user: User): Promise<string> {
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
        .bucket(gCloudConfig.GCLOUD_STORAGE_BUCKET)
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
    } else {
      console.log('deleted!');
      return 'deleted!';
    }
  }
}
