import { Pipe, PipeTransform } from '@angular/core';
import { TLabelStyledConfig } from '@core/types/color-style.type';
import { UserStatusMap } from '@features/users/constants/user.constants';
import { EUserStatus } from '@features/users/data-access/models/user.type';

@Pipe({
  name: 'userStatus',
  standalone: true
})
export class UserStatusPipe implements PipeTransform {
  private readonly userStatusStyle: Record<EUserStatus, TLabelStyledConfig> = {
    [EUserStatus.active]: {
      label: UserStatusMap[EUserStatus.active],
      style: 'success'
    },
    [EUserStatus.inactive]: {
      label: UserStatusMap[EUserStatus.inactive],
      style: 'danger'
    }
  };

  transform(status: EUserStatus): TLabelStyledConfig {
    return this.userStatusStyle[status] ?? {
      label: 'depot.statuses.unknown',
      style: 'dark'
    };
  }
}
