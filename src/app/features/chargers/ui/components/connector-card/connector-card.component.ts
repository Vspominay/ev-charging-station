import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TConnector } from '@features/chargers/data-access/models/connector.model';
import {
  NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, NgbProgressbar, NgbTooltip
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ev-connector-card',
  standalone: true,
  imports: [CommonModule, NgForOf, NgIf, NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, NgbProgressbar, NgbTooltip],
  template: `
    <div class="card tasks-box">
      <div class="card-body">
        <div class="d-flex mb-2">
          <a href="javascript:void(0)" class="text-muted fw-medium fs-14 flex-grow-1">{{ connector.id }}</a>
          <div class="dropdown" ngbDropdown>
            <a href="javascript:void(0);" class="text-muted arrow-none" id="dropdownMenuLink1"
               data-bs-toggle="dropdown" aria-expanded="false" ngbDropdownToggle><i
              class="ri-more-fill"></i></a>

            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuLink1" ngbDropdownMenu>
              <li><a class="dropdown-item" href="tasks/details"><i
                class="ri-eye-fill align-bottom me-2 text-muted float-start"></i> Restart</a></li>
              <li><a class="dropdown-item" href="javascript:void(0);"><i
                class="ri-edit-2-line align-bottom me-2 text-muted float-start"></i> Stop</a></li>
            </ul>
          </div>
        </div>

        <h6 class="fs-15 text-truncate"><a href="tasks/details">{{ connector.vehicleNum }}</a></h6>

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
              40 min.
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
          </div>
        </div>
      </div>
      <!--end card-body-->
      <ngb-progressbar [value]="connector.soc" [type]="'primary'" class="progress-sm"></ngb-progressbar>
    </div>
  `,
  styles: ``
})
export class ConnectorCardComponent {
  @Input({ required: true }) connector!: TConnector;
}
