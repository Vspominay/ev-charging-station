import { AsyncPipe, CommonModule, DatePipe, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RolePipe } from '@features/auth/ui/pipes/role.pipe';
import { UsersFacade } from '@features/users/data-access/users.facade';
import {
  NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, NgbHighlight, NgbPagination, NgbTooltip
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbsComponent } from '@shared/components/breadcrumbs/breadcrumbs.component';
import { ActionPlacementPipe } from '@shared/components/card/action-placement.pipe';
import { EmptyResultsComponent } from '@shared/components/empty-results/empty-results.component';
import { BadgeDirective } from '@shared/directives/badge.directive';
import { IconDirective } from '@shared/directives/icon.directive';
import { EmptyValuePipe } from '@shared/pipes/empty-value.pipe';
import { ListControlBarComponent } from '@shared/widgets/list-control-bar/list-control-bar.component';

@Component({
  selector: 'ev-users',
  standalone: true,
  imports: [CommonModule, AsyncPipe, DatePipe, FormsModule, NgForOf, NgIf, NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, NgbHighlight, NgbPagination, NgbTooltip, ReactiveFormsModule, BreadcrumbsComponent, IconDirective, ActionPlacementPipe, ListControlBarComponent, EmptyValuePipe, TranslateModule, RolePipe, NgOptimizedImage, BadgeDirective, EmptyResultsComponent],
  templateUrl: './users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class UsersComponent {
  readonly facade = inject(UsersFacade);

  $actions = this.facade.$actions;
  $vm = this.facade.$vm;
  protected readonly visualViewport = visualViewport;
}
