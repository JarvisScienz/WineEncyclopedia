import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../_services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            const isAuthEndpoint = request.url.includes('/authentication/login') || request.url.includes('/authentication/createUser');
            if (!isAuthEndpoint && (err.status === 401 || err.status === 403)) {
                // auto logout if 401/403 response returned from api (except auth endpoints)
                this.authenticationService.logout().subscribe();
                //location.reload(true);
            }

            return throwError(err);
        }))
    }
}