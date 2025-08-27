import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.services';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();
  if (!token) {
    return next(req);
  }
  const cloned = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });
  return next(cloned);
};


