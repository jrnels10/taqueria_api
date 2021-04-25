import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import multer, { diskStorage, memoryStorage } from 'multer';
import { GoogleUploadService } from './google-upload.service';
import { Taqueria } from '../taqueria/taqueria.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
const keyFilename = './config/grandmasRecipes-49091d2bc82f.json';

@UseGuards(AuthGuard())
@Controller('google-upload')
export class GoogleUploadController {
  constructor(private GoogleUploadService: GoogleUploadService) {}
  private logger = new Logger('GoogleImageController');

  @Post('/:id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          console.log(file.toString());
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
      },
    }),
  )
  async createImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
  ): Promise<any> {
    return this.GoogleUploadService.createTacoImage(id, file, user);
  }
  @Delete('/:id')
  deleteImageById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<string> {
    return this.GoogleUploadService.deleteTacoImageById(id, user);
  }
}
