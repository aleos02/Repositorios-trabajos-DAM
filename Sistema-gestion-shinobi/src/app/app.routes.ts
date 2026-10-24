import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'misiones',
    loadComponent: () => import('./misiones/misiones.component').then((m) => m.MisionesComponent),
  },
  {
    path: 'detalles/:id',
    loadComponent: () => import('./detalles/detalles.component').then((m) => m.DetallesComponent),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
