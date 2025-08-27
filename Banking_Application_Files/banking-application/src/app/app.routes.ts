import { Routes } from '@angular/router';
import { authGuard } from './core/interceptors/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'accounts' },
  { path: 'login', loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./auth/register.component').then(m => m.RegisterComponent) },
  { path: 'accounts', canActivate: [authGuard], loadComponent: () => import('./accounts/list.component').then(m => m.AccountsListComponent) },
  { path: 'accounts/open', canActivate: [authGuard], loadComponent: () => import('./accounts/open.component').then(m => m.OpenAccountComponent) },
  { path: 'transact', canActivate: [authGuard], loadComponent: () => import('./transactions/operate.component').then(m => m.OperateTransactionsComponent) },
  { path: 'transactions/:accountId', canActivate: [authGuard], loadComponent: () => import('./transactions/history.component').then(m => m.TransactionsHistoryComponent) },
  { path: '**', redirectTo: 'accounts' }
];


