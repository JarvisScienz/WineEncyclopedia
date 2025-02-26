import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private rootURL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUserInformation(uid: string): Observable<any> {
    return this.http.post<any>(`${this.rootURL}/v1/userInformation`, { uid }).pipe(
      map(user => user),
      catchError(this.handleError)
    );
  }

  saveReviewService(uid: string, wineryID: string, review: string): Observable<any> {
    return this.http.post<any>(`${this.rootURL}/v1/saveReview`, { uid:uid, wineryID:wineryID, review:review });
  }

  private handleError(error: any) {
    console.error("API Error:", error);
    return throwError(() => new Error("Error during API request."));
  }
}
