import { Routes } from '@angular/router';
import { authGuard } from './core/interceptors/guards/auth.guard';
import { adminGuard } from './core/interceptors/guards/admin.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'login', loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./auth/register.component').then(m => m.RegisterComponent) },
  
  // User routes
  { path: 'dashboard', canActivate: [authGuard], loadComponent: () => import('./user/dashboard.component').then(m => m.UserDashboardComponent) },
  { path: 'accounts', canActivate: [authGuard], loadComponent: () => import('./accounts/list.component').then(m => m.AccountsListComponent) },
  { path: 'accounts/open', canActivate: [authGuard], loadComponent: () => import('./accounts/open.component').then(m => m.OpenAccountComponent) },
  { path: 'transact', canActivate: [authGuard], loadComponent: () => import('./transactions/operate.component').then(m => m.OperateTransactionsComponent) },
  
  // Transaction history routes - both with and without account ID
  { path: 'transactions/history', canActivate: [authGuard], loadComponent: () => import('./transactions/history.component').then(m => m.TransactionsHistoryComponent) },
  { path: 'transactions/:accountId', canActivate: [authGuard], loadComponent: () => import('./transactions/history.component').then(m => m.TransactionsHistoryComponent) },
  
  // Admin routes
  { path: 'admin', canActivate: [authGuard, adminGuard], loadComponent: () => import('./admin/dashboard.component').then(m => m.AdminDashboardComponent) },
  { path: 'admin/accounts', canActivate: [authGuard, adminGuard], loadComponent: () => import('./admin/accounts.component').then(m => m.AdminAccountsComponent) },
  { path: 'admin/transactions', canActivate: [authGuard, adminGuard], loadComponent: () => import('./admin/transactions.component').then(m => m.AdminTransactionsComponent) },
  
  // Fallback
  { path: '**', redirectTo: 'dashboard' }
];


