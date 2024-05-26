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
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';
import { PermissionServiceInterface } from '../interface/permission.service.interface';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Roles as Role } from 'src/common/enums/roles.enum';
import { PermissionsGuard } from 'src/common/guard/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { Permission } from 'src/common/enums/permission.enum';


@ApiTags('permissions')
@ApiBearerAuth()
@Controller('permissions')
@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class PermissionController {
  constructor(
    @Inject('PermissionServiceInterface')
    private readonly permissionService: PermissionServiceInterface,
  ) {}

  @ApiBody({ type: CreatePermissionDto })
  @ApiCreatedResponse()
  @ApiUnauthorizedResponse()
  @Post()
  @ApiOperation({deprecated: true})
  @Permissions(Permission.CAN_CREATE_PERMISSION)
  async create(@Body() permission: CreatePermissionDto) {
    return await this.permissionService.create(permission);
  }

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @Get()
  @ApiOperation({deprecated: true})
  @Permissions(Permission.CAN_VIEW_ALL_PERMISSIONS)
  async findAll() {
    return await this.permissionService.findAll();
  }

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @Permissions(Permission.CAN_VIEW_PERMISSION)
  @Get('/:id')
  @ApiOperation({deprecated: true})
  async findOneById(@Param('id') id: string) {
    return await this.permissionService.findOneById(id);
  }

  @ApiBody({ type: UpdatePermissionDto })
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiOperation({deprecated: true})
  @Permissions(Permission.CAN_MODIFY_PERMISSION)
  @Put('/:id/update')
  async update(@Param('id') id: string, @Body() data: UpdatePermissionDto) {
    return await this.permissionService.updata(id, data);
  }

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiOperation({deprecated: true})
  @Permissions(Permission.CAN_DELETE_PERMISSION)
  @Delete('/:id/delete')
  async delete(@Param('id') id: string) {
    return await this.permissionService.delete(id);
  }
}
