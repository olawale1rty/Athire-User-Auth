import { ApiProperty } from '@nestjs/swagger';
import { Roles } from 'src/common/enums/roles.enum';

export class ChangeRoleDto {
  @ApiProperty()
  readonly role!: Roles;
}
