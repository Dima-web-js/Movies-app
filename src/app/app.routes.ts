import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/main-page/main-page.component').then((m) => m.MainPageComponent),
  },
  {
    path: 'movie/:id',
    loadComponent: () =>
      import('./components/movie-detail/movie-detail.component').then((m) => m.MovieDetailComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
