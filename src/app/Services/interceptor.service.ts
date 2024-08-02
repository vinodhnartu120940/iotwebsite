import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { LoadingService } from './loading.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
  constructor(
    private auth: AuthService,
    private notification: NotificationService,
    private loderService: LoadingService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Check if the request body is an instance of FormData
    let modifiedReq = req;
    if (req.body instanceof FormData) {
      // Clone the request without setting the Content-Type header
      modifiedReq = req.clone({
        headers: req.headers.set('Authorization', this.auth.headerToken),
      });
    } else {
      // Clone the request and set the headers as usual
      modifiedReq = req.clone({
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: this.auth.headerToken,
        }),
      });
    }

    // Handle the loading indicator for requests targeting 'api'
    if (req.url.includes('api')) {
      this.addRequest(req);
    }

    return next.handle(modifiedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.auth.logOut();
        } else if (
          environment.env != 'prod' &&
          error instanceof HttpErrorResponse
        ) {
          this.notification.showError(
            error.message || error.error.message,
            'Server Error'
          );
        }
        return throwError(error);
      }),
      finalize(() => this.removeRequest(req))
    );
  }

  private requests: HttpRequest<any>[] = [];

  addRequest(req: HttpRequest<any>) {
    this.requests.push(req);
    this.loderService.toggleButtonLoading(this.requests.length > 0);
  }

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    this.loderService.toggleButtonLoading(this.requests.length > 0);
  }
}
