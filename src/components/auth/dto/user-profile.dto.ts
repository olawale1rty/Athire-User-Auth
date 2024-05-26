import { User } from 'src/components/user/entity/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty()
  readonly success!: boolean;

  @ApiProperty()
  readonly user!: User;

  @ApiProperty()
  readonly perks!: Array<string>;

  @ApiProperty()
  readonly token!: string;
}
