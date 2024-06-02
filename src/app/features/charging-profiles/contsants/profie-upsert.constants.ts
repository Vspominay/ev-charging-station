import {
  ChargingPhases, ChargingProfileKind, ChargingProfilePurpose, ChargingProfileRecurrency, ChargingRateUnit
} from '@features/charging-profiles/data-access/models/charging-profile.model';

export const ChargingProfileRecurrencyOptions = [
  { value: ChargingProfileRecurrency.Daily, label: 'depot.options.recurrency.daily' },
  { value: ChargingProfileRecurrency.Weekly, label: 'depot.options.recurrency.weekly' }
];

export const ChargingProfilePurposeOptions = [
  { value: ChargingProfilePurpose.MaxProfile, label: 'depot.options.purpose.maxProfile' },
  { value: ChargingProfilePurpose.Default, label: 'depot.options.purpose.default' },
  { value: ChargingProfilePurpose.Profile, label: 'depot.options.purpose.profile' }
];

export const ChargingProfileKindOptions = [
  { value: ChargingProfileKind.Absolute, label: 'depot.options.kind.absolute' },
  { value: ChargingProfileKind.Recurring, label: 'depot.options.kind.recurring' },
  { value: ChargingProfileKind.Relative, label: 'depot.options.kind.relative' }
];

export const ChargingRateUnitOptions = [
  { value: ChargingRateUnit.Amperes, label: 'depot.options.rateUnit.amperes' },
  { value: ChargingRateUnit.Watts, label: 'depot.options.rateUnit.watts' }
];

export const ChargingPhasesOptions = [
  { value: ChargingPhases.SinglePhase, label: 'depot.options.phases.singlePhase' },
  { value: ChargingPhases.ThreePhase, label: 'depot.options.phases.threePhase' }
];
