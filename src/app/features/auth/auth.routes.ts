import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, Routes } from '@angular/router';
import { AuthFacade } from '@features/auth/data-access/auth.facade';
import { UsersClient } from '@features/users/data-access/users.client';

export const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    loadComponent: () => import('@features/auth/ui/components/log-in/log-in.component')
  },
  {
    path: 'signup',
    loadComponent: () => import('@features/auth/ui/components/sign-up/sign-up.component')
  },
  {
    path: 'password-confirmation',
    resolve: {
      user: (route: ActivatedRouteSnapshot) => {
        const authFacade = inject(AuthFacade);
        const router = inject(Router);
        const token = route.queryParams['token'];

        return token ? authFacade.adaptJwtToUser(token) : router.createUrlTree(['auth/login']);
      }
    },
    loadComponent: () => import('@features/auth/ui/components/confirm-password/confirm-password.component')
  },
  {
    path: 'confirm-invite',
    resolve: {
      successInvite: (route: ActivatedRouteSnapshot) => {
        const userClient = inject(UsersClient);
        const token = route.queryParams['token'];

        return userClient.confirmInvite(token);
      }
    },
    loadComponent: () => import('@features/auth/ui/components/confirm-invite/confirm-invite.component')
  }
];
