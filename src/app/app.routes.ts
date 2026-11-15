import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'projects/:slug',
    loadComponent: () =>
      import('./features/project-detail/project-detail.page').then((m) => m.ProjectDetailPage),
  },
  // Old URL scheme (/project-details/<category>) → home. Vercel also redirects it (vercel.json).
  { path: 'project-details/:id', redirectTo: '/', pathMatch: 'full' },
  {
    path: '404',
    loadComponent: () => import('./features/not-found/not-found.page').then((m) => m.NotFoundPage),
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.page').then((m) => m.NotFoundPage),
  },
];
