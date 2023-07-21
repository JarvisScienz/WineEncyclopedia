import { Router, NavigationExtras } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RoutingService {
	
	constructor(
		private router: Router) {}
	
	goToPage(params, page) {
		let navigationExtras: NavigationExtras = {
			queryParams: params,
			fragment: 'anchor',
			skipLocationChange: true
		};

		this.router.navigate([page], navigationExtras);
	}	
	
	goToDashboard(endPointId){
		let params = { 'endPointID': endPointId };
		let page = "/dashboard";
		this.goToPage(params, page);
	}
}
	

