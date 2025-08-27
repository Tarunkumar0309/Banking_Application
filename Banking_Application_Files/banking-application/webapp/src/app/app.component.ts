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
		<a routerLink="/" class="brand">🏦 Banking App</a>
		<div class="links" *ngIf="isAuthed(); else guest">
			<div class="user-info">
				<span class="role" [class.admin]="isAdmin()" [class.user]="!isAdmin()">
					{{ isAdmin() ? '👑 ADMIN' : '👤 USER' }}
				</span>
			</div>
			
			<!-- Admin Navigation -->
			<div class="nav-section" *ngIf="isAdmin()">
				<a routerLink="/admin" class="nav-link">Dashboard</a>
				<a routerLink="/accounts" class="nav-link">All Accounts</a>
				<a routerLink="/transactions/history" class="nav-link">All Transactions</a>
			</div>
			
			<!-- User Navigation -->
			<div class="nav-section" *ngIf="!isAdmin()">
				<a routerLink="/dashboard" class="nav-link">Dashboard</a>
				<a routerLink="/accounts" class="nav-link">My Accounts</a>
				<a routerLink="/transact" class="nav-link">Transact</a>
				<a routerLink="/transactions/history" class="nav-link">History</a>
			</div>
			
			<button (click)="logout()" class="logout-btn">🚪 Logout</button>
		</div>
		<ng-template #guest>
			<div class="guest-links">
				<a routerLink="/login" class="nav-link">🔑 Login</a>
				<a routerLink="/register" class="nav-link">📝 Register</a>
			</div>
		</ng-template>
	</nav>
	<router-outlet />
	`,
	styles: [`
		:host { display: block; min-height: 100vh; background: #f3f4f6; }
		.topbar { 
			position: sticky; top:0; z-index: 10; 
			display:flex; align-items:center; justify-content: space-between; 
			padding: 16px 24px; background: linear-gradient(135deg, #111827 0%, #1f2937 100%); 
			color:#fff; box-shadow: 0 4px 12px rgba(0,0,0,0.1);
		}
		.brand { 
			color:#fff; text-decoration: none; font-weight: 700; font-size: 18px;
			display: flex; align-items: center; gap: 8px;
		}
		.links { 
			display: flex; gap: 24px; align-items: center; 
		}
		.user-info { 
			display: flex; align-items: center; 
		}
		.role { 
			padding: 6px 12px; border-radius: 999px; font-size: 12px; font-weight: 600;
			display: flex; align-items: center; gap: 4px;
		}
		.role.admin { 
			background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); 
			color: #fff;
		}
		.role.user { 
			background: linear-gradient(135deg, #059669 0%, #10b981 100%); 
			color: #fff;
		}
		.nav-section { 
			display: flex; gap: 16px; align-items: center; 
		}
		.nav-link { 
			color:#e5e7eb; text-decoration: none; padding: 8px 12px; border-radius: 6px;
			transition: all 0.2s; font-weight: 500;
		}
		.nav-link:hover { 
			color: #fff; background: rgba(255,255,255,0.1); 
		}
		.logout-btn { 
			background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); 
			color:#fff; border:0; border-radius: 8px; padding: 8px 16px;
			cursor: pointer; font-weight: 500; transition: all 0.2s;
		}
		.logout-btn:hover { 
			transform: translateY(-1px); box-shadow: 0 4px 12px rgba(239,68,68,0.3);
		}
		.guest-links { 
			display: flex; gap: 16px; align-items: center; 
		}
	`]
})
export class AppComponent {
	private readonly auth = inject(AuthService);
	isAuthed() { return this.auth.isAuthenticated(); }
	isAdmin() { try { const t = this.auth.getToken(); return t ? JSON.parse(atob(t.split('.')[1])).role === 'ADMIN' : false; } catch { return false; } }
	logout() { this.auth.logout(); window.location.href = '/login'; }
}


