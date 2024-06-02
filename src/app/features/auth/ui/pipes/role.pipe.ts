import { Pipe, PipeTransform } from '@angular/core';
import { ERole } from '@features/auth/data-access/models/roles.enum';

@Pipe({
  name: 'role',
  standalone: true
})
export class RolePipe implements PipeTransform {
  public transform(role: ERole): string {
    if (!role) return 'auth.role.unspecified';

    return `auth.role.${role}`;
  }
}
