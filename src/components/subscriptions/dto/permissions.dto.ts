import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class PermissionsDto {
  @ApiProperty()
  @IsArray()
  readonly permissions: string[];
}
