import { ERole } from '@features/auth/data-access/models/roles.enum';
import { toArray } from '@shared/utils/to-array.util';

export const hasRole = (roles: Array<ERole>, neededRoles: ERole | Array<ERole>): boolean => {
  const neededRolesArray = toArray(neededRoles);
  return neededRolesArray.some((role) => roles.includes(role));
};
