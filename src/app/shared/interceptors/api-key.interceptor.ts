import { HttpInterceptorFn } from '@angular/common/http';

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  const API_KEY = 'ZAW1112-95SM6DH-GS95VNZ-22AD2WD';
  const API_BASE_URL = 'https://api.poiskkino.dev';

  if (req.url.startsWith(API_BASE_URL)) {
    const clonedRequest = req.clone({
      setHeaders: {
        'X-API-KEY': API_KEY,
      },
    });
    return next(clonedRequest);
  }

  return next(req);
};

