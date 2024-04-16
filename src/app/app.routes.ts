import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/ui/account.module').then(m => m.AccountModule)
  },
  {
    path: '',
    loadComponent: () => import('./features/features-root.component').then(m => m.FeaturesRootComponent),
    children: [
      {
        path: 'depots',
        loadChildren: () => import('./features/depot/depot.routes')
      },
      {
        path: 'users',
        loadComponent: () => import('@features/users/ui/components/users.component')
      },
    ]
  }
];
