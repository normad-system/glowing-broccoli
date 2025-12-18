import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent),
  },
  {
    path: 'blog',
    loadComponent: () => import('./pages/blog/blog-list.component').then(m => m.BlogListComponent),
  },
  {
    path: 'blog/:slug',
    loadComponent: () => import('./pages/blog/blog-detail.component').then(m => m.BlogDetailComponent),
  },
  {
    path: 'category/:slug',
    loadComponent: () => import('./pages/category/category.component').then(m => m.CategoryComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register.component').then(m => m.RegisterComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
