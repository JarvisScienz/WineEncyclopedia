import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WineryService {
  private rootURL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getWineriesList(): Observable<any[]> {
    return this.http.post<any[]>(`${this.rootURL}/wineriesList`, {}).pipe(
      map(wineries => wineries ?? []),
      catchError(this.handleError)
    );
  }

  getWineries(): Observable<any[]> {
    return this.http.post<any[]>(`${this.rootURL}/wineries`, {}).pipe(
      map(wineries => wineries ?? []),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error("API Error:", error);
    return throwError(() => new Error("Error during API request."));
  }
}
