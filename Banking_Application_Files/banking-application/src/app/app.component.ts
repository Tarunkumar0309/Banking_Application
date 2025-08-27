import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/interceptors/services/auth.services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
  <nav class="topbar">
    <a routerLink="/" class="brand">Banking App</a>
    <div class="links" *ngIf="isAuthed(); else guest">
      <a routerLink="/accounts">Accounts</a>
      <a routerLink="/transact">Transact</a>
      <button (click)="logout()">Logout</button>
    </div>
    <ng-template #guest>
      <a routerLink="/login">Login</a>
      <a routerLink="/register">Register</a>
    </ng-template>
  </nav>
  <router-outlet />
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: #f3f4f6; }
    .topbar { position: sticky; top:0; z-index: 10; display:flex; align-items:center; justify-content: space-between; padding: 12px 16px; background: #111827; color:#fff; }
    .brand { color:#fff; text-decoration: none; font-weight: 600; }
    .links { display: flex; gap: 12px; align-items: center; }
    .links a { color:#fff; text-decoration: none; }
    button { background: #ef4444; color:#fff; border:0; border-radius: 6px; padding: 6px 10px; }
  `]
})
export class AppComponent {
  private readonly auth = inject(AuthService);
  isAuthed() { return this.auth.isAuthenticated(); }
  logout() { this.auth.logout(); window.location.href = '/login'; }
}


