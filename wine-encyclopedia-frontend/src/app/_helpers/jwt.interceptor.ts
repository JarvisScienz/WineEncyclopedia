import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Il JWT è in un cookie httpOnly gestito dal backend: JS non lo legge mai.
        // Basta inviare le credenziali (cookie) con ogni richiesta.
        return next.handle(request.clone({ withCredentials: true }));
    }
}
