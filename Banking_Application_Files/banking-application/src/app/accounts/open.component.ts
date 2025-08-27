import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '../core/interceptors/services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-open-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="container">
    <h2>Open account</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <label>Initial deposit</label>
      <input type="number" formControlName="initial_deposit" />
      <button type="submit" [disabled]="loading()">Open</button>
    </form>
    <p class="msg" *ngIf="message()">{{ message() }}</p>
  </div>
  `,
  styles: [`
    .container { max-width: 520px; margin: 24px auto; padding: 16px; background: #fff; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,.06); }
    form { display: grid; gap: 8px; }
    input { padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px; }
    button { margin-top: 8px; padding: 10px 12px; border: 0; border-radius: 8px; background: #16a34a; color: white; }
    .msg { margin-top: 8px; color: #065f46; }
  `]
})
export class OpenAccountComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly accountService = inject(AccountService);
  loading = signal(false);
  message = signal('');

  form = this.fb.group({ initial_deposit: [0] });

  onSubmit() {
    this.loading.set(true);
    this.accountService.openAccount(this.form.getRawValue() as any).subscribe({
      next: () => { this.loading.set(false); this.router.navigate(['/accounts']); },
      error: () => { this.loading.set(false); this.message.set('Failed to open account'); }
    });
  }
}


