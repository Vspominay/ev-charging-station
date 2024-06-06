import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TConnector, TConnectorView } from '@features/chargers/data-access/models/connector.model';
import { ConnectorAction } from '@features/chargers/data-access/services/connectors-actions.service';
import { ConnectorActionsPipe } from '@features/chargers/ui/pipes/connector-actions.pipe';
import { ConnectorStatusPipe } from '@features/chargers/ui/pipes/connector-status.pipe';
import {
  NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle, NgbProgressbar, NgbTooltip
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ActionsCardDirective, withActionsCard } from '@shared/components/card/actions-card.directive';
import { BadgeDirective } from '@shared/directives/badge.directive';
import { IconDirective } from '@shared/directives/icon.directive';
import { EmptyValuePipe } from '@shared/pipes/empty-value.pipe';
import { EnergyPipe } from '@shared/pipes/energy.pipe';
import { PowerPipe } from '@shared/pipes/power.pipe';
import { RemainingTimePipe } from '@shared/pipes/time-remaining.pipe';
import { TViewActionItem } from '@shared/utils/types/actions.types';

@Component({
  selector: 'ev-connector-card',
  standalone: true,
  imports: [CommonModule, NgForOf, NgIf, NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, NgbProgressbar, NgbTooltip, BadgeDirective, ConnectorStatusPipe, TranslateModule, PowerPipe, IconDirective, NgbDropdownItem, ConnectorActionsPipe, EnergyPipe, RemainingTimePipe, EmptyValuePipe],
  template: `
    @if (connector.currentStatus?.currentStatus | connectorStatus; as statusConfig) {
      <div class="card tasks-box">
        <div class="card-body">
          <div class="d-flex mb-2">
            <a href="javascript:void(0)"
               class="text-muted fw-medium fs-14 flex-grow-1 text-truncate-two-lines">{{ '#' + connector.connectorId }}</a>

            <div class="dropdown" ngbDropdown>
              <a href="javascript:void(0);" class="text-muted" id="dropdownMenuLink1"
                 data-bs-toggle="dropdown" aria-expanded="false" ngbDropdownToggle>
              </a>

              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuLink1" ngbDropdownMenu>
                @for (action of hostActions.actions | connectorActions: connector; track action.value) {
                  <li>
                    <button
                      (click)="hostActions.selectAction.emit(action)"
                      ngbDropdownItem> {{ action.label | translate }}
                    </button>
                  </li>
                }
              </ul>
            </div>
          </div>

          <div class="fs-15">
            <span class="text-muted me-1">{{ 'base.labels.power' | translate }}:</span>
            <span>{{ connector.power | power }}</span>
          </div>

          <div class="fs-15">
            <span class="text-muted me-1">{{ 'base.labels.energy' | translate }}:</span>
            <span>{{ connector.energy | energy }}</span>
          </div>

          <!--        <p class="text-muted">{{ connector.vehicleNum }}</p>-->

          <!--        <img src="{{task.image}}" class="tasks-img rounded" *ngIf="task.image"/>-->

          <div class="d-flex align-items-center">
            <!--          <div class="flex-grow-1">-->
            <!--            <div class="d-flex gap-1">-->
            <!--                        <span class="badge bg-primary-subtle text-primary" *ngFor=" let role of-->
            <!--                            task.roles">{{ role }}</span>-->
            <!--            </div>-->
            <!--          </div>-->

            <!--          <div class="flex-shrink-0">-->
            <!--            <div class="avatar-group">-->
            <!--              <a href="javascript: void(0);" class="avatar-group-item" ngbTooltip="{{user.name}}"-->
            <!--                 placement="top" *ngFor="let user of task.users">-->
            <!--                <img src="{{user.profile}}" alt="" class="rounded-circle avatar-xxs">-->
            <!--              </a>-->
            <!--            </div>-->
            <!--          </div>-->
          </div>
        </div>
        <div class="card-footer border-top-dashed">
          <div class="d-flex">
            <div class="flex-grow-1">
            <span class="text-muted"><i class="ri-time-line align-bottom"></i>
              {{ connector.approximateChargingEndTime | remainingTime | emptyValue }}
            </span>
            </div>
            <div class="flex-shrink-0">
              <!--            <ul class="link-inline mb-0 p-0">-->
              <!--              <li class="list-inline-item">-->
              <!--                <a href="javascript:void(0)" class="text-muted"><i class="ri-eye-line align-bottom"></i>-->
              <!--                  {{ task.view }}</a>-->
              <!--              </li>-->
              <!--              <li class="list-inline-item">-->
              <!--                <a href="javascript:void(0)" class="text-muted"><i-->
              <!--                  class="ri-question-answer-line align-bottom"></i>-->
              <!--                  {{ task.comment }}</a>-->
              <!--              </li>-->
              <!--              <li class="list-inline-item">-->
              <!--                <a href="javascript:void(0)" class="text-muted"><i class="ri-attachment-2 align-bottom"></i>-->
              <!--                  {{ task.pin }}</a>-->
              <!--              </li>-->
              <!--            </ul>-->

              <span [badge]="statusConfig.style">{{ statusConfig.label | translate }}</span>
            </div>
          </div>
        </div>
        <!--end card-body-->
        <ngb-progressbar [value]="connector.soC || 0"
                         [type]="statusConfig.style"
                         class="progress-sm"></ngb-progressbar>
      </div>
    }
  `,
  hostDirectives: [withActionsCard],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectorCardComponent implements OnChanges {
  readonly hostActions: ActionsCardDirective<TViewActionItem<ConnectorAction, TConnector>> = inject(ActionsCardDirective<TViewActionItem<ConnectorAction, TConnector>>);

  @Input({ required: true }) connector!: TConnectorView;

  public ngOnChanges(changes: SimpleChanges) {
    console.log('ConnectorCardComponent', changes);
  }
}
