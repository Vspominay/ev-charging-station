import { AsyncPipe, CommonModule, DatePipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, NgbHighlight, NgbPagination, NgbTooltip
} from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumbsComponent } from '@shared/components/breadcrumbs/breadcrumbs.component';
import { IconDirective } from '@shared/directives/icon.directive';

@Component({
  selector: 'ev-users',
  standalone: true,
  imports: [CommonModule, AsyncPipe, DatePipe, FormsModule, NgForOf, NgIf, NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, NgbHighlight, NgbPagination, NgbTooltip, ReactiveFormsModule, BreadcrumbsComponent, IconDirective],
  templateUrl: './users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class UsersComponent {
  leads = [
    {
      'id': '1',
      'image_src': 'assets/images/users/avatar-4.jpg',
      'name': 'Alexis Clarke',
      'user_id': '34124',
      'user_type': 'Admin',
      'status': 'Active',
      'last_login': '07 Apr, 2021',
    },
    {
      'id': '2',
      'image_src': 'assets/images/users/avatar-3.jpg',
      'name': 'James Morris',
      'user_id': '34124',
      'user_type': 'Owner',
      'status': 'Active',
      'last_login': '15 Feb, 2021',
    },
    {
      'id': '3',
      'image_src': 'assets/images/users/avatar-2.jpg',
      'name': 'Nancy Martino',
      'user_id': '34124',
      'user_type': 'Employee',
      'status': 'Active',
      'last_login': '02 Jan, 2022',
    },
    {
      'id': '4',
      'image_src': 'assets/images/users/avatar-7.jpg',
      'name': 'Michael Morris',
      'user_id': '34124',
      'user_type': 'Employee',
      'status': 'Active',
      'last_login': '19 May, 2021',
    },
    {
      'id': '5',
      'image_src': 'assets/images/users/avatar-8.jpg',
      'name': 'Kevin Dawson',
      'user_id': '34124',
      'user_type': 'Employee',
      'status': 'Active',
      'last_login': '14 Apr, 2021',
    },
    {
      'id': '6',
      'image_src': 'assets/images/users/avatar-6.jpg',
      'name': 'Herbert Stokes',
      'user_id': '34124',
      'user_type': 'Employee',
      'status': 'Active',
      'last_login': '07 Jun, 2020',
    },
    {
      'id': '7',
      'image_src': 'assets/images/users/avatar-5.jpg',
      'name': 'Glen Matney',
      'user_id': '34124',
      'user_type': 'Employee',
      'status': 'Active',
      'last_login': '19 May, 2021',
    },
    {
      'id': '8',
      'image_src': 'assets/images/users/avatar-1.jpg',
      'name': 'Charles Kubik',
      'user_id': '34124',
      'user_type': 'Employee',
      'status': 'Disabled',
      'last_login': '25 Sep, 2021',
    },
    {
      'id': '9',
      'image_src': 'assets/images/users/avatar-9.jpg',
      'name': 'Thomas Taylor',
      'user_id': '34124',
      'user_type': 'Employee',
      'status': 'Active',
      'last_login': '28 Feb, 2019',
    },
    {
      'id': '10',
      'image_src': 'assets/images/users/avatar-10.jpg',
      'name': 'Tonya Noble',
      'user_id': '34124',
      'user_type': 'Employee',
      'status': 'Active',
      'last_login': '23 Nov, 2021',
    }
  ];
}
