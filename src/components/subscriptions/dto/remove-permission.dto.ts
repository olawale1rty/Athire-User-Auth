import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class RemovePermissionDto {
  @ApiProperty()
  @IsArray()
  readonly permissions: string[];
}
