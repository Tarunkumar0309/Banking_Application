import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/interceptors/services/auth.services';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, RouterLink],
	template: `
	<div class="auth-card">
		<h2>Sign in</h2>
		<form [formGroup]="form" (ngSubmit)="onSubmit()">
			<label>Username</label>
			<input formControlName="username" type="text" />
			<label>Password</label>
			<input formControlName="password" type="password" />
			<button type="submit" [disabled]="form.invalid || loading()">Login</button>
		</form>
		<p class="error" *ngIf="error()">{{ error() }}</p>
		<p class="hint">New here? <a routerLink="/register" class="link">Create an account</a></p>
	</div>
	`,
	styles: [`
		.auth-card { max-width: 380px; margin: 64px auto; padding: 28px; border-radius: 16px; box-shadow: 0 12px 32px rgba(0,0,0,0.08); background: #fff; border:1px solid #eef2ff; }
		h2 { margin: 0 0 16px; color:#0f172a; }
		form { display: grid; gap: 10px; }
		input { padding: 12px 14px; border: 1px solid #c7d2fe; border-radius: 10px; }
		input:focus { outline: none; border-color:#6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
		select { padding: 12px 14px; border: 1px solid #c7d2fe; border-radius: 10px; }
		button { margin-top: 10px; padding: 12px 14px; border: 0; border-radius: 10px; background: linear-gradient(90deg,#4f46e5,#06b6d4); color: white; font-weight:600; }
		button.secondary { background: #111827; }
		.error { margin-top: 8px; color: #b91c1c; }
		.msg { margin-top: 8px; color:#065f46; }
		.hint { margin-top: 8px; color:#475569; font-size: 14px; }
		.link { background:none; border:0; color:#0ea5e9; cursor:pointer; padding:0; }
		.divider { display:flex; align-items:center; gap:8px; margin:16px 0 8px; color:#475569; }
		.divider::before, .divider::after { content:''; flex:1; height:1px; background:#e5e7eb; }
	`]
})
export class LoginComponent {
	private readonly auth = inject(AuthService);
	private readonly fb = inject(FormBuilder);
	private readonly router = inject(Router);
	loading = signal(false);
	error = signal('');
	message = signal('');
	showSignup = signal(false);

	form = this.fb.group({
		username: ['', Validators.required],
		password: ['', Validators.required]
	});

	formSignup = this.fb.group({
		username: ['', Validators.required],
		password: ['', Validators.required],
		role: ['USER', Validators.required]
	});

	onSubmit() {
		if (this.form.invalid) return;
		this.loading.set(true);
		this.error.set('');
		this.auth.login(this.form.getRawValue() as any).subscribe({
			next: () => { this.loading.set(false); this.router.navigate(['/dashboard']); },
			error: (e) => { this.loading.set(false); this.error.set(e?.error?.error || 'Login failed'); }
		});
	}

	toggleSignup() {
		this.showSignup.set(!this.showSignup());
	}

	onRegister() {
		if (this.formSignup.invalid) return;
		this.loading.set(true);
		this.error.set('');
		this.message.set('');
		this.auth.register(this.formSignup.getRawValue() as any).subscribe({
			next: () => { this.loading.set(false); this.message.set('Registered! You can sign in now.'); },
			error: (e) => { this.loading.set(false); this.error.set(e?.error?.error || 'Registration failed'); }
		});
	}
}


