import { TUpsertInfo } from '@core/types/upsert-info.type';
import { WithGuid } from '@shared/utils/types/with-guid.type';

export type TOcppTag = TUpsertInfo & WithGuid<{
  tagId: string,
  parentTagId: string | null,
  expiryDate: string,
  blocked: boolean,
}>;

export type TUpsertOcppTag = Pick<TOcppTag, 'tagId' | 'parentTagId' | 'expiryDate'>;
