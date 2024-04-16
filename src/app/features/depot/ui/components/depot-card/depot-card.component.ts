import { NgClass, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DepotAction } from '@features/depot/data-access/depot-action.service';
import { NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ActionPlacementPipe } from '@shared/components/card/action-placement.pipe';
import { ActionsCardDirective, withActionsCard } from '@shared/components/card/actions-card.directive';
import { IconDirective } from '@shared/directives/icon.directive';
import { AddressPipe } from '@shared/pipes/address.pipe';
import { TViewActionItem } from '@shared/utils/types/actions.types';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TDepot, TDepotChargerStats, TDepotListItem } from '../../../data-access/models/depot.model';
import { DepotRibbonPipe } from '../../pipes/depot-ribbon.pipe';
import { DepotStatsPipe } from '../../pipes/depot-stats.pipe';

@Component({
  selector: 'ev-depot-card',
  standalone: true,
  imports: [NgForOf, NgIf, RouterLink, NgApexchartsModule, NgForOf, NgIf, RouterLink, DepotRibbonPipe, TranslateModule, NgOptimizedImage, AddressPipe, DepotStatsPipe, NgClass, IconDirective, NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, NgbDropdownItem, ActionPlacementPipe],
  template: `
    <div class="card card-height-100 ribbon-box right overflow-hidden">
      <div class="card-body text-center p-4">
        @if (depot | depotRibbon; as ribbonConfig) {
          <div class="ribbon fs-14 ribbon-{{ribbonConfig.style}} ribbon-shape trending-ribbon">
            <i [icon]="'bolt'"></i>
            <span class="trending-ribbon-text">{{ ribbonConfig.label | translate }}</span>
          </div>
        }

        @if (depot.image) {
          <img [ngSrc]="depot.image" [alt]="depot.name + ' logo'" width="45" height="45">
        }

        <h5 class="mb-1 mt-4">
          <a [routerLink]="['depots', depot.id]" class="text-body text-truncate-two-lines">{{ depot.name }}</a>
        </h5>

        <p class="text-muted mb-4">{{ depot | address }}</p>

        <div class="row justify-content-center">
          <div class="col-lg-8">
            <!--            <apx-chart [series]="data.chart.series" [chart]="data.chart.chart"-->
            <!--                       [dataLabels]="data.chart.dataLabels" [stroke]="data.chart.stroke" [fill]="data.chart.fill"-->
            <!--                       [colors]="data.chart.colors" dir="ltr"></apx-chart>-->
          </div>
        </div>

        <div class="row mt-4">
          @for (stats of chargerStats | depotStats; track stats.value) {
            <div [ngClass]="{ 'border-end-dashed border-end': !$last }" class="col-sm-4">
              <h5 [ngClass]="'text-' + stats.style">{{ stats.value }}</h5>
              <span class="text-muted">{{ stats.label | translate }}</span>
            </div>
          }
        </div>

        <div class="mt-4 d-flex gap-3">
          <a [routerLink]="['/', 'depots', depot.id]" class="btn btn-light w-100">View Details</a>

          <div ngbDropdown>
            <button ngbDropdownToggle type="button" class="btn btn-light btn-icon waves-effect waves-light p-3">
              <i icon="settings" class="fs-20"></i>
            </button>

            <div ngbDropdownMenu>
              @for (action of hostActions.actions | actionPlacement: 'item'; track action.value) {
                <button ngbDropdownItem>{{ action.label | translate }}</button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  hostDirectives: [withActionsCard],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class DepotCardComponent {
  readonly hostActions: ActionsCardDirective<TViewActionItem<DepotAction, TDepotListItem>> = inject(ActionsCardDirective<TViewActionItem<DepotAction, TDepotListItem>>);

  @Input({ required: true }) depot!: TDepot;
  @Input({ required: true }) chargerStats!: TDepotChargerStats;
}
