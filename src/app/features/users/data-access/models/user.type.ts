import { TUpsertInfo } from '@core/types/upsert-info.type';
import { ERole } from '@features/auth/data-access/models/roles.enum';
import { TOcppTag } from '@features/ocpp-tags/data-access/models/ocpp-tag.model';
import { PartialByKeys } from '@shared/utils/types/partial-by-keys.util';
import { WithGuid } from '@shared/utils/types/with-guid.type';

export enum EUserStatus {
  active = 'Active',
  inactive = 'Inactive'
}

export type TUser = TUpsertInfo & WithGuid<{
  firstName: string;
  lastName: string;
  email: string;
  ocppTagId: TOcppTag['id'];

  role: ERole;

  image?: string;
}>;

export type TUserUpsert = PartialByKeys<Omit<TUser, 'createdAt' | 'updatedAt'>, 'id'> & {
  expiration: string;
};
