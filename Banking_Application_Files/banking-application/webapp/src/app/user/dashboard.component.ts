import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthService } from '../core/interceptors/services/auth.services';
import { AccountService } from '../core/interceptors/services/account.service';
import { TransactionService } from '../core/interceptors/services/transaction.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, DecimalPipe, RouterLink],
  template: `
  <div class="container">
    <header class="header">
      <div>
        <h2>Welcome to Your Dashboard</h2>
        <p class="sub">Manage your accounts and view your financial activity</p>
      </div>
      <div class="header-actions">
        <button class="btn" (click)="refreshAll()">Refresh</button>
      </div>
    </header>

    <section class="stats">
      <div class="stat">
        <div class="label">Your Accounts</div>
        <div class="value">{{ accounts().length }}</div>
      </div>
      <div class="stat">
        <div class="label">Total Balance</div>
        <div class="value">{{ totalBalance() | number:'1.0-2' }}</div>
      </div>
      <div class="stat">
        <div class="label">This Month</div>
        <div class="value">{{ monthlyTransactions() | number:'1.0-2' }}</div>
      </div>
      <div class="stat">
        <div class="label">Active</div>
        <div class="value">{{ activeCount() }}</div>
      </div>
    </section>

    <div class="grid">
      <div class="card">
        <div class="card-head">
          <h3>Your Accounts</h3>
          <div class="card-actions">
            <button class="btn ghost" (click)="loadAccounts()">Refresh</button>
            <a routerLink="/accounts" class="btn">Manage</a>
          </div>
        </div>
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Account ID</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let a of accounts()">
                <td>#{{ a.account_id }}</td>
                <td>{{ a.balance | number:'1.2-2' }}</td>
                <td>
                  <span class="badge" [class.green]="a.status==='ACTIVE'" [class.red]="a.status!=='ACTIVE'">{{ a.status }}</span>
                </td>
                <td>
                  <a routerLink="/transact" [queryParams]="{account: a.account_id}" class="btn tiny">Transact</a>
                </td>
              </tr>
              <tr *ngIf="!accounts().length">
                <td colspan="4" class="empty">No accounts found. <a routerLink="/accounts">Open your first account</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <div class="card-head">
          <h3>Recent Transactions</h3>
          <div class="card-actions">
            <button class="btn ghost" (click)="loadTransactions()">Refresh</button>
            <a routerLink="/transactions/history" class="btn">View All</a>
          </div>
        </div>
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let t of recentTransactions()">
                <td><span class="badge blue">{{ t.type }}</span></td>
                <td>{{ t.amount | number:'1.2-2' }}</td>
                <td><span class="badge" [class.green]="t.status==='SUCCESS'" [class.red]="t.status!=='SUCCESS'">{{ t.status }}</span></td>
                <td>{{ t.timestamp | date:'short' }}</td>
              </tr>
              <tr *ngIf="!recentTransactions().length">
                <td colspan="4" class="empty">No transactions yet</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <section class="quick-actions">
      <h3>Quick Actions</h3>
      <div class="action-grid">
        <a routerLink="/accounts" class="action-card">
          <div class="icon">🏦</div>
          <h4>Open New Account</h4>
          <p>Create a new savings or checking account</p>
        </a>
        <a routerLink="/transact" class="action-card">
          <div class="icon">💳</div>
          <h4>Make Transaction</h4>
          <p>Deposit, withdraw, or transfer money</p>
        </a>
        <a routerLink="/transactions/history" class="action-card">
          <div class="icon">📊</div>
          <h4>Transaction History</h4>
          <p>View detailed transaction records</p>
        </a>
      </div>
    </section>
  </div>
  `,
  styles: [`
    .container { max-width: 1200px; margin: 24px auto; padding: 0 16px; }
    .header { display:flex; align-items:center; justify-content: space-between; margin-bottom: 24px; }
    .sub { color:#6b7280; margin-top: 4px; }
    .header-actions { display:flex; gap: 8px; }
    .btn { background:#111827; color:#fff; border:0; padding:8px 12px; border-radius:8px; cursor:pointer; text-decoration:none; display:inline-block; }
    .btn.ghost { background:transparent; color:#111827; border:1px solid #e5e7eb; }
    .btn.tiny { padding:4px 8px; font-size:12px; }
    .stats { display:grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap:12px; margin-bottom: 24px; }
    .stat { background:#fff; border-radius:12px; padding:16px; box-shadow:0 6px 18px rgba(0,0,0,.06); }
    .stat .label { color:#6b7280; font-size:12px; margin-bottom:4px; }
    .stat .value { font-weight:700; font-size:24px; }
    .grid { display:grid; grid-template-columns: 1fr 1fr; gap:24px; margin-bottom: 24px; }
    .card { background:#fff; border-radius:12px; box-shadow:0 8px 24px rgba(0,0,0,.06); }
    .card-head { display:flex; align-items:center; justify-content: space-between; padding:16px; border-bottom:1px solid #f3f4f6; }
    .card-actions { display:flex; gap: 8px; }
    .table-wrap { overflow:auto; }
    .table { width:100%; border-collapse: collapse; }
    .table th, .table td { padding:12px; border-bottom:1px solid #f3f4f6; text-align:left; }
    .badge { display:inline-block; padding:4px 8px; border-radius:999px; background:#f3f4f6; color:#111827; font-size:12px; }
    .badge.green { background:#ecfdf5; color:#065f46; }
    .badge.red { background:#fef2f2; color:#991b1b; }
    .badge.blue { background:#eff6ff; color:#1e40af; }
    .empty { color:#6b7280; text-align:center; padding:16px 0; }
    .empty a { color:#0ea5e9; text-decoration:none; }
    .quick-actions { background:#fff; border-radius:12px; box-shadow:0 8px 24px rgba(0,0,0,.06); padding:20px; }
    .action-grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:16px; margin-top:16px; }
    .action-card { display:block; padding:20px; border-radius:8px; border:1px solid #e5e7eb; text-decoration:none; color:#111827; transition:all 0.2s; }
    .action-card:hover { border-color:#0ea5e9; box-shadow:0 4px 12px rgba(14,165,233,0.1); }
    .action-card .icon { font-size:32px; margin-bottom:12px; }
    .action-card h4 { margin:0 0 8px; font-size:16px; }
    .action-card p { margin:0; color:#6b7280; font-size:14px; }
  `]
})
export class UserDashboardComponent {
  private readonly accountService = inject(AccountService);
  private readonly transactionService = inject(TransactionService);
  private readonly auth = inject(AuthService);

