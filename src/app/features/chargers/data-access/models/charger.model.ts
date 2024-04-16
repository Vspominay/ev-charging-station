import { WithGuid } from '@shared/utils/types/with-guid.type';

export type TCharger = WithGuid<{
  chargePointSerialNumber: string;
}>;
