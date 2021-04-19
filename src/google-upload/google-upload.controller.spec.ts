import { Test, TestingModule } from '@nestjs/testing';
import { GoogleUploadController } from './google-upload.controller';

describe('GoogleUploadController', () => {
  let controller: GoogleUploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoogleUploadController],
    }).compile();

    controller = module.get<GoogleUploadController>(GoogleUploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
