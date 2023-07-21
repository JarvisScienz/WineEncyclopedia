import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class DateService {
    constructor(private datePipe: DatePipe) { }

    parseArrayDate(arrayData){		
		for (var i=0; i < arrayData.length; i++){
			arrayData[i] = arrayData[i].replace(/(\d{4})(\d{2})(\d{2})/g, '$3-$2-$1'); //this.datePipe.transform(arrayData[i], 'dd-MM-yyyy');
		}
		return arrayData;
	}
	
	parseDate(date: string){
		if (date !== undefined){
			date = date.replace(/(\d{4})(\d{2})(\d{2})/g, '$3-$2-$1');
		}	 
		return date;
	}
	
	parseDateMMYYYY(date){
		date = date.replace(/(\d{4})(\d{2})/g, '$2-$1'); 
		return date;
	}
	
	parseArrayDateMMYYYY(arrayData){
		for (var i=0; i < arrayData.length; i++){
			arrayData[i] = arrayData[i].replace(/(\d{4})(\d{2})/g, '$2-$1'); //this.datePipe.transform(arrayData[i], 'dd-MM-yyyy');
		}
		return arrayData;		
	}
	
	parseDateWithFormat(date, format){
		return this.datePipe.transform(date, format);
	}
	
	currentDateTimeFormatted(format){
		return this.datePipe.transform(new Date(), format);
	}
	
	/*
	addDaysToDateFormatted("+30", "yyyy-MM-dd")
	addDaysToDateFormatted("-30", "yyyy-MM-dd")
	*/
	addDaysToDateFormatted(numberDays:any, format: any){
		var date = new Date();
		date.setDate(date.getDate() + numberDays);
		return this.datePipe.transform(date, format);
	}
	
	subtractDaysToDateFormatted(numberDays:any, format: any){
		var date = new Date();
		date.setDate(date.getDate() - numberDays);
		return this.datePipe.transform(date, format);
	}
}