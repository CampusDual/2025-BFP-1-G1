import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private userService: UsersService, private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');
    if (token) {
      if (this.userService.isTokenExpired()) {
        console.warn('Token JWT caducado. Cerrando sesión automáticamente.');
        this.userService.logout();
        this.router.navigate(['/login']);
        return throwError(() => new Error('Sesión caducada.'));
      }

      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.error(
            'Petición no autorizada (401). Posible token inválido o caducado.'
          );
          this.userService.logout();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
