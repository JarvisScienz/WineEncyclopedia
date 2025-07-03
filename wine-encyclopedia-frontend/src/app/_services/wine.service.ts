import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Wine } from '../_models/wine';

@Injectable({
  providedIn: 'root'
})
export class WineService {
  private rootURL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getWines(): Observable<Wine[]> {
    return this.http.post<Wine[]>(`${this.rootURL}/wines`, {}).pipe(
      map(wines => wines ?? []),
      catchError(this.handleError)
    );
  }

  getWinesByColor(color: string): Observable<Wine[]> {
    return this.http.post<Wine[]>(`${this.rootURL}/winesByColor`, { color });
  }

  getWinesById(id: string): Observable<Wine> {
    return this.http.post<Wine>(`${this.rootURL}/winesById`, { id });
  }

  getWinesByWinery(winery: string): Observable<Wine[]> {
    return this.http.post<Wine[]>(`${this.rootURL}/winesByWinery`, { winery });
  }

  getSimilarWines(wine: Wine): Observable<Wine[]> {
    return this.http.post<Wine[]>(`${this.rootURL}/getSimilarWines`, { wine });
  }

  addWine(wine: Wine): Observable<any> {
    return this.http.post(`${this.rootURL}/wine`, { wine });
  }

  private handleError(error: any) {
    console.error("API Error:", error);
    return throwError(() => new Error("Error during API request."));
  }
}
