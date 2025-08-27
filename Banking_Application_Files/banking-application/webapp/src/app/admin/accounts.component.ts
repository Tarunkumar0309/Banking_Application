import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AccountService } from '../core/interceptors/services/account.service';

@Component({
  selector: 'app-admin-accounts',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <div class="container">
    <header class="header">
      <div>
        <h2>All System Accounts</h2>
        <p class="sub">Complete account overview across all users</p>
      </div>
      <div class="header-actions">
        <button class="btn" (click)="refresh()">Refresh</button>
        <a routerLink="/accounts/open" class="btn">New Account</a>
      </div>
    </header>

    <div class="grid" *ngIf="accounts().length; else empty">
      <div class="card" *ngFor="let a of accounts()">
        <div class="row">
          <span>Account ID</span>
          <b>{{ a.account_id }}</b>
        </div>
        <div class="row">
          <span>User ID</span>
          <b>#{{ a.user_id }}</b>
        </div>
        <div class="row">
          <span>Balance</span>
          <b class="balance">{{ a.balance | number:'1.2-2' }}</b>
        </div>
        <div class="row">
          <span>Status</span>
          <b class="status-badge" [class]="'status-' + a.status.toLowerCase()">{{ a.status }}</b>
        </div>
        <div class="row" *ngIf="a.created_at">
          <span>Created</span>
          <b>{{ a.created_at | date:'short' }}</b>
        </div>
      </div>
    </div>
    
    <ng-template #empty>
      <div class="empty-state">
        <p>No accounts found.</p>
        <a routerLink="/accounts/open" class="btn">Create your first account</a>
      </div>
    </ng-template>
  </div>
  `,
  styles: [`
    .container { max-width: 1200px; margin: 24px auto; padding: 0 16px; }
    .header { display:flex; align-items:center; justify-content: space-between; margin-bottom: 24px; }
    .sub { color:#6b7280; margin-top: 4px; }
    .header-actions { display:flex; gap: 8px; }
    .btn { background:#111827; color:#fff; border:0; padding:8px 12px; border-radius:8px; cursor:pointer; text-decoration:none; display:inline-block; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; margin-top: 16px; }
    .card { padding: 20px; border-radius: 12px; background: #fff; box-shadow: 0 8px 24px rgba(0,0,0,.06); border: 1px solid #f3f4f6; }
    .row { display: flex; justify-content: space-between; margin: 8px 0; align-items: center; }
    .row span { color: #6b7280; font-size: 14px; }
    .row b { font-weight: 600; }
    .balance { font-weight: 700; color: #065f46; }
    .status-badge { padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; }
    .status-active { background: #ecfdf5; color: #065f46; }
    .status-closed { background: #fef2f2; color: #991b1b; }
    .status-suspended { background: #fef3c7; color: #92400e; }
    .empty-state { text-align: center; padding: 48px 24px; }
    .empty-state p { color: #6b7280; margin-bottom: 16px; }
  `]
})
export class AdminAccountsComponent {
  private readonly accountService = inject(AccountService);
  
  accounts = signal<any[]>([]);

  constructor() {
    this.loadAccounts();
  }

  loadAccounts() {
    this.accountService.getAllAccounts().subscribe({
      next: (list) => this.accounts.set(list || []),
      error: (e) => { 
        this.accounts.set([]); 
        console.error('Error loading accounts:', e?.error || e); 
      }
    });
  }

  refresh() {
    this.loadAccounts();
  }
}
