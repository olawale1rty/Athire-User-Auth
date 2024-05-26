import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginPayload {
  @ApiProperty()
  @IsEmail()
  readonly email!: string;

  /*  @ApiProperty()
  readonly platform!: string; */

  @ApiProperty()
  @IsString()
  readonly password!: string;
}
