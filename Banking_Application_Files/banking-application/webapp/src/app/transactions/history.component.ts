import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../core/interceptors/services/transaction.service';
import { AccountService } from '../core/interceptors/services/account.service';
import { Transaction } from '../core/interceptors/shared/models';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="container">
    <header class="header">
      <div>
        <h2>Transaction History</h2>
        <p class="sub" *ngIf="accountId">For account #{{ accountId }}</p>
        <p class="sub" *ngIf="!accountId">All your transactions</p>
      </div>
      <div class="header-actions">
        <button class="btn" (click)="refresh()">Refresh</button>
        <a routerLink="/transactions/operate" class="btn">New Transaction</a>
      </div>
    </header>

    <!-- Account selector when no specific account is selected -->
    <div class="account-selector" *ngIf="!accountId && accounts().length > 1">
      <label for="accountSelect">Select Account:</label>
      <select id="accountSelect" (change)="onAccountChange($event)" class="account-select">
        <option value="">All Accounts</option>
        <option *ngFor="let acc of accounts()" [value]="acc.account_id">
          Account #{{ acc.account_id }} ({{ acc.balance | number:'1.2-2' }})
        </option>
      </select>
    </div>

    <div class="grid" *ngIf="txns().length; else empty">
      <div class="card" *ngFor="let t of txns()">
        <div class="row">
          <span>ID</span>
          <b>{{ t.transaction_id }}</b>
        </div>
        <div class="row">
          <span>Type</span>
          <b class="type-badge" [class]="'type-' + t.type.toLowerCase()">{{ t.type }}</b>
        </div>
        <div class="row">
          <span>Amount</span>
          <b class="amount" [class]="'amount-' + t.type.toLowerCase()">{{ t.amount | number:'1.2-2' }}</b>
        </div>
        <div class="row">
          <span>Status</span>
          <b class="status-badge" [class]="'status-' + t.status.toLowerCase()">{{ t.status }}</b>
        </div>
        <div class="row" *ngIf="t.timestamp">
          <span>When</span>
          <b>{{ t.timestamp | date:'short' }}</b>
        </div>
        <div class="row" *ngIf="t.account_id">
          <span>Account</span>
          <b>#{{ t.account_id }}</b>
        </div>
      </div>
    </div>
    
    <ng-template #empty>
      <div class="empty-state">
        <p>No transactions found.</p>
        <a routerLink="/transactions/operate" class="btn">Make your first transaction</a>
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
    .account-selector { margin-bottom: 24px; padding: 16px; background: #fff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,.06); }
    .account-selector label { display: block; margin-bottom: 8px; font-weight: 600; color: #374151; }
    .account-select { width: 100%; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; margin-top: 16px; }
    .card { padding: 20px; border-radius: 12px; background: #fff; box-shadow: 0 8px 24px rgba(0,0,0,.06); border: 1px solid #f3f4f6; }
    .row { display: flex; justify-content: space-between; margin: 8px 0; align-items: center; }
    .row span { color: #6b7280; font-size: 14px; }
    .row b { font-weight: 600; }
    .type-badge { padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; }
    .type-deposit { background: #ecfdf5; color: #065f46; }
    .type-withdraw { background: #fef2f2; color: #991b1b; }
    .type-transfer { background: #eff6ff; color: #1e40af; }
    .amount { font-weight: 700; }
    .amount-deposit { color: #065f46; }
    .amount-withdraw { color: #991b1b; }
    .amount-transfer { color: #1e40af; }
    .status-badge { padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; }
    .status-success { background: #ecfdf5; color: #065f46; }
    .status-pending { background: #fef3c7; color: #92400e; }
    .status-failed { background: #fef2f2; color: #991b1b; }
    .empty-state { text-align: center; padding: 48px 24px; }
    .empty-state p { color: #6b7280; margin-bottom: 16px; }
  `]
})
export class TransactionsHistoryComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly transactionService = inject(TransactionService);
  private readonly accountService = inject(AccountService);
  
  accountId = 0;
  txns = signal<Transaction[]>([]);
  accounts = signal<any[]>([]);
  selectedAccountId = '';

  constructor() {
    this.accountId = Number(this.route.snapshot.paramMap.get('accountId'));
    this.loadAccounts();
    this.loadTransactions();
  }

  loadAccounts() {
    this.accountService.myAccounts().subscribe({
      next: (list) => this.accounts.set(list || []),
      error: (e) => console.error('Error loading accounts:', e)
    });
  }

  loadTransactions() {
    if (this.accountId) {
      // Load transactions for specific account
      this.transactionService.history(this.accountId).subscribe({
        next: (list) => this.txns.set(list || []),
        error: (e) => { 
          this.txns.set([]); 
          console.error('history error', e?.error || e); 
        }
      });
    } else {
      // Load transactions from all accounts
      this.loadAllTransactions();
    }
  }

  loadAllTransactions() {
    // For now, we'll load transactions from the first account
    // In a real app, you might want to aggregate transactions from all accounts
    if (this.accounts().length > 0) {
      const firstAccountId = this.accounts()[0].account_id;
      this.transactionService.history(firstAccountId).subscribe({
        next: (list) => this.txns.set(list || []),
        error: (e) => { 
          this.txns.set([]); 
          console.error('history error', e?.error || e); 
        }
      });
    }
  }

  onAccountChange(event: any) {
    const selectedId = event.target.value;
    if (selectedId) {
      this.router.navigate(['/transactions', selectedId]);
    } else {
      this.router.navigate(['/transactions/history']);
    }
  }

  refresh() {
    this.loadTransactions();
  }
}


