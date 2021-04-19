import { Test, TestingModule } from '@nestjs/testing';
import { GoogleUploadService } from './google-upload.service';

describe('GoogleUploadService', () => {
  let service: GoogleUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleUploadService],
    }).compile();

    service = module.get<GoogleUploadService>(GoogleUploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
