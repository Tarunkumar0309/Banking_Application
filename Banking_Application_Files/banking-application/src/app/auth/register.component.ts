import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/interceptors/services/auth.services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <div class="auth-card">
    <h2>Create account</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <label>Username</label>
      <input formControlName="username" type="text" />
      <label>Password</label>
      <input formControlName="password" type="password" />
      <button type="submit" [disabled]="form.invalid || loading()">Register</button>
    </form>
    <p class="msg" *ngIf="message()">{{ message() }}</p>
    <p class="error" *ngIf="error()">{{ error() }}</p>
  </div>
  `,
  styles: [`
    .auth-card { max-width: 360px; margin: 64px auto; padding: 24px; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); background: #fff; }
    h2 { margin: 0 0 16px; }
    form { display: grid; gap: 8px; }
    input { padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px; }
    button { margin-top: 8px; padding: 10px 12px; border: 0; border-radius: 8px; background: #16a34a; color: white; }
    .msg { margin-top: 8px; color: #065f46; }
    .error { margin-top: 8px; color: #b91c1c; }
  `]
})
export class RegisterComponent {
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  loading = signal(false);
  error = signal('');
  message = signal('');

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');
    this.message.set('');
    this.auth.register(this.form.getRawValue() as any).subscribe({
      next: () => { this.loading.set(false); this.message.set('Registered! You can sign in.'); },
      error: (e) => { this.loading.set(false); this.error.set(e?.error?.error || 'Registration failed'); }
    });
  }
}


