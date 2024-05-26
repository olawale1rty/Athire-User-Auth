import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UserUpdateDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly firstName!: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly lastName!: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly phone!: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  readonly email!: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  password!: string;
}
