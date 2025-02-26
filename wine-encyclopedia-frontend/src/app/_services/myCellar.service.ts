import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyCellarService {
  private rootURL = environment.apiUrl;

  constructor(private http: HttpClient) {}
  getMyCellarWines(uid: string) {
    return this.http.post<any>(this.rootURL + '/myCellarWines', { uid })
    .pipe(map(wines => {
        console.log("Wines:", wines);
        if (wines == null)
            return [];
        else
            return wines;
    }),
    catchError(this.handleError));
}
private handleError(error: any) {
    console.error("API Error:", error);
    return throwError(() => new Error("Error during API request."));
  }
}