import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, DecimalPipe, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../core/interceptors/services/account.service';
import { TransactionService } from '../core/interceptors/services/transaction.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, DecimalPipe, NgOptimizedImage, FormsModule],
  template: `
  <div class="container">
    <header class="header">
      <div>
        <h2>Admin Dashboard</h2>
        <p class="sub">System-wide overview and management</p>
      </div>

    </header>

    <section class="stats">
      <div class="stat">
        <div class="label">Total Accounts</div>
        <div class="value">{{ accounts().length }}</div>
      </div>
      <div class="stat">
        <div class="label">Active Accounts</div>
        <div class="value">{{ activeCount() }}</div>
      </div>
      <div class="stat">
        <div class="label">Total Balance</div>
        <div class="value">{{ totalBalance() | number:'1.0-2' }}</div>
      </div>
      <div class="stat">
        <div class="label">Total Transactions</div>
        <div class="value">{{ txns().length }}</div>
      </div>
    </section>

    <section class="quick">
      <h3>Quick Admin Actions</h3>
      <div class="quick-grid">
        <div class="quick-card">
          <div class="row">
            <label>Account ID</label>
            <input type="number" [(ngModel)]="actionAccountId" placeholder="Enter account ID" />
          </div>
          <div class="row">
            <label>Amount</label>
            <input type="number" [(ngModel)]="actionAmount" placeholder="Enter amount" />
          </div>
          <div class="actions">
            <button class="btn small" (click)="deposit()">Deposit</button>
            <button class="btn small warn" (click)="withdraw()">Withdraw</button>
            <button class="btn small danger" (click)="closeAccount()">Close Account</button>
          </div>
          <p class="msg" *ngIf="message">{{ message }}</p>
        </div>
      </div>
    </section>

    <div class="grid">
      <div class="card">
        <div class="card-head">
          <h3>All System Accounts</h3>
        </div>
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let a of accounts()">
                <td>{{ a.account_id }}</td>
                <td>#{{ a.user_id }}</td>
                <td>{{ a.balance | number:'1.2-2' }}</td>
                <td>
                  <span class="badge" [class.green]="a.status==='ACTIVE'" [class.red]="a.status!=='ACTIVE'">{{ a.status }}</span>
                </td>
                <td class="actions-cell">
                  <button class="btn tiny danger" (click)="closeAccount(a.account_id)">Close</button>
                </td>
              </tr>
              <tr *ngIf="!accounts().length">
                <td colspan="5" class="empty">No accounts</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <div class="card-head">
          <h3>All System Transactions</h3>
        </div>
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Account</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let t of txns()">
                <td>{{ t.transaction_id }}</td>
                <td>#{{ t.account_id }}</td>
                <td><span class="badge blue">{{ t.type }}</span></td>
                <td>{{ t.amount | number:'1.2-2' }}</td>
                <td><span class="badge" [class.green]="t.status==='SUCCESS'" [class.red]="t.status!=='SUCCESS'">{{ t.status }}</span></td>
              </tr>
              <tr *ngIf="!txns().length">
                <td colspan="5" class="empty">No transactions</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <section class="analytics">
      <h3>System Analytics</h3>
      <div class="analytics-grid">
        <div class="analytics-card">
          <h4>Account Status</h4>
          <div class="status-breakdown">
            <div class="status-item">
              <span class="dot green"></span>
              <span>Active: {{ activeCount() }}</span>
            </div>
            <div class="status-item">
              <span class="dot red"></span>
              <span>Closed: {{ closedCount() }}</span>
            </div>
            <div class="status-item">
              <span class="dot yellow"></span>
              <span>Suspended: {{ suspendedCount() }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  `,
  styles: [`
    .container { max-width: 1200px; margin: 24px auto; padding: 0 16px; }
    .header { display:flex; align-items:center; justify-content: space-between; margin-bottom: 16px; }
    .sub { color:#6b7280; margin-top: 4px; }
    .header-actions { display:flex; gap: 8px; }
    .btn { background:#111827; color:#fff; border:0; padding:8px 12px; border-radius:8px; cursor:pointer; }
    .btn.ghost { background:transparent; color:#111827; border:1px solid #e5e7eb; }
    .btn.small { padding:6px 10px; }
    .btn.tiny { padding:4px 8px; font-size:12px; }
    .btn.warn { background:#b45309; }
    .btn.danger { background:#991b1b; }
    .stats { display:grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap:12px; margin-bottom: 16px; }
    .stat { background:#fff; border-radius:12px; padding:12px 16px; box-shadow:0 6px 18px rgba(0,0,0,.06); }
    .stat .label { color:#6b7280; font-size:12px; }
    .stat .value { font-weight:700; font-size:20px; }
    .quick { background:#fff; border-radius:12px; box-shadow:0 6px 18px rgba(0,0,0,.06); padding:12px 16px; margin-bottom:16px; }
    .quick-grid { display:grid; grid-template-columns: 1fr 1fr; gap:16px; }
    .quick-card { padding:16px; border:1px solid #e5e7eb; border-radius:8px; }
    .quick-card h4 { margin:0 0 12px; color:#374151; }
    .quick-card .row { display:flex; gap:12px; align-items:center; margin:8px 0; }
    .quick-card label { width:120px; color:#6b7280; }
    .quick-card input { flex:1; padding:8px 10px; border:1px solid #e5e7eb; border-radius:8px; }
    .quick-card .actions { display:flex; gap:8px; margin-top:8px; }
    .msg { color:#065f46; margin-top:8px; }
    .grid { display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom: 16px; }
    .card { background:#fff; border-radius:12px; box-shadow:0 8px 24px rgba(0,0,0,.06); }
    .card-head { display:flex; align-items:center; justify-content: space-between; padding:12px 16px; border-bottom:1px solid #f3f4f6; }
    .table-wrap { overflow:auto; }
    .table { width:100%; border-collapse: collapse; }
    .table th, .table td { padding:10px 12px; border-bottom:1px solid #f3f4f6; text-align:left; }
    .badge { display:inline-block; padding:3px 8px; border-radius:999px; background:#f3f4f6; color:#111827; font-size:12px; }
    .badge.green { background:#ecfdf5; color:#065f46; }
    .badge.red { background:#fef2f2; color:#991b1b; }
    .badge.blue { background:#eff6ff; color:#1e40af; }
    .empty { color:#6b7280; text-align:center; padding:12px 0; }
    .actions-cell { white-space: nowrap; }
    .analytics { background:#fff; border-radius:12px; box-shadow:0 8px 24px rgba(0,0,0,.06); padding:20px; }
    .analytics-grid { display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-top:16px; }
    .analytics-card { padding:16px; border:1px solid #e5e7eb; border-radius:8px; }
    .analytics-card h4 { margin:0 0 12px; color:#374151; }
    .trend-item, .status-item { display:flex; justify-content:space-between; margin:8px 0; }
    .trend-item .value { font-weight:600; }
    .status-item .dot { width:8px; height:8px; border-radius:50%; display:inline-block; margin-right:8px; }
    .dot.green { background:#10b981; }
    .dot.red { background:#ef4444; }
    .dot.yellow { background:#f59e0b; }
  `]
})
export class AdminDashboardComponent {
  private readonly accountService = inject(AccountService);
  private readonly transactionService = inject(TransactionService);

