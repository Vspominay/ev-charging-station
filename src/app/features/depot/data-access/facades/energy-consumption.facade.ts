import { computed, inject, Injectable, numberAttribute, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '@core/services/notification.service';
import { CHARGERS_CLIENT_GATEWAY } from '@features/chargers/data-access/chargers.store';
import { TCharger } from '@features/chargers/data-access/models/charger.model';
import { DepotDashboardFacade } from '@features/depot/data-access/depot-dashboard.facade';
import {
  TChargerLimit, TDepotConfiguration, TDepotViewConfiguration
} from '@features/depot/data-access/models/depot-configuration.model';
import { TDepot } from '@features/depot/data-access/models/depot.model';
import { EnergyConsumptionsClient } from '@features/depot/data-access/services/energy-consumptions.client';
import { depotId } from '@features/depot/data-access/utils/get-depot-id.util';
import { TDepotConfigForm } from '@features/depot/ui/components/depot-configuration/depot-configuration.component';
import dayjs from 'dayjs';
import { catchError, forkJoin, of, take } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EnergyConsumptionFacade {
  private readonly chargersClient = inject(CHARGERS_CLIENT_GATEWAY);
  private readonly configClient = inject(EnergyConsumptionsClient);
  private readonly router = inject(Router);
  private readonly dashboardFacade = inject(DepotDashboardFacade);

  private $chargersSource = signal<Array<TCharger>>([]);
  private $configSource = signal<TDepotViewConfiguration>(
    this.getDefaultConfig(
      <string>depotId()
    )
  );

  readonly $config = computed<TDepotViewConfiguration>(() => {
    const chargers = this.$chargersSource();
    const config = this.$configSource();

    const normalizedConfig = this.combineChargersAndConfig(chargers, config);

    return normalizedConfig;
  });

  readonly $chargerIdNameMap = computed(() => {
    const chargers = this.$chargersSource();

    return chargers.reduce((acc, charger) => {
      acc[charger.id] = charger.name ?? charger.id;

      return acc;
    }, {} as Record<TCharger['id'], TCharger['name']>);
  });

  loadConfig(depotId: TDepot['id']) {
    forkJoin([
      this.configClient.getDepotConfiguration(depotId).pipe(catchError(() => of(this.getDefaultConfig(depotId)))),
      this.chargersClient.getList({ depotId }).pipe(catchError(() => of({ collection: [] })))
    ])
      .pipe(
        take(1),
        map(([config, chargers]) => ({
          config: config?.id ? config : this.getDefaultConfig(depotId),
          chargers: chargers.collection ?? []
        })),
        map(({ config, chargers }) => ({
          config: {
            ...config,
            intervals: config.intervals.map(({ startTime, endTime, energyLimit }) => ({
              startTime: dayjs(startTime),
              endTime: dayjs(endTime),
              energyLimit
            })),
          },
          chargers
        }))
      )
      .subscribe(({ config, chargers }) => {
        this.$configSource.set(config);
        this.$chargersSource.set(chargers);
      });
  }

  reset() {}

  private readonly notificationService = inject(NotificationService);

  save(config: TDepotConfigForm) {
    const adaptedConfig = this.adaptConfigToClient(config);

    this.configClient.setDepotConfiguration(adaptedConfig)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.notificationService.showSuccess()
                .then(() => {
                  const depotId = this.$config().depotId;

                  this.dashboardFacade.selectDepot(depotId);
                  this.router.navigate(['/depots', depotId]);
                });
          }
        });
  }

  private adaptConfigToClient(config: TDepotConfigForm): TDepotConfiguration {
    const { depotId } = this.$config();

    return {
      depotId,
      ...config.general,
      depotEnergyLimit: numberAttribute(config.general.depotEnergyLimit, 0) * 1000,
      intervals: config.intervals.map(({ startTime, endTime, energyLimit }) => ({
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        energyLimit
      })),
      chargePointsLimits: Object.entries(config.chargers).map(([chargePointId, chargePointEnergyLimit]) => ({
        chargePointId,
        chargePointEnergyLimit
      })),
    } as TDepotConfiguration;
  }

  private combineChargersAndConfig(chargers: Array<TCharger>, {
    chargePointsLimits,
    ...config
  }: TDepotViewConfiguration): TDepotViewConfiguration {
    const chargeLimitsSet = new Map(chargePointsLimits.map(({
      chargePointId,
      chargePointEnergyLimit
    }) => [chargePointId, chargePointEnergyLimit]));
    const chargeLimits: Array<TChargerLimit> = chargers.map(({ id }) => {
      const isRestricted = chargeLimitsSet.has(id);

      return { chargePointId: id, chargePointEnergyLimit: isRestricted ? chargeLimitsSet.get(id) ?? 0 : 0 };
    });

    return { ...config, chargePointsLimits: chargeLimits };
  }

  private getDefaultConfig(depotId: TDepot['id'], defaultDepotEnergyLimit = 1000): TDepotViewConfiguration {
    return {
      id: '',
      intervals: [],
      chargePointsLimits: [],
      validFrom: dayjs().startOf('week').toISOString(),
      validTo: dayjs().endOf('week').toISOString(),
      createdAt: '',
      depotId,
      depotEnergyLimit: defaultDepotEnergyLimit
    };
  }
}
