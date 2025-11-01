import { HttpInterceptorFn } from '@angular/common/http';

const TOKEN_KEY = 'barber_token_v1';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let token: string | null = null;
  try { token = localStorage.getItem(TOKEN_KEY); } catch {}

  if (token) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(authReq);
  }
  return next(req);
};

