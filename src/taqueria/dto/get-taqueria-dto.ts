import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';
import { TaqueriaStatus } from '../taqueria-status.enum';

export class GetTaqueriaDto {
  @IsOptional()
  @IsIn([TaqueriaStatus.OPEN, TaqueriaStatus.CLOSED])
  status: TaqueriaStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
  @IsOptional()
  @IsNotEmpty()
  days: string;
}
