import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RemoveRoleDto {
  @ApiProperty()
  @IsString()
  readonly role: string;
}
