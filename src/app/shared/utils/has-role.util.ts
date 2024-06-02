import { ERole } from '@features/auth/data-access/models/roles.enum';
import { toArray } from '@shared/utils/to-array.util';

export const hasRole = (role: ERole, neededRoles: ERole | Array<ERole>): boolean => toArray(neededRoles).includes(role);
