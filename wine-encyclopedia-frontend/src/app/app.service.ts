import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class AppService {
	private rootURL = environment.apiUrl;
	constructor(private http: HttpClient) { }

	getWines(uid: string) {
		return this.http.post<any>(this.rootURL + '/wines', { uid })
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
		return this.http.post(this.rootURL + '/winesByWinery', { winery });
	}

	addWine(wine: any) {
		return this.http.post(this.rootURL + '/wine', { wine });
	}
	
	editWine(wine: any) {
		return this.http.post(this.rootURL + '/editWine', { wine });
	}
	
	getWineryList() {
		return this.http.get(this.rootURL + '/wineryList');
	}

}
