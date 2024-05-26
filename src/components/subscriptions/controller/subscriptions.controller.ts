import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
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
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { CreateSubscriptionsDto } from '../dto/create-subscriptions.dto';
import { RemovePermissionDto } from '../dto/remove-permission.dto';
import { UpdateSubscriptionsDto } from '../dto/update-subscriptions.dto';
import { SubscriptionsServiceInterface } from '../interface/subscriptions.service.inaterface';
import { Roles as Role } from 'src/common/enums/roles.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PermissionsGuard } from 'src/common/guard/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { Permission } from 'src/common/enums/permission.enum';
import { PermissionsDto } from '../dto/permissions.dto';

@ApiTags('subscriptions')
@ApiBearerAuth()
@Controller('subscriptions')
@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class SubscriptionsController {
  constructor(
    @Inject('SubscriptionsServiceInterface')
    private readonly subscriptionsService: SubscriptionsServiceInterface,
  ) {}

  @ApiBody({ type: CreateSubscriptionsDto })
  @ApiCreatedResponse()
  @ApiUnauthorizedResponse()
  @Permissions(Permission.CAN_CREATE_ROLE)
  @Post()
  async create(@Body() role: CreateSubscriptionsDto) {
    return this.subscriptionsService.create(role);
  }

  @ApiOkResponse()
  // @ApiUnauthorizedResponse()
  // @Permissions(Permission.CAN_VIEW_ALL_ROLES)
  @Get()
  async findAll() {
    return this.subscriptionsService.findAll();
  }

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @Get('/:id')
  @Permissions(Permission.CAN_VIEW_ROLE)
  async findOneById(@Param('id') id: string) {
    return this.subscriptionsService.findOneById(id);
  }

  @ApiBody({ type: UpdateSubscriptionsDto })
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @Permissions(Permission.CAN_MODIFY_ROLE)
  @Put('/:id/update')
  async update(@Param('id') id: string, @Body() data: UpdateSubscriptionsDto) {
    return this.subscriptionsService.updata(id, data);
  }

  @ApiBody({ type: RemovePermissionDto })
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @Permissions(Permission.CAN_MODIFY_ROLE)
  @Put('/:subscriptionid/removepermissions')
  async removePermission(
    @Param('subscriptionid') subscriptionId: string,
    @Body() permission: RemovePermissionDto,
  ) {
    return this.subscriptionsService.removePermissions(
      subscriptionId,
      permission.permissions,
    );
  }

  @ApiBody({ type: PermissionsDto })
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @Permissions(Permission.CAN_MODIFY_ROLE)
  @Put('/:subscriptionid/addpermissions')
  async addPermission(
    @Param('subscriptionid') subscriptionId: string,
    @Body() permission: PermissionsDto,
  ) {
    await this.subscriptionsService.addPermissions(
      subscriptionId,
      permission.permissions,
    );

    return {
      success: true,
      message: 'permission added successfully',
    };
  }

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @Permissions(Permission.CAN_DELETE_ROLE)
  @Delete('/:id/delete')
  async delete(@Param('id') id: string) {
    return this.subscriptionsService.delete(id);
  }
}
