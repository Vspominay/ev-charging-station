import { KeyValuePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConnectorStatusPipe } from '@features/chargers/ui/pipes/connector-status.pipe';
import { DepotDashboardFacade } from '@features/depot/data-access/depot-dashboard.facade';
import {
  DepotEnergyUsageComponent
} from '@features/depot/ui/components/depot-energy-usage/depot-energy-usage.component';
import { DepotStatsPipe } from '@features/depot/ui/pipes/depot-stats.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbsComponent } from '@shared/components/breadcrumbs/breadcrumbs.component';
import { StatsCardComponent } from '@shared/components/stats-card/stats-card.component';

@Component({
  selector: 'ev-depot-dashboard',
  standalone: true,
  templateUrl: './depot-dashboard.component.html',
  imports: [
    StatsCardComponent,
    DepotStatsPipe,
    TranslateModule,
    DepotEnergyUsageComponent,
    BreadcrumbsComponent,
    RouterOutlet,
    KeyValuePipe,
    ConnectorStatusPipe,
    NgClass
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class DepotDashboardComponent {
  private readonly facade = inject(DepotDashboardFacade);
  readonly $vm = this.facade.$viewModel;
}
