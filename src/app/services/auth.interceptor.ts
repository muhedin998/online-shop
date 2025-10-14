import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth.token');
  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        try { localStorage.removeItem('auth.token'); } catch {}
        // Optionally also clear any stored roles/user identifiers if used
        // Redirect to login route if such route exists in this app
        // window.location.href = '/auth/login';
      }
      return throwError(() => err);
    })
  );
};

