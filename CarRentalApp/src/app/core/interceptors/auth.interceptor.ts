import { HttpInterceptorFn } from '@angular/common/http';

const AUTH_USER_KEY = 'auth_user';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let token: string | null = null;

  if (typeof window !== 'undefined') {
    const storedUser = window.localStorage.getItem(AUTH_USER_KEY);
    if (storedUser) {
      try {
        token = JSON.parse(storedUser)?.token ?? null;
      } catch (error) {
        console.error('Failed to parse stored auth user', error);
        window.localStorage.removeItem(AUTH_USER_KEY);
      }
    }
  }

  if (token && !req.headers.has('Authorization')) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};
