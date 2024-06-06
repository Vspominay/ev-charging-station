import { Pipe, PipeTransform } from '@angular/core';
import { ERole } from '@features/auth/data-access/models/roles.enum';
import { toArray } from '@shared/utils/to-array.util';

@Pipe({
  name: 'role',
  standalone: true
})
export class RolePipe implements PipeTransform {
  public transform(roles: Array<ERole> | ERole): string {
    const role = toArray(roles)[0];
    if (!role) return 'auth.role.unspecified';

    return `auth.role.${role}`;
  }
}
