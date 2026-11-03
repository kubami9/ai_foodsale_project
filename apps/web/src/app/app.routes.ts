import type { Routes } from '@angular/router';
export const routes: Routes = [
  { path: '', loadComponent: () => import('./catalog/catalog-page').then((m) => m.CatalogPage) },
  {
    path: 'produkty/:id',
    loadComponent: () => import('./catalog/product-page').then((m) => m.ProductPage),
  },
  {
    path: '**',
    loadComponent: () => import('./shared/not-found-page').then((m) => m.NotFoundPage),
  },
];