  accounts = signal<any[]>([]);
  txns = signal<any[]>([]);
  actionAccountId: number = 0;
  actionAmount: number = 0;
  message = '';

  activeCount = computed(() => this.accounts().filter(a => a.status === 'ACTIVE').length);
  closedCount = computed(() => this.accounts().filter(a => a.status === 'CLOSED').length);
  suspendedCount = computed(() => this.accounts().filter(a => a.status === 'SUSPENDED').length);
  totalBalance = computed(() => this.accounts().reduce((s, a) => s + Number(a.balance || 0), 0));

  constructor() {
    this.refreshAll();
  }

  refreshAll() {
    this.loadAccounts();
    this.loadTxns();
  }

  loadAccounts() {
    this.accountService.getAllAccounts().subscribe({ 
      next: (r) => this.accounts.set(r || []),
      error: (e) => {
        console.error('Error loading accounts:', e);
        this.message = 'Error loading accounts: ' + (e?.error?.error || 'Unknown error');
      }
    });
  }

  loadTxns() {
    this.transactionService.getAllTransactions().subscribe({ 
      next: (r) => this.txns.set(r || []),
      error: (e) => {
        console.error('Error loading transactions:', e);
        this.message = 'Error loading transactions: ' + (e?.error?.error || 'Unknown error');
      }
    });
  }

  deposit() {
    if (!this.actionAccountId || !this.actionAmount) {
      this.message = 'Please enter both Account ID and Amount';
      return;
    }
    
    this.message = 'Processing deposit...';
    this.transactionService.deposit({ account_id: this.actionAccountId, amount: this.actionAmount })
      .subscribe({ 
        next: (r: any) => { 
          this.message = r?.msg || 'Deposit successful!'; 
          this.refreshAll(); 
        },
        error: (e) => {
          this.message = 'Error: ' + (e?.error?.error || 'Deposit failed');
          console.error('Deposit error:', e);
        }
      });
  }

  withdraw() {
    if (!this.actionAccountId || !this.actionAmount) {
      this.message = 'Please enter both Account ID and Amount';
      return;
    }
    
    this.message = 'Processing withdrawal...';
    this.transactionService.withdraw({ account_id: this.actionAccountId, amount: this.actionAmount })
      .subscribe({ 
        next: (r: any) => { 
          this.message = r?.msg || 'Withdrawal successful!'; 
          this.refreshAll(); 
        },
        error: (e) => {
          this.message = 'Error: ' + (e?.error?.error || 'Withdrawal failed');
          console.error('Withdrawal error:', e);
        }
      });
  }

  closeAccount(id?: number) {
    const target = id ?? this.actionAccountId;
    if (!target) {
      this.message = 'Please enter Account ID';
      return;
    }
    
    this.message = 'Closing account...';
    this.accountService.closeAccount(target).subscribe({ 
      next: (r: any) => { 
        this.message = r?.msg || 'Account closed successfully!'; 
        this.refreshAll(); 
      },
      error: (e) => {
        this.message = 'Error: ' + (e?.error?.error || 'Failed to close account');
        console.error('Close account error:', e);
      }
    });
  }
}


