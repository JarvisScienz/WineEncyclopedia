import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GrapeService {
  private rootURL = environment.apiUrl;

  constructor(private http: HttpClient) {}
  getGrapesName() {
    return this.http.get(this.rootURL + '/grapesName');
}
    private handleError(error: any) {
        console.error("API Error:", error);
        return throwError(() => new Error("Error during API request."));
    }
}