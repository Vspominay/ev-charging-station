import { computed, inject, Injectable, Signal } from '@angular/core';
import { EventBus } from '@core/services/event-bus.service';
import {
  ChargingProfileClearedMessage, ChargingProfileSetMessage, ClearChargingProfileResponseStatus, ProfileEvent,
  SetChargingProfileResponseStatus
} from '@core/services/signalr.service';
import { ChargersStore } from '@features/chargers/data-access/chargers.store';
import { TCharger } from '@features/chargers/data-access/models/charger.model';
import { TConnectorView } from '@features/chargers/data-access/models/connector.model';
import { ChargingProfileClient } from '@features/charging-profiles/data-access/charging-profile.cilent';
import { ChargingProfileStore } from '@features/charging-profiles/data-access/charging-profile.store';
import { TChargingProfile } from '@features/charging-profiles/data-access/models/charging-profile.model';
import {
  ChargingProfileAction, ChargingProfileActionsService
} from '@features/charging-profiles/data-access/services/charging-profile-actions.service';
import {
  ChargingProfileBarAction, ChargingProfileBarActionsService
} from '@features/charging-profiles/data-access/services/charging-profile-bar-actions.service';
import { IToastOptions, ToastService } from '@shared/components/toastr/toast-service';
import { getSearchCriteria } from '@shared/utils/get-search-criteria.util';
import { take } from 'rxjs';

type TChargingProfileViewModel = {
  profiles: Array<TChargingProfile>,
  isLoading: boolean
};

@Injectable({
  providedIn: 'root'
})
export class ChargingProfileFacade {
  private readonly store = inject(ChargingProfileStore);
  private readonly client = inject(ChargingProfileClient);
  private readonly chargerStore = inject(ChargersStore);
  private readonly actionService = inject(ChargingProfileBarActionsService);
  private readonly profileActionService = inject(ChargingProfileActionsService);
  private readonly eventBus = inject(EventBus);
  private readonly toastService = inject(ToastService);

  readonly $actions = computed(() => {
    const actions = this.actionService.$actions();
    const profileActions = this.profileActionService.$actions();

    // TODO: add role-based actions filtering

    return {
      bar: actions,
      card: profileActions
    };
  });

  readonly $vm: Signal<TChargingProfileViewModel> = computed(() => {
    const profiles = this.store.entities();
    const isLoading = this.store.isLoading();

    return {
      profiles,
      isLoading
    };
  });

  private $chargersWithConnectors = this.chargerStore.chargersWithConnectors;

  private getConnectorInChargeStation(chargerId: TCharger['id'], connectorId: number) {
    return this.$chargersWithConnectors().find((charger) => charger.id === chargerId)?.connectors.find((connector) => connector.connectorId === connectorId);
  }

  constructor() {
    this.listenEvents();
  }

  applyProfileForConnector(connector: TConnectorView, chargingProfileId: TChargingProfile['id']) {
    if (!connector) {
      console.warn(`You try to apply profile for an undefined connector`);
      return;
    }

    this.chargerStore.addConnectorProfiles(connector.id, [chargingProfileId]);

    this.client.applyChargingProfile(connector.id, chargingProfileId).pipe(take(1))
        .subscribe({
          error: () => {
            this.chargerStore.removeConnectorProfiles(connector.id, [chargingProfileId]);
          }
        });
  }

  removeProfileFromConnector(connector: TConnectorView, chargingProfileId: TChargingProfile['id']) {
    if (!connector) {
      console.warn(`You tru to apply profile for an undefined connector`);
      return;
    }

    this.chargerStore.removeConnectorProfiles(connector.id, [chargingProfileId]);

    this.client.clearChargingProfileFromConnector(connector.id, chargingProfileId).pipe(take(1))
        .subscribe({
          error: () => {
            this.chargerStore.addConnectorProfiles(connector.id, [chargingProfileId]);
          }
        });
  }

  loadProfiles() {
    this.store.loadAll({});
  }

  searchDepots(query: string) {
    this.store.loadAll(getSearchCriteria<TChargingProfile>(query, ['name']));
  }

