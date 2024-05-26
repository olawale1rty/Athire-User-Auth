import { UserRole } from '../entity/user-role.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UserReadDto {
  @ApiProperty()
  readonly id!: string;

  @ApiProperty()
  readonly firstName!: string;

  @ApiProperty()
  readonly lastName!: string;

  @ApiProperty()
  readonly phone!: string;

  @ApiProperty()
  readonly email!: string;

  @ApiProperty()
  readonly isVerified: boolean;

  @ApiProperty()
  readonly platforms: Array<UserRole>;

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    isVerified: boolean,
    platforms: Array<UserRole>,
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.email = email;
    this.isVerified = isVerified;
    this.platforms = platforms;
  }
}
