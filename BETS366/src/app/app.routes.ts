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
    path: 'panel',
    loadComponent: () => import('./panel/panel.component').then((m) => m.PanelComponent),
  },
  {
    path: 'liga',
    loadComponent: () => import('./liga/liga.component').then((m) => m.LigaComponent),
  },
  {
    path: 'ranking',
    loadComponent: () => import('./ranking/ranking.component').then((m) => m.RankingComponent),
  },
  {
    path: 'perfil',
    loadComponent: () => import('./perfil/perfil.component').then((m) => m.PerfilComponent),
  },
  {
    path: 'historial',
    loadComponent: () => import('./historial/historial.component').then((m) => m.HistorialComponent),
  },
  {
    path: 'detalles/:id',
    loadComponent: () => import('./detalles/detalles.component').then((m) => m.DetallesComponent),
  },
  {
    path: 'equipo/:name',
    loadComponent: () => import('./equipo/equipo.component').then((m) => m.EquipoComponent),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
