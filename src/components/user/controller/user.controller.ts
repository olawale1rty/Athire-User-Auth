import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { UserCreateDto } from 'src/components/auth/dto/user-create.dto';
import { ChangeRoleDto } from '../dto/change-role.dto';
import { UserUpdateDto } from '../dto/user-update.dto';
import { UserServiceInterface } from '../interface/user.service.interface';
import { Roles as Role } from 'src/common/enums/roles.enum';
import { User } from '../entity/user.entity';
import { Profile } from 'src/common/decorators/profile.decorator';
import { ChangePasswordDto } from '../dto/change-password.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(
    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,
  ) {}

  @ApiBody({ type: UserCreateDto })
  @ApiCreatedResponse()
  @ApiUnauthorizedResponse()
  @Roles(Role.ADMIN)
  @Post()
  public async create(@Body() user: UserCreateDto) {
    return this.userService.create(user, true);
  }

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @Roles(Role.ADMIN, Role.USER, Role.AGENT)
  @Get(':userid')
  public async getUser(@Param('userid') userid: string) {
    return this.userService.getUser(userid);
  }

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @Roles(Role.ADMIN, Role.USER)
  @Get('info/:email')
  public async getUserByEmail(@Param('email') email: string) {
    return this.userService.getUserByEmail(email);
  }

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @Roles(Role.ADMIN)
  @Get()
  public async getUsers() {
    return this.userService.getUsers();
  }

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @Roles(Role.ADMIN, Role.USER)
  @Post('findusers')
  public async getUsersByIds(@Body() ids: string[]) {
    return this.userService.getUsersByIds(ids);
  }

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @Roles(Role.ADMIN)
  @Put('/:userid/activate')
  async verifyUser(
    @Param('userid') userId: string,
    @Body() { isVerified }: { isVerified: boolean },
  ) {
    await this.userService.verifyUser(userId, isVerified);
    return {
      success: true,
      message: 'user activation: ' + isVerified,
    };
  }

  @ApiBody({ type: UserUpdateDto })
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @Roles(Role.ADMIN, Role.USER, Role.AGENT)
  @Put(':userid/update')
  public async update(
    @Param('userid') id: string,
    @Body() userUpdateDto: UserUpdateDto,
  ) {
    return this.userService.update(id, userUpdateDto);
  }

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @Roles(Role.ADMIN, Role.USER)
  @Get('role/:role')
  async findByRole(@Param('role') role: string) {
    return this.userService.findByRole(role);
  }

  @ApiBody({ type: ChangeRoleDto })
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @Roles(Role.ADMIN)
  @Put('/:userid/changerole')
  public async changeUserRole(
    @Param('userid') id: string,
    @Body() role: ChangeRoleDto,
  ) {
    return this.userService.changeUserRole(id, role);
  }

  @ApiBody({ type: ChangePasswordDto })
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @Roles(Role.ADMIN, Role.USER, Role.AGENT)
  @Put('/change-password')
  public async changePassword(
    @Profile() { email }: User,
    @Body() passwordInfo: ChangePasswordDto,
  ) {
    return this.userService.changePassword(email, passwordInfo.currentPassword, passwordInfo.password);
  }

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @Roles(Role.USER)
  @Put('/:userid/change-to-agent')
  public async changeUserToAgent(
    @Param('userid') id: string,
  ) {
    return this.userService.changeUserToAgent(id, Role.AGENT);
  }

  /* @ApiBody({ type: RolesDto })
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @Roles(Role.ADMIN)
  // @Permissions(Permission.CAN_ASSIGN_ROLE)
  @Patch('/:userid/addroles')
  public async addRoles(
    @Param('userid') userId: string,
    @Body() roles: RolesDto,
  ) {
    return this.userService.addRole(userId, roles.roles);
  } */

  /* @ApiBody({ type: RemoveRoleDto })
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @Roles(Role.ADMIN)
  // @Permissions(Permission.CAN_EDIT_PROFILE)
  @Patch('/:userid/removeroles')
  public async removeRoles(
    @Param('userid') userId: string,
    @Body() role: RemoveRoleDto,
  ) {
    return this.userService.removeRole(userId, role.role);
  } */

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @Roles(Role.ADMIN)
  @Delete(':userid')
  public async deleteUser(@Param('userid') userid: string) {
    return this.userService.deleteUser(userid);
  }
}
