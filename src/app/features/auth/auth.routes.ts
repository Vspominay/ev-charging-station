import { Routes } from '@angular/router';

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
  }
];
