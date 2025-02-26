import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WineTastedService {
  private rootURL = environment.apiUrl;

  constructor(private http: HttpClient) {}
  getWinesTasted(uid: string) {
        return this.http.post<any>(this.rootURL + '/winesTasted', { uid })
        .pipe(map(wines => {
            console.log("Wines:", wines);
            if (wines == null)
                return [];
            else
                return wines;
        }),
        catchError(this.handleError));
    }
    
    addWineTasted(wine: any) {
		wine.createdAt = new Date();
		return this.http.post(this.rootURL + '/addWineTasted', { wine });
	}

    editWineTasted(wine: any): Observable<any> {
        return this.http.post(`${this.rootURL}/editWine`, { wine }).pipe(
            tap(() => console.log(`[SUCCESS] Wine updated successfully: ${wine}`)),
            catchError(this.handleError)
        );
      }
	getWineTastedInYears(uid: string) {	
		return this.http.post<any>(this.rootURL + '/wineTastedInYears', { uid })
		.pipe(
			map(count => count), // Mappiamo il valore
			catchError(error => { // Gestione errori
				console.error("Error on getWines:", error);
				return throwError(() => new Error("Error on getWines."));
			})
		);
	}

    private handleError(error: any) {
        console.error("API Error:", error);
        return throwError(() => new Error("Error during API request."));
    }
    }