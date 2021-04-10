import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaqueriaStatus } from '../taqueria-status.enum';

export class TaqueriaStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [TaqueriaStatus.OPEN, TaqueriaStatus.CLOSED];
  transform(value: any) {
    value = value.toUpperCase();
    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} is an invalid status!`);
    }
    return value;
  }

  private isStatusValid(status: any) {
    const idx = this.allowedStatuses.indexOf(status);
    return idx !== -1;
  }
}
