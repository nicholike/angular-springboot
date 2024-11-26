import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Kiểm tra xem có phải trên trình duyệt không
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');

      if (token) {
        const clonedRequest = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        
        return next.handle(clonedRequest).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              // Token hết hạn, chuyển về login
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              this.router.navigate(['/login']);
            }
            return throwError(error);
          })
        );
      }
    }

    return next.handle(req);
  }
}