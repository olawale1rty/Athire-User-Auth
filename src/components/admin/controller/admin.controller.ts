import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Roles as Role } from 'src/common/enums/roles.enum';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guard/permissions.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { IAdminService } from '../interface/admin.service.interface';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('admin')
@Controller('admin')
@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class AdminController {
  constructor(
    @Inject('IAdminService')
    private readonly adminService: IAdminService,
  ) {}

  @ApiOkResponse()
  @Get('/dashboard')
  async dashboard() {
    return this.adminService.dashboard();
  }
}
