import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/main-page/main-page').then((m) => m.MainPage),
  },
  {
    path: 'project-details/:id',
    loadComponent: () =>
      import('./components/projects/project-details/project-details').then((m) => m.ProjectDetails),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./components/page-not-found/page-not-found').then((m) => m.PageNotFound),
  },
];
