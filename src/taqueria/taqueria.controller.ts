import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateTaqueriaDto } from './dto/create-taqueria-dto';
import { Taqueria } from './taqueria.entity';
import { TaqueriaService } from './taqueria.service';
import { GetTaqueriaDto } from './dto/get-taqueria-dto';
import { TaqueriaStatusValidationPipe } from './pipes/taqueria-status-validation.pipe';
import { TaqueriaStatus } from './taqueria-status.enum';

@Controller('taqueria')
export class TaqueriaController {
  private logger = new Logger('TaqueriaController');
  constructor(private taqueriaService: TaqueriaService) {}

  @Post()
  @UseGuards(AuthGuard())
  createTaqueria(
    @Body() CreateTaqueriaDto: CreateTaqueriaDto,
    @GetUser() user: User,
  ): Promise<Taqueria> {
    console.log(user);
    if (user.userType !== 'OWNER') {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.taqueriaService.createTaqueria(CreateTaqueriaDto, user);
  }
  @Get('getall')
  getAllTaquerias(@Query(ValidationPipe) filterDto: GetTaqueriaDto) {
    return this.taqueriaService.getAllTaquerias(filterDto);
  }

  @Get('/:id')
  getTaqueriaById(@Param('id', ParseIntPipe) id: number) {
    return this.taqueriaService.getTaqueriaById(id);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard())
  updateTaqueriaStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaqueriaStatusValidationPipe) status: TaqueriaStatus,
    @GetUser() user: User,
  ): Promise<Taqueria> {
    return this.taqueriaService.updateTaqueriaStatus(id, status, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  updateTaqueriaInfo(
    @Param('id', ParseIntPipe) id: number,
    @Body() Taqueria: Taqueria,
    @GetUser() user: User,
  ): Promise<Taqueria> {
    return this.taqueriaService.updateTaqueriaInfo(id, Taqueria, user);
  }
}
