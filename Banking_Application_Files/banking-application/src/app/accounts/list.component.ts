import { Component, Signal, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../core/interceptors/services/account.service';
import { Account } from '../core/interceptors/shared/models';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="container">
    <div class="header">
      <h2>Your accounts</h2>
      <a routerLink="/accounts/open" class="btn">Open new account</a>
    </div>
    <div class="grid" *ngIf="accounts().length; else empty">
      <div class="card" *ngFor="let a of accounts()">
        <div class="row"><span>ID</span><b>{{ a.account_id }}</b></div>
        <div class="row"><span>Balance</span><b>{{ a.balance | number:'1.2-2' }}</b></div>
        <div class="row"><span>Status</span><b>{{ a.status }}</b></div>
        <div class="actions">
          <button (click)="viewHistory(a.account_id)">History</button>
          <button class="danger" (click)="close(a.account_id)">Close</button>
        </div>
      </div>
    </div>
    <ng-template #empty>
      <p>No accounts yet.</p>
    </ng-template>
  </div>
  `,
  styles: [`
    .container { max-width: 960px; margin: 24px auto; padding: 0 16px; }
    .header { display: flex; align-items: center; justify-content: space-between; }
    .btn { background: #2563eb; color: #fff; padding: 8px 12px; border-radius: 8px; text-decoration: none; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; margin-top: 16px; }
    .card { padding: 16px; border-radius: 12px; background: #fff; box-shadow: 0 8px 24px rgba(0,0,0,.06); }
    .row { display: flex; justify-content: space-between; margin: 4px 0; }
    .actions { display: flex; gap: 8px; margin-top: 12px; }
    .danger { background: #b91c1c; color: #fff; }
    button { padding: 8px 10px; border: 0; border-radius: 8px; background: #111827; color: #fff; }
  `]
})
export class AccountsListComponent {
  private readonly accountService = inject(AccountService);
  accounts = signal<Account[]>([]);

  constructor() {
    this.load();
  }

  load() {
    this.accountService.myAccounts().subscribe((list) => this.accounts.set(list || []));
  }

  viewHistory(id: number) {
    window.location.href = `/transactions/${id}`;
  }

  close(id: number) {
    this.accountService.closeAccount(id).subscribe(() => this.load());
  }
}


