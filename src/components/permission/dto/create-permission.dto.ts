import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    name: 'name',
    description: 'permissions name should be all caps',
    required: true,
  })
  @IsString()
  readonly name: string;
}
