import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TransactionService } from '../core/interceptors/services/transaction.service';

@Component({
  selector: 'app-admin-transactions',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <div class="container">
    <header class="header">
      <div>
        <h2>All System Transactions</h2>
        <p class="sub">Complete transaction history across all accounts</p>
      </div>
      <div class="header-actions">
        <button class="btn" (click)="refresh()">Refresh</button>
        <a routerLink="/transact" class="btn">New Transaction</a>
      </div>
    </header>

    <div class="grid" *ngIf="txns().length; else empty">
      <div class="card" *ngFor="let t of txns()">
        <div class="row">
          <span>ID</span>
          <b>{{ t.transaction_id }}</b>
        </div>
        <div class="row">
          <span>Account</span>
          <b>#{{ t.account_id }}</b>
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
      </div>
    </div>
    
    <ng-template #empty>
      <div class="empty-state">
        <p>No transactions found.</p>
        <a routerLink="/transact" class="btn">Make your first transaction</a>
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
export class AdminTransactionsComponent {
  private readonly transactionService = inject(TransactionService);
  
  txns = signal<any[]>([]);

  constructor() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.transactionService.getAllTransactions().subscribe({
      next: (list) => this.txns.set(list || []),
      error: (e) => { 
        this.txns.set([]); 
        console.error('Error loading transactions:', e?.error || e); 
      }
    });
  }

  refresh() {
    this.loadTransactions();
  }
}
