import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Wine } from './_models/wine';

@Injectable({
	providedIn: 'root'
})
export class AppService {
	private rootURL = environment.apiUrl;
	constructor(private http: HttpClient) { }


	getWines() {
		return this.http.post<Wine[]>(this.rootURL + '/wines', {})
		.pipe(map(wines => {
			console.log("Wines:", wines);
			if (wines == null)
				return [];
			else
				return wines;
		}),
		catchError(error => {
			console.error("Error on getWines:", error);
			return throwError(() => new Error("Error on getWines."));
		}));
	}

	getWinesTasted(uid: string) {
		return this.http.post<any>(this.rootURL + '/winesTasted', { uid })
		.pipe(map(wines => {
			console.log("Wines:", wines);
			if (wines == null)
				return [];
			else
				return wines;
		}),
		catchError(error => {
			console.error("Error on getWines:", error);
			return throwError(() => new Error("Error on getWines."));
		}));
	}

	getMyCellarWines(uid: string) {
		return this.http.post<any>(this.rootURL + '/myCellarWines', { uid })
		.pipe(map(wines => {
			console.log("Wines:", wines);
			if (wines == null)
				return [];
			else
				return wines;
		}),
		catchError(error => {
			console.error("Error on getWines:", error);
			return throwError(() => new Error("Error on getWines."));
		}));
	}
	
	getGrapesName() {
		return this.http.get(this.rootURL + '/grapesName');
	}

	getWinesByColor(color: string) {
		return this.http.post(this.rootURL + '/winesByColor', { color });
	}
	
	getWinesByWinery(winery: string) {
		console.log(`[INFO] Fetching wines for winery: ${winery}`);
		return this.http.post(this.rootURL + '/winesByWinery', { winery });
	}

	addWineTasted(wine: any) {
		wine.createdAt = new Date();
		return this.http.post(this.rootURL + '/addWineTasted', { wine });
	}
	
	editWine(wine: any): Observable<any> {
		
		return this.http.post(`${this.rootURL}/editWine`, { wine }).pipe(
			tap(() => console.log(`[SUCCESS] Wine updated successfully: ${wine}`)),
			catchError(error => {
				console.error("[ERROR] Failed to update wine information. Error:", error);
				return throwError(() => new Error("Error on update wine."));
			})
		);
	}
	
	getWineriesList() {
		return this.http.post<any>(this.rootURL + '/wineriesList', {})
		.pipe(map(wineries => {
			console.log("Wineries:", wineries);
			if (wineries == null)
				return [];
			else
				return wineries;
		}),
		catchError(error => {
			console.error("Error on getWineries:", error);
			return throwError(() => new Error("Error on getWines."));
		}));
	}

	getWineries() {
		return this.http.post<any>(this.rootURL + '/wineries', {})
		.pipe(map(wineries => {
			console.log("Wineries:", wineries);
			if (wineries == null)
				return [];
			else
				return wineries;
		}),
		catchError(error => {
			console.error("Error on getWineries:", error);
			return throwError(() => new Error("Error on getWines."));
		}));
	}

	addWine(wine: any) {
		return this.http.post(this.rootURL + '/wine', { wine });
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

}
