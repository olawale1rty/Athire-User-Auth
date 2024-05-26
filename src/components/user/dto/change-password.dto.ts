import { ApiProperty } from "@nestjs/swagger";

export class ChangePasswordDto {
  @ApiProperty()
  readonly currentPassword!: string;

  @ApiProperty()
  readonly password!: string;
}
