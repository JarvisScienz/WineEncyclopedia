import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

import { AppService } from '../../app.service';
import { WineTastingSheet } from '../../_models/wine-tasting-sheet.model';

import { CookiesService } from '../../_services/cookies.service'
import { Wine } from 'src/app/_models/wine';
import { Winery } from 'src/app/_models/winery';

@Component({
	selector: 'winery',
	templateUrl: './winery.component.html',
	styleUrls: ['./winery.component.css']
})
export class WineryComponent implements OnInit {
	wineTastingSheet: WineTastingSheet = new WineTastingSheet();
	wines: Wine[] = [];
	wineries: Winery[] = [];
	wineryList: any = [];
	filterText: string = "";
	filterColor: string = "";
	filterWinerySelect: string = "";
	userUid: string  = "";

	constructor(private appService: AppService,
		private router: Router,
		private cookiesService: CookiesService) {
			this.userUid = JSON.parse(this.cookiesService.getCookieUser()).uid;
		 }



	ngOnInit() {
		this.getAllWineries();
		//this.getWineryList();
	}

	refresh() {
		this.getAllWineries();
		this.filterText = "";
		this.filterColor = "";
		this.filterWinerySelect = "";
	}



	filterWinery() {
		
	}

	extractWineries(jsonArray: any[]) {
		this.wineryList = [...new Set(jsonArray.map(item => item.winery))].sort();
	}

	getAllWineries() {
		this.appService.getWineries().subscribe((wineries => {
			if (wineries == null)
				this.wines = [];
			else
				this.wineries = wineries;
			this.extractWineries(this.wines);
		}));
	}

	getWineryList() {
		this.appService.getWineryList().subscribe((wineryList => {
			if (wineryList == null)
				this.wineryList = [];
			else
				this.wineryList = wineryList;
		}));
	}

	updateTastedWine(wine: WineTastingSheet) {
		console.log(wine);
		let navigationExtras: NavigationExtras = {
			queryParams: wine,
			fragment: 'anchor',
			skipLocationChange: true
		};

		this.router.navigate(['/tasting-sheet'], navigationExtras);
	}

	getWineIcon(wine: WineTastingSheet) {
		var wineColor = wine.color?.split("_")[0] || "";
		var pathImage = "";
		switch (wineColor) {
			case "red":
				pathImage = "../../assets/images/red-wine.png";
				break;
			case "yellow":
				pathImage = "../../assets/images/yellow-wine.png";
				break;
			case "rose":
				pathImage = "../../assets/images/rose-wine.png";
				break;
		}
		return pathImage;

	}

}