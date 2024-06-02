import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { DepotListFacade } from '@features/depot/data-access/depot-list.facade';

import { TranslateModule } from '@ngx-translate/core';

import { BreadcrumbsComponent } from '@shared/components/breadcrumbs/breadcrumbs.component';
import { EmptyResultsComponent } from '@shared/components/empty-results/empty-results.component';
import { IconDirective } from '@shared/directives/icon.directive';
import { ListControlBarComponent } from '@shared/widgets/list-control-bar/list-control-bar.component';
import DepotCardComponent from '../depot-card/depot-card.component';

@Component({
  selector: 'ev-depot-list',
  template: `
    <app-breadcrumbs [title]="'depot.list.title' | translate"></app-breadcrumbs>

    <ev-list-control-bar
      [actions]="facade.$actions()"
      (selectAction)="facade.handleAction($event)"
      (changeSearch)="facade.searchDepots($event)"
    />

    <div class="row">
      @for (depot of facade.$viewModel().depots; track depot.id) {
        <div class="col-lg-6 col-xxl-4">
          <ev-depot-card
            [depot]="depot"
            [actions]="facade.$actions()"
            [chargerStats]="depot.chargePointsStatistics"
            (selectAction)="facade.handleAction($event.value, depot)"
          />
        </div>
      } @empty {
        <ev-empty-results [isLoading]="facade.$viewModel().isLoading"/>
      }
    </div>
  `,
  standalone: true,
  imports: [
    IconDirective,
    BreadcrumbsComponent,
    TranslateModule,
    DepotCardComponent,
    ListControlBarComponent,
    EmptyResultsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class DepotListComponent {
  readonly facade = inject(DepotListFacade);
}
