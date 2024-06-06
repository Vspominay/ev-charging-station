import { NgIf } from '@angular/common';
import { computed, Directive, effect, inject, input } from '@angular/core';
import { AuthFacade } from '@features/auth/data-access/auth.facade';
import { ERole } from '@features/auth/data-access/models/roles.enum';
import { toArray } from '@shared/utils/to-array.util';

@Directive({
  selector: 'visibleForRole',
  standalone: true,
  hostDirectives: [NgIf]
})
export class VisibleForRoleDirective {
  private readonly ngIf = inject(NgIf);
  private readonly authFacade = inject(AuthFacade);

  private readonly $role = computed(() => this.authFacade.$vm().user.role);

  $neededRoles = input.required({ alias: 'visibleForRole', transform: (role: ERole | Array<ERole>) => toArray(role) });

  constructor() {
    this.listenRoleChanges();
  }

  private listenRoleChanges() {
    effect(() => {
      const currentRole = this.$role();
      const neededRoles = this.$neededRoles();

      this.ngIf.ngIf = neededRoles.includes(currentRole);
    });
  }
}
