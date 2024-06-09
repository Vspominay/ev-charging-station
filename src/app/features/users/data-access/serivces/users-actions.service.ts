import { computed, inject, Injectable } from '@angular/core';
import { AActionService } from '@core/abstractions/base-acitons.abstraction';
import { AuthClient } from '@features/auth/data-access/auth.client';
import { TRegisterRequest } from '@features/auth/data-access/models/register.model';
import { DepotDashboardFacade } from '@features/depot/data-access/depot-dashboard.facade';
import { TUser } from '@features/users/data-access/models/user.type';
import { UsersClient } from '@features/users/data-access/users.client';
import { UserStore } from '@features/users/data-access/users.store';
import { InviteUserPopupComponent } from '@features/users/ui/components/invite-user-popup/invite-user-popup.component';
import { UserLabelPipe } from '@features/users/ui/pipes/user-label.pipe';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TActionsMap, TActionWithIcon } from '@shared/utils/types/actions.types';
import dayjs from 'dayjs';
import { switchMap, take } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import Swal from 'sweetalert2';

export enum UserAction {
  Invite = 'Invite',
  Edit = 'Edit',
  Delete = 'Delete'
}

@Injectable({
  providedIn: 'root'
})
export class UsersActionsService extends AActionService<UserAction, TUser | null> {
  private readonly modalService = inject(NgbModal);
  private readonly client = inject(UsersClient);
  private readonly authClient = inject(AuthClient);
  private readonly store = inject(UserStore);

  private readonly $depotVm = inject(DepotDashboardFacade).$viewModel;
  private readonly $depotId = computed(() => this.$depotVm().depot?.id);

  private readonly userPipe = new UserLabelPipe();

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
    },
    [UserAction.Delete]: {
      label: 'base.buttons.delete',
      handler: (user) => user && this.store.delete(user.id),
      data: {
        icon: 'delete',
        style: 'danger',
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
               switchMap((data: TRegisterRequest & { id: string }) => {
                 return data.id ?
                   this.client.inviteUser({
                     email: data.email,
                     role: data.role,
                     depotId: <string>this.$depotId(),
                     expiration: dayjs().add(6, 'months').toISOString()
                   }).pipe(map(() => data))
                   : this.authClient.signUp(data).pipe(map(() => data));
               })
             )
             .subscribe((data) => {
               Swal.fire({
                 title: 'Success',
                 text: `User ${this.userPipe.transform(data)} invitation has been sent successfully!`,
                 icon: 'success',
                 confirmButtonColor: '#34c38f'
               });
             });
  }

  private getLabels(isUserExist: boolean): Record<'label' | 'save', string> {
    return {
      label: isUserExist ? 'users.update.long-title' : 'users.invite.long-title',
      save: isUserExist ? 'users.update.title' : 'users.invite.title'
    };
  }
}
