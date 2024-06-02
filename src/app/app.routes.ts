import { Routes } from '@angular/router';
import { APP_NAME } from '@core/constants/app-name.constant';
import { hasToken } from '@features/auth/data-access/guards/has-token-access.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'depots',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    title: `Welcome to ${APP_NAME}`,
    loadChildren: () => import('./features/auth/auth.routes').then(r => r.ROUTES)
  },
  {
    path: '',
    canActivate: [hasToken],
    title: APP_NAME,
    loadComponent: () => import('./features/features-root.component').then(m => m.FeaturesRootComponent),
    children: [
      {
        path: 'depots',
        loadChildren: () => import('./features/depot/depot.routes')
      }
    ]
  }
];
