import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class RolesDto {
  @ApiProperty()
  @IsArray()
  readonly roles: string;
}
