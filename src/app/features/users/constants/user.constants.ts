import { ERole } from '@features/auth/data-access/models/roles.enum';
import { EUserStatus } from '@features/users/data-access/models/user.type';

export const UserStatusOptions = [
  { value: EUserStatus.active, label: 'base.statuses.active' },
  { value: EUserStatus.inactive, label: 'base.statuses.blocked' }
];

export const UserStatusMap = UserStatusOptions.reduce((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {} as Record<EUserStatus, string>);

export const RoleOptions = [
  { value: ERole.Administrator, label: 'auth.role.Administrator' },
  { value: ERole.Employee, label: 'auth.role.Employee' },
  { value: ERole.Driver, label: 'auth.role.Driver' }
];