  accounts = signal<any[]>([]);
  transactions = signal<any[]>([]);

  activeCount = computed(() => this.accounts().filter(a => a.status === 'ACTIVE').length);
  totalBalance = computed(() => this.accounts().reduce((s, a) => s + Number(a.balance || 0), 0));
  monthlyTransactions = computed(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    return this.transactions()
      .filter(t => new Date(t.timestamp) >= monthStart)
      .reduce((s, t) => s + Number(t.amount || 0), 0);
  });
  recentTransactions = computed(() => this.transactions().slice(0, 5));

  constructor() {
    this.refreshAll();
  }

  refreshAll() {
    this.loadAccounts();
    this.loadTransactions();
  }

  loadAccounts() {
    // Get user's own accounts using the service
    this.accountService.myAccounts().subscribe({ 
      next: (r) => this.accounts.set(r || []),
      error: (e) => console.error('Error loading accounts:', e)
    });
  }

  loadTransactions() {
    // For now, we'll get transactions from the first account if available
    if (this.accounts().length > 0) {
      const firstAccountId = this.accounts()[0].account_id;
      this.transactionService.history(firstAccountId).subscribe({ 
        next: (r) => this.transactions.set(r || []),
        error: (e) => console.error('Error loading transactions:', e)
      });
    } else {
      this.transactions.set([]);
    }
  }
}


