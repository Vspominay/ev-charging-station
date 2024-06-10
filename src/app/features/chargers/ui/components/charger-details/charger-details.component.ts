import { DatePipe, NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, effect, inject, signal } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DESCRIPTION_MAX_LENGTH, FIELD_MAX_LENGTH } from '@core/validators/field-max-length.validators';
import { trimRequiredValidator } from '@core/validators/trim-required.validator';
import { ChargersFacade } from '@features/chargers/data-access/chargers.facade';
import { TConnectorView } from '@features/chargers/data-access/models/connector.model';
import { ConnectorCardComponent } from '@features/chargers/ui/components/connector-card/connector-card.component';
import { ChargerDetailsPipe } from '@features/chargers/ui/pipes/charger-details.pipe';
import { ChargingProfileFacade } from '@features/charging-profiles/data-access/charging-profile.facade';
import { TChargingProfile } from '@features/charging-profiles/data-access/models/charging-profile.model';
import {
  ChargingProfileAction
} from '@features/charging-profiles/data-access/services/charging-profile-actions.service';
import {
  ChargingProfileBarAction
} from '@features/charging-profiles/data-access/services/charging-profile-bar-actions.service';
import { DepotDashboardFacade } from '@features/depot/data-access/depot-dashboard.facade';
import {
  NgbCollapse, NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle, NgbTooltip
} from '@ng-bootstrap/ng-bootstrap';
import {
  EditableComponent, EditableGroupDirective, EditableGroupEditDirective, EditModeDirective, ViewModeDirective
} from '@ngneat/edit-in-place';
import { TranslateModule } from '@ngx-translate/core';
import { EmptyResultsComponent } from '@shared/components/empty-results/empty-results.component';
import { FormElementModule } from '@shared/components/form-control/form-control.module';
import { IconDirective } from '@shared/directives/icon.directive';
import { EmptyValuePipe } from '@shared/pipes/empty-value.pipe';
import { getFormControlsNames } from '@shared/utils/get-form-controls-names.util';
import { ListControlBarComponent } from '@shared/widgets/list-control-bar/list-control-bar.component';
import { DndDropEvent, DndModule } from 'ngx-drag-drop';

@Component({
  selector: 'ev-charger-details',
  standalone: true,
  imports: [
    FormsModule,
    NgbDropdown,
    NgbDropdownMenu,
    NgbDropdownToggle,
    NgbTooltip,
    IconDirective,
    NgOptimizedImage,
    DatePipe,
    EmptyValuePipe,
    ChargerDetailsPipe,
    TranslateModule,
    ConnectorCardComponent,
    NgbDropdownItem,
    ListControlBarComponent,
    DndModule,
    NgTemplateOutlet,
    FormElementModule,
    ReactiveFormsModule,
    EditableGroupDirective,
    EditableGroupEditDirective,
    EditableComponent,
    EditModeDirective,
    ViewModeDirective,
    NgbCollapse,
    EmptyResultsComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [DatePipe],
  templateUrl: './charger-details.component.html',
})
export default class ChargerDetailsComponent {
  private readonly chargerFacade = inject(ChargersFacade);
  private readonly depotFacade = inject(DepotDashboardFacade);
  private readonly profileFacade = inject(ChargingProfileFacade);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly $charger = this.chargerFacade.$charger;
  readonly $depot = computed(() => this.depotFacade.$viewModel().depot);
  readonly $connectorPlaceholder = signal({} as TConnectorView);

  readonly $profiles = computed(() => {
    const profiles = this.profileFacade.$vm().profiles;
    const connectors = this.chargerFacade.$charger()?.connectors ?? [];

    const profileMap = profiles.reduce((acc, profile) => {
      acc[profile.id] = {
        ...profile,
        connectors: []
      };
      return acc;
    }, {} as Record<string, TChargingProfile & { connectors: Array<TConnectorView> }>);


    connectors.forEach((connector) => {
      const profileIds = connector.chargingProfilesIds ?? [];
      profileIds.forEach((profileId) => {
        const profile = profileMap[profileId];

        if (profile) profile.connectors.push(connector);
      });
    });

    return Object.values(profileMap);
  });
  readonly $profileActions = this.profileFacade.$actions;
  readonly $isLoading = computed(() => this.profileFacade.$vm().isLoading);

  isDetailsCollapsed = false;

  constructor() {
    this.listenChargerDetailsChanges();
  }

  private listenChargerDetailsChanges() {
    effect(() => {
      const charger = this.$charger();
      if (!charger) return;

      this.form.patchValue(charger);
    });
  }

  search(query: string) {
    this.profileFacade.searchDepots(query);
  }

  handleProfileAction(action: ChargingProfileAction, profile: TChargingProfile): void;
  handleProfileAction(action: ChargingProfileBarAction): void;
  handleProfileAction(action: ChargingProfileBarAction | ChargingProfileAction, profile?: TChargingProfile) {
    if (this.assertProfileAction(action, profile)) {
      this.profileFacade.handleProfileAction(action, <TChargingProfile>profile);
    } else {
      this.profileFacade.handleBarAction(action);
    }
  }

  private assertProfileAction(action: ChargingProfileBarAction | ChargingProfileAction, profile?: TChargingProfile): action is ChargingProfileAction {
    return !!profile;
  }

  updateCurrentConnector(connector: TConnectorView) {
    this.$connectorPlaceholder.set(connector);
  }

  dropConnector(event: DndDropEvent, profileId: TChargingProfile['id']) {
    console.log('Event: ', event, profileId);
    const connector = <TConnectorView & { profileId?: TChargingProfile['id'] }>event.data;

    const isProfileExit = connector.chargingProfilesIds?.find((id) => id === profileId);
    if (isProfileExit) return;

    const originProfile = connector.profileId;
    if (originProfile) {
      this.profileFacade.removeProfileFromConnector(connector, originProfile);
    }

    this.profileFacade.applyProfileForConnector(connector, profileId);
  }


  removeProfile(event: DndDropEvent) {
    const connector = <TConnectorView & { profileId?: TChargingProfile['id'] }>event.data;

    const originProfileId = connector.profileId;
    if (!originProfileId) return;

    this.profileFacade.removeProfileFromConnector(connector, originProfileId);
  }

  getConnectorWithProfile(connector: TConnectorView, profileId: TChargingProfile['id']) {
    return {
      ...connector,
      profileId
    };
  }

  // edit charger
  readonly form = this.fb.group({
    name: this.fb.control('', [trimRequiredValidator, FIELD_MAX_LENGTH]),
    description: this.fb.control('', [DESCRIPTION_MAX_LENGTH])
  });
  readonly formControlNames = getFormControlsNames(this.form);

  saveChanges() {
    console.log(this.form);
    const charger = this.$charger();
    if (this.form.invalid || !charger) return;

    this.chargerFacade.upsertCharger({
        ...this.form.value,
        id: charger.id
      },
      charger
    );
  }
}
