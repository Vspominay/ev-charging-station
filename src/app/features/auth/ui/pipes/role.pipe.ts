import { Pipe, PipeTransform } from '@angular/core';
import { ERole } from '@features/auth/data-access/models/roles.enum';
import { toArray } from '@shared/utils/to-array.util';

@Pipe({
  name: 'role',
  standalone: true
})
export class RolePipe implements PipeTransform {
  // roles sorted by priority
  private readonly roles: Array<ERole> = [
    ERole.SuperAdministrator,
    ERole.Administrator,
    ERole.Employee,
    ERole.Driver
  ];

  public transform(roles: Array<ERole> | ERole): string {
    const highPriorityRole = this.sortRoles(toArray(roles))[0];
    if (!highPriorityRole) return 'auth.role.unspecified';

    return `auth.role.${highPriorityRole}`;
  }

  private sortRoles(roles: Array<ERole>): Array<ERole> {
    return roles.sort((a, b) => this.roles.indexOf(a) - this.roles.indexOf(b));
  }
}
