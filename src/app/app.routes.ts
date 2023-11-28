import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/jobs/jobs.routes').then(({ROUTES}) => ROUTES)
  }
];
