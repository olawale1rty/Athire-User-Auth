import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserCreateDto {
  @ApiProperty()
  @IsString()
  readonly firstName!: string;

  @ApiProperty()
  @IsString()
  readonly lastName!: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly phone!: string;

  @ApiProperty()
  @IsEmail()
  readonly email!: string;

  /* @ApiProperty()
  readonly platform!: string; */

  @ApiProperty()
  @IsString()
  readonly password!: string;
}
