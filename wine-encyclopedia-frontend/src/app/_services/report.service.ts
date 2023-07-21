import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class ReportService {
    constructor(private http: HttpClient) { }

    createCustomReport(headers: any, dataInput: any) {
  		const httpOptionsPlain = {
			headers: new HttpHeaders({
				'Accept': 'text/plain',
				'Content-Type': 'text/plain'
			}),
			'responseType': 'text/plain'
		};
		let uri = 'api/report-service/createCustomReport';
		console.log("Invio richiesta createCustomReport...");
		let data = {headers: headers, data: dataInput};
		this.http.post(uri, data, { responseType: "text" })
			.subscribe(
				result => {
					console.log("Success: ", result);
					window.open(result);
				},
				error => console.log("Error: ", error)
			)      
    }
}