import { DatePipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OcppTagFacade } from '@features/ocpp-tags/data-access/ocpp-tag.facade';
import { NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbsComponent } from '@shared/components/breadcrumbs/breadcrumbs.component';
import { ActionPlacementPipe } from '@shared/components/card/action-placement.pipe';
import { EmptyResultsComponent } from '@shared/components/empty-results/empty-results.component';
import { FormElementDirective } from '@shared/components/form-control/directives/form-element.directive';
import { FormControlComponent } from '@shared/components/form-control/form-control.component';
import { BadgeDirective } from '@shared/directives/badge.directive';
import { IconDirective } from '@shared/directives/icon.directive';
import { EmptyValuePipe } from '@shared/pipes/empty-value.pipe';
import { ListControlBarComponent } from '@shared/widgets/list-control-bar/list-control-bar.component';

@Component({
  selector: 'ev-ocpp-tag-list',
  standalone: true,
  imports: [
    BreadcrumbsComponent,
    DatePipe,
    FormControlComponent,
    FormElementDirective,
    FormsModule,
    ReactiveFormsModule,
    JsonPipe,
    EmptyValuePipe,
    NgbDropdown,
    NgbDropdownMenu,
    NgbDropdownToggle,
    BadgeDirective,
    TranslateModule,
    IconDirective,
    EmptyResultsComponent,
    ListControlBarComponent,
    ActionPlacementPipe,
    NgbDropdownItem
  ],
  templateUrl: 'ocpp-tag-list.component.html',
})
export default class OcppTagListComponent {
  readonly facade = inject(OcppTagFacade);

  readonly $actions  =this.facade.$actions;
}
