import { numberAttribute, Pipe, PipeTransform } from '@angular/core';
import { TChargerLimit } from '@features/depot/data-access/models/depot-configuration.model';
import { EnergyPipe } from '@shared/pipes/energy.pipe';

type TChargerStats = {
  label: string;
  value: number | string;
};

@Pipe({
  name: 'chargersStats',
  standalone: true
})
export class DepotConfigChargerStatsPipe implements PipeTransform {
  private readonly energyPipe = new EnergyPipe();

  transform(
    chargers: Record<TChargerLimit['chargePointId'], TChargerLimit['chargePointEnergyLimit']>,
    availablePower?: number
  ): Array<TChargerStats> {
    const chargersPower = Object.values(chargers) as Array<TChargerLimit['chargePointEnergyLimit']>;

    return [
      this.getTotalChargers(chargersPower),
      this.getConfiguratedChargers(chargersPower),
      this.getAvailableChargers(chargersPower),
      this.getSumPower(chargersPower),
      this.getLeftPower(chargersPower, availablePower ?? 0)
    ];
  }

  private getConfiguratedChargers(chargers: Array<TChargerLimit['chargePointEnergyLimit']>): TChargerStats {
    return {
      label: 'depot.config.charger-stats.configured-chargers',
      value: chargers.filter(power => power > 0).length
    };
  }

  private getAvailableChargers(chargers: Array<TChargerLimit['chargePointEnergyLimit']>): TChargerStats {
    return {
      label: 'depot.config.charger-stats.available-chargers',
      value: chargers.filter(power => numberAttribute(power, 0) === 0).length
    };
  }

  private getTotalChargers(chargers: Array<TChargerLimit['chargePointEnergyLimit']>): TChargerStats {
    return {
      label: 'depot.config.charger-stats.total-chargers',
      value: chargers.length
    };
  }

  private getSumPower(chargers: Array<TChargerLimit['chargePointEnergyLimit']>): TChargerStats {
    return {
      label: 'depot.config.charger-stats.total-power',
      value: this.energyPipe.transform(chargers.reduce((acc, power) => acc + power, 0))
    };
  }

  private getLeftPower(
    chargers: Array<TChargerLimit['chargePointEnergyLimit']>,
    availablePower: number
  ): TChargerStats {
    return {
      label: 'depot.config.charger-stats.left-power',
      value: this.energyPipe.transform((availablePower * 1000) - chargers.reduce((acc, power) => acc + power, 0))
    };
  }
}
