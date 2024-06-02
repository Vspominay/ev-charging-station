import { ERole } from '@features/auth/data-access/models/roles.enum';
import { WithGuid } from '@shared/utils/types/with-guid.type';

export type TSessionUser = WithGuid<{
  fullName: string,
  email: string,
  role: ERole
}>;
