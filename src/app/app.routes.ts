import { Routes } from '@angular/router';
import { hasToken } from '@features/auth/data-access/guards/has-token-access.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'depots',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(r => r.ROUTES)
  },
  {
    path: '',
    canActivate: [hasToken],
    loadComponent: () => import('./features/features-root.component').then(m => m.FeaturesRootComponent),
    children: [
      {
        path: 'depots',
        loadChildren: () => import('./features/depot/depot.routes')
      }
    ]
  }
];
