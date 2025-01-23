import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class AppService {
	private rootURL = environment.apiUrl;
	constructor(private http: HttpClient) { }

	getWines(uid: string) {
		return this.http.post(this.rootURL + '/wines', { uid });
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
