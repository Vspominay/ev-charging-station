import { computed, inject, Injectable, Signal } from '@angular/core';
import { ChargersStore } from '@features/chargers/data-access/chargers.store';
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

  applyProfileForConnector(connector: TConnectorView, chargingProfileId: TChargingProfile['id']) {
    if (!connector) {
      console.warn(`You tru to apply profile for an undefined connector`);
      return;
    }

    const connectorProfiles = connector.chargingProfilesIds ?? [];

    this.chargerStore.setConnectorProfiles(connector.id, [...connectorProfiles, chargingProfileId]);

    this.client.applyChargingProfile(connector.id, chargingProfileId).pipe(take(1))
        .subscribe({
          error: () => {
            this.chargerStore.setConnectorProfiles(connector.id, connectorProfiles);
          }
        });
  }

  removeProfileFromConnector(connector: TConnectorView, chargingProfileId: TChargingProfile['id']) {
    if (!connector) {
      console.warn(`You tru to apply profile for an undefined connector`);
      return;
    }

    const connectorProfiles = (connector.chargingProfilesIds ?? []).filter((id) => id !== chargingProfileId);

    this.chargerStore.setConnectorProfiles(connector.id, connectorProfiles);

    this.client.clearChargingProfileFromConnector(connector.id, chargingProfileId).pipe(take(1))
        .subscribe({
          error: () => {
            this.chargerStore.setConnectorProfiles(connector.id, connector.chargingProfilesIds ?? []);
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
}
