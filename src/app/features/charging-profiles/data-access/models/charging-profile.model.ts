import { TUpsertInfo } from '@core/types/upsert-info.type';
import { PartialByKeys } from '@shared/utils/types/partial-by-keys.util';
import { WithGuid } from '@shared/utils/types/with-guid.type';

export enum ChargingProfileRecurrency {
  Daily,
  Weekly
}

export enum ChargingProfilePurpose {
  MaxProfile,
  Default,
  Profile
}

export enum ChargingProfileKind {
  Absolute,
  Recurring,
  Relative
}

export enum ChargingRateUnit {
  Amperes,
  Watts
}

export enum ChargingPhases {
  SinglePhase = 1,
  ThreePhase = 3
}

export type TChargingSchedulePeriod = WithGuid<{
  /**
   * The start period of the profile.
   *
   * In seconds from the start of the charging period.
   */
  startPeriod: number;
  /**
   * The limit of the profile.
   *
   * The limit is the maximum power or current that the profile can have.
   */
  limit: number;
  numberPhases: ChargingPhases;
}>;

export type TChargingProfile = TUpsertInfo & WithGuid<{
  name: string;
  chargingProfileId: number;
  /**
   * The priority level of the profile amongst the other profiles.
   *
   * The higher the value, the higher the priority.
   */
  stackLevel: number;

  validFrom: string;
  validTo: string;

  /**
   * The recurrency kind of the profile.
   *
   * Daily: The profile is valid for a day.
   * Weekly: The profile is valid for a week.
   */
  recurrencyKind: ChargingProfileRecurrency;
  /**
   * The purpose of the profile.
   *
   * MaxProfile: The profile is used to set the maximum power or current.
   * Default: The profile is used to set the default power or current.
   * Profile: The profile is used to set the power or current.
   */
  chargingProfilePurpose: ChargingProfilePurpose;
  /**
   * The kind of the profile.
   *
   * Absolute: Fixed, non-recurring schedules and limits. Ideal for specific, one-time charging requirements.
   * Recurring: Repeats based on a defined schedule (daily, weekly). Suitable for regular, ongoing charging patterns.
   * Relative: Adapts based on other profiles or conditions. Useful for dynamic and responsive charging strategies.
   */
  chargingProfileKind: ChargingProfileKind;

  /**
   * The duration of the profile in seconds.
   */
  duration: number;
  /**
   * The start schedule of the profile.
   *
   * The start schedule is the time at which the profile starts.
   */
  startSchedule: string;
  /**
   * The unit of the scheduling.
   *
   * A: The scheduling unit is in Amperes.
   * W: The scheduling unit is in Watts.
   */
  schedulingUnit: ChargingRateUnit;
  /**
   * The minimum charging rate of the profile.
   *
   * The minimum charging rate is the minimum power or current that the profile can have.
   */
  minChargingRate: number;

  chargingSchedulePeriods: Array<TChargingSchedulePeriod>;
}>;

export type TUpsertChargingProfile = PartialByKeys<Omit<TChargingProfile, 'chargingProfileId' | 'createdAt' | 'updatedAt'>, 'id'>;
