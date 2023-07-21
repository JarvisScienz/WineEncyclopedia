import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";

@Injectable({
	providedIn: 'root'
})
export class ConfigService {
	private isClientVersion: any;
	constructor(private http: HttpClient, private spinner: NgxSpinnerService) { }
	
	initializeApp(){
		this.checkIsClientVersion();
	}
	
	async checkIsClientVersion(): Promise<any>{
		let headers = new HttpHeaders({
			'Authorization': ''
		});
		let options = { headers: headers};
		let uri = 'api/manager-service/getPropertyClientVersion';
		return await this.http.post(uri, options)
			.toPromise()
			.then(data => {
				this.isClientVersion = data;
				console.log("Is client version: " + JSON.stringify(this.isClientVersion));
			},
		error => {
			console.log("Error: " + error);
		});
	}
	
	get getCheckIsClientVersion(): any {		
		return this.isClientVersion;
	}
}