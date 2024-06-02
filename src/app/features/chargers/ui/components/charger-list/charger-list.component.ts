import { JsonPipe, KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, CUSTOM_ELEMENTS_SCHEMA, inject, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChargersFacade } from '@features/chargers/data-access/chargers.facade';
import { TChargerWithConnectors } from '@features/chargers/data-access/models/charger.model';
import { ConnectorCardComponent } from '@features/chargers/ui/components/connector-card/connector-card.component';
import { DepotDashboardFacade } from '@features/depot/data-access/depot-dashboard.facade';
import { NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { EmptyResultsComponent } from '@shared/components/empty-results/empty-results.component';
import { IconDirective } from '@shared/directives/icon.directive';
import { ListControlBarComponent } from '@shared/widgets/list-control-bar/list-control-bar.component';

@Component({
  selector: 'ev-charger-list',
  standalone: true,
  imports: [
    ConnectorCardComponent,
    KeyValuePipe,
    JsonPipe,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    IconDirective,
    RouterLink,
    NgbDropdownItem,
    TranslateModule,
    ListControlBarComponent,
    EmptyResultsComponent
  ],
  templateUrl: './charger-list.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ChargerListComponent {
  private readonly depotFacade = inject(DepotDashboardFacade);
  readonly chargersFacade = inject(ChargersFacade);

  readonly $loaders = computed(() => this.depotFacade.$viewModel().loaders);
  readonly $actions = computed(() => this.chargersFacade.$actions().bar);
  readonly $chargers: Signal<TChargerWithConnectors[]> = computed(() => this.depotFacade.$viewModel().chargers);
}
