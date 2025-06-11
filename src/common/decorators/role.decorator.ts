import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '../utils/role.enum';
import { PermissionEnum } from '../utils/permission.enum';

export const Role = (...roles: RoleEnum[]) => SetMetadata('roles', roles);
export const Permission = (...permissions: PermissionEnum[]) => SetMetadata('permissions', permissions);
