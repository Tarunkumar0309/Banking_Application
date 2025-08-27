import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = () => {
	const router = inject(Router);
	try {
		const token = localStorage.getItem('auth_token');
		const role = token ? JSON.parse(atob(token.split('.')[1])).role : undefined;
		if (role === 'ADMIN') return true;
	} catch {}
	router.navigate(['/']);
	return false;
};
