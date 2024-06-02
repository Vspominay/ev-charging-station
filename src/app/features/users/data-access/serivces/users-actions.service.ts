import { inject, Injectable } from '@angular/core';
import { AActionService } from '@core/abstractions/base-acitons.abstraction';
import { AuthClient } from '@features/auth/data-access/auth.client';
import { TUser, TUserUpsert } from '@features/users/data-access/models/user.type';
import { UsersClient } from '@features/users/data-access/users.client';
import { InviteUserPopupComponent } from '@features/users/ui/components/invite-user-popup/invite-user-popup.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TActionsMap, TActionWithIcon } from '@shared/utils/types/actions.types';
import { switchMap, take, throwError } from 'rxjs';
import { filter } from 'rxjs/operators';

export enum UserAction {
  Invite = 'Invite',
  Edit = 'Edit',
}

@Injectable({
  providedIn: 'root'
})
export class UsersActionsService extends AActionService<UserAction, TUser | null> {
  private readonly modalService = inject(NgbModal);
  private readonly client = inject(UsersClient);
  private readonly authClient = inject(AuthClient);

  protected actionsMap: TActionsMap<UserAction, TUser | null, TActionWithIcon> = {
    [UserAction.Invite]: {
      label: 'users.invite.title',
      handler: () => this.inviteUser(null),
      data: {
        icon: 'send',
        style: 'secondary',
        position: 'bar'
      }
    },
    [UserAction.Edit]: {
      label: 'base.buttons.edit',
      handler: (user) => this.inviteUser(user),
      data: {
        icon: 'edit',
        style: 'primary',
        position: 'item'
      }

    }
  };

  private inviteUser(user: TUser | null) {
    const dialogRef = this.modalService.open(InviteUserPopupComponent, {
      keyboard: true,
      size: 'lg'
    });

    const isUserExist = Boolean(user?.id);

    Object.assign(dialogRef.componentInstance, {
      user,
      labels: this.getLabels(isUserExist)
    });


    dialogRef.closed
             .pipe(
               take(1),
               filter(Boolean),
               switchMap((data: TUserUpsert) => {
                 return isUserExist ? throwError(() => 'Not implemented') : this.authClient.inviteUser(data as TUserUpsert);
               })
             )
             .subscribe((data) => {
               console.log(data);
             });
  }

  private getLabels(isUserExist: boolean): Record<'label' | 'save', string> {
    return {
      label: isUserExist ? 'users.update.long-title' : 'users.invite.long-title',
      save: isUserExist ? 'users.update.title' : 'users.invite.title'
    };
  }
}
