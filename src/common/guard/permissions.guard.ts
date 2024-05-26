import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Permission as perms } from 'src/components/permission/enitity/permission.entity';
import { PERMISSION_KEY } from '../decorators/permissions.decorator';
import { Permission } from '../enums/permission.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const routePermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSION_KEY,
      [context.getHandler()],
    );

    const perm: any = [];
    const { user } = context.switchToHttp().getRequest();

    if (context.getArgs()[0].user.role.role !== 'admin') {
      user.user.role.subscription.permissions.map((permission: perms) =>
        perm.push(permission.name),
      );
    } else {
      return true;
    }

    if (!routePermissions) return true;

    const hasPermission = () =>
      routePermissions.every((routePermission) =>
        perm.includes(routePermission),
      );

    return hasPermission();
  }
}
