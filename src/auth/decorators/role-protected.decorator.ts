import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/shared/enums/UserRolesEnum';

export const META_ROLES = 'roles';
export const RoleProtected = (...args: UserRole[]) =>
  SetMetadata(META_ROLES, args);