  handleBarAction(action: ChargingProfileBarAction, profile?: TChargingProfile) {
    this.actionService.handleAction(action, (profile || {}) as TChargingProfile);
  }

  handleProfileAction(action: ChargingProfileAction, profile: TChargingProfile) {
    this.profileActionService.handleAction(action, profile);
  }

  private listenEvents() {
    const setSub = this.listenSetEvent();
    const clearSub = this.listenClearEvent();

    return [setSub, clearSub];
  }

  private listenSetEvent() {
    return this.eventBus.on(ProfileEvent.ChargingProfileSet, (data: ChargingProfileSetMessage) => {
      const config = this.getToastConfigBySetStatus(data.status);
      const message = this.getToastSetMessageByStatus(data.status);

      const isSuccess = data.status === SetChargingProfileResponseStatus.Accepted;
      if (!isSuccess) {
        const connectorId = this.getConnectorInChargeStation(data.chargePointId, data.connectorId)?.id;

        if (connectorId) {
          this.chargerStore.addConnectorProfiles(connectorId, [data.chargingProfileId]);
        }
      }

      this.toastService.show(message, config);
    });
  }

  private listenClearEvent() {
    return this.eventBus.on(ProfileEvent.ChargingProfileCleared, (data: ChargingProfileClearedMessage) => {
      const config = this.getToastConfigByClearStatus(data.status);
      const message = this.getToastClearMessageByStatus(data.status);

      const isSuccess = data.status === ClearChargingProfileResponseStatus.Accepted;
      if (!isSuccess) {
        const connectorId = data.connectorId && this.getConnectorInChargeStation(data.chargePointId, data.connectorId)?.id;

        if (connectorId && data.chargingProfileId) {
          this.chargerStore.addConnectorProfiles(connectorId, [data.chargingProfileId]);
        }
      }

      this.toastService.show(message, config);
    });
  }

  private getToastConfigBySetStatus(status: SetChargingProfileResponseStatus): IToastOptions {
    const configByStatus: Record<SetChargingProfileResponseStatus, IToastOptions> = {
      [SetChargingProfileResponseStatus.Accepted]: {
        style: 'success',
        iconName: 'check_circle',
        title: 'profile.title'
      },
      [SetChargingProfileResponseStatus.Rejected]: {
        style: 'danger',
        iconName: 'block',
        title: 'profile.title'
      },
      [SetChargingProfileResponseStatus.NotSupported]: {
        style: 'danger',
        iconName: 'help',
        title: 'profile.title'
      }
    };

    return configByStatus[status];
  }

  private getToastSetMessageByStatus(status: SetChargingProfileResponseStatus): string {
    const messageByStatus: Record<SetChargingProfileResponseStatus, string> = {
      [SetChargingProfileResponseStatus.Accepted]: 'profile.events.set.accepted',
      [SetChargingProfileResponseStatus.Rejected]: 'profile.events.set.rejected',
      [SetChargingProfileResponseStatus.NotSupported]: 'profile.events.set.not-supported'
    };

    return messageByStatus[status];
  }

  private getToastConfigByClearStatus(status: ClearChargingProfileResponseStatus): IToastOptions {
    const configByStatus: Record<ClearChargingProfileResponseStatus, IToastOptions> = {
      [ClearChargingProfileResponseStatus.Accepted]: {
        style: 'success',
        iconName: 'check_circle',
        title: 'profile.title'
      },
      [ClearChargingProfileResponseStatus.Unknown]: {
        style: 'danger',
        iconName: 'help',
        title: 'profile.title'
      }
    };

    return configByStatus[status];
  }

  private getToastClearMessageByStatus(status: ClearChargingProfileResponseStatus): string {
    const messageByStatus: Record<ClearChargingProfileResponseStatus, string> = {
      [ClearChargingProfileResponseStatus.Accepted]: 'profile.events.clear.accepted',
      [ClearChargingProfileResponseStatus.Unknown]: 'profile.events.clear.rejected'
    };

    return messageByStatus[status];
  }
}
