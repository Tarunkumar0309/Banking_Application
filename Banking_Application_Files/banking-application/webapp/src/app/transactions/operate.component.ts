import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransactionService } from '../core/interceptors/services/transaction.service';

@Component({
  selector: 'app-transact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="container">
    <h2>Make a transaction</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <label>Type</label>
      <select formControlName="type">
        <option value="DEPOSIT">Deposit</option>
        <option value="WITHDRAW">Withdraw</option>
        <option value="TRANSFER">Transfer</option>
      </select>
      <label>From Account ID</label>
      <input type="number" formControlName="account_id" />
      <ng-container *ngIf="form.value.type === 'TRANSFER'">
        <label>To Account ID</label>
        <input type="number" formControlName="to_account_id" />
      </ng-container>
      <label>Amount</label>
      <input type="number" formControlName="amount" />
      <button type="submit" [disabled]="loading()">Submit</button>
    </form>
    <p class="msg" *ngIf="message()">{{ message() }}</p>
  </div>
  `,
  styles: [`
    .container { max-width: 520px; margin: 24px auto; padding: 16px; background: #fff; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,.06); }
    form { display: grid; gap: 8px; }
    input, select { padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px; }
    button { margin-top: 8px; padding: 10px 12px; border: 0; border-radius: 8px; background: #111827; color: white; }
    .msg { margin-top: 8px; color: #065f46; }
  `]
})
export class OperateTransactionsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly txnService = inject(TransactionService);
  loading = signal(false);
  message = signal('');

  form = this.fb.nonNullable.group({
    type: ['DEPOSIT', Validators.required],
    account_id: [0, Validators.required],
    to_account_id: [0],
    amount: [0, [Validators.required, Validators.min(0.01)]]
  });

  onSubmit() {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    this.loading.set(true);
    this.message.set('');
    if (v.type === 'DEPOSIT') {
      this.txnService.deposit({ account_id: v.account_id, amount: v.amount }).subscribe(this.handleResp());
    } else if (v.type === 'WITHDRAW') {
      this.txnService.withdraw({ account_id: v.account_id, amount: v.amount }).subscribe(this.handleResp());
    } else {
      this.txnService.transfer({ from_account: v.account_id, to_account: v.to_account_id!, amount: v.amount }).subscribe(this.handleResp());
    }
  }

  private handleResp() {
    return {
      next: (res: any) => { this.loading.set(false); this.message.set(res?.msg || 'Transaction successful'); },
      error: (e: any) => { this.loading.set(false); this.message.set(e?.error?.error || e?.message || 'Transaction failed'); }
    } as any;
  }
}


