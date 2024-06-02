import { Pipe, PipeTransform } from '@angular/core';
import { TUser } from '@features/users/data-access/models/user.type';

@Pipe({
  name: 'userLabel',
  standalone: true
})
export class UserLabelPipe implements PipeTransform {
  transform(user: TUser): string {
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    const isFullNameExist = fullName.length;

    return (isFullNameExist ? `${fullName} (${user.email})` : user.email).replace('()', '');
  }
}
