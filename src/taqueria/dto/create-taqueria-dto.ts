import { IsNotEmpty } from 'class-validator';

export class CreateTaqueriaDto {
  @IsNotEmpty()
  name: string;
  description: string;
  @IsNotEmpty()
  latitude: number;
  @IsNotEmpty()
  longitude: number;
}
