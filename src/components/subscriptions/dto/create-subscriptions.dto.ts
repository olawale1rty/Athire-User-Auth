import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Expiration } from '../enitity/subscriptions.entity';

export class CreateSubscriptionsDto {
  @ApiProperty({ name: 'expirationDate', required: false })
  @IsOptional()
  readonly expirationDate: Expiration;
}
