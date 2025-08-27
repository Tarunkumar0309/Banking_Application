import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TransactionService } from '../core/interceptors/services/transaction.service';
import { Transaction } from '../core/interceptors/shared/models';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="container">
    <h2>Transaction history for account #{{ accountId }}</h2>
    <div class="grid" *ngIf="txns().length; else empty">
      <div class="card" *ngFor="let t of txns()">
        <div class="row"><span>ID</span><b>{{ t.transaction_id }}</b></div>
        <div class="row"><span>Type</span><b>{{ t.type }}</b></div>
        <div class="row"><span>Amount</span><b>{{ t.amount | number:'1.2-2' }}</b></div>
        <div class="row"><span>Status</span><b>{{ t.status }}</b></div>
        <div class="row" *ngIf="t.created_at"><span>When</span><b>{{ t.created_at }}</b></div>
      </div>
    </div>
    <ng-template #empty>
      <p>No transactions found.</p>
    </ng-template>
  </div>
  `,
  styles: [`
    .container { max-width: 960px; margin: 24px auto; padding: 0 16px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; margin-top: 16px; }
    .card { padding: 16px; border-radius: 12px; background: #fff; box-shadow: 0 8px 24px rgba(0,0,0,.06); }
    .row { display: flex; justify-content: space-between; margin: 4px 0; }
  `]
})
export class TransactionsHistoryComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(TransactionService);
  accountId = 0;
  txns = signal<Transaction[]>([]);

  constructor() {
    this.accountId = Number(this.route.snapshot.paramMap.get('accountId'));
    if (this.accountId) {
      this.service.history(this.accountId).subscribe((list) => this.txns.set(list || []));
    }
  }
}


