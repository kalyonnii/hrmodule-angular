import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LocalStorageService } from './services/local-storage.service';
import { projectConstantsLocal } from './constants/project-constants';

@Injectable()
export class ExtendhttpInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const authToken =
      this.localStorageService.getItemFromLocalStorage('accessToken');
      // console.log(authToken)
    if (authToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`,
        },
      });
    }
    request = request.clone({
      url: request.url.startsWith('http')
        ? request.url
        : projectConstantsLocal.BASE_URL + request.url,
      responseType: 'json',
    });
    return next.handle(request).pipe(
      tap(
        () => {},
        // (error) => {
        //   if (error.status === 401) {
        //     this.router.navigate(['/login']);
        //   }
        // }
        (error) => {
          console.log(error);
          if (error.status === 401 || error.status === 419) {
            this.localStorageService.clearAllFromLocalStorage();
            this.router.navigate(['user', 'login']);
          }
        }
      )
    );
  }
}
