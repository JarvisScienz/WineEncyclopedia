import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

import { MyCellarService } from '../../_services/myCellar.service';
import { WineTastingSheet } from '../../_models/wine-tasting-sheet.model';

import { CookiesService } from '../../_services/cookies.service'
import { WineService } from 'src/app/_services/wine.service';

@Component({
	selector: 'my-cellar',
	templateUrl: './my-cellar.component.html',
	styleUrls: ['./my-cellar.component.css']
})
export class MyCellarComponent implements OnInit {
	wineTastingSheet: WineTastingSheet = new WineTastingSheet();
	wines: any = [];
	wineryList: any = [];
	filterText: string = "";
	filterColor: string = "";
	filterWinerySelect: string = "";
	userUid: string  = "";

	constructor(private myCellarService: MyCellarService,
		private wineService: WineService,
		private router: Router,
		private cookiesService: CookiesService) {
			this.userUid = JSON.parse(this.cookiesService.getCookieUser()).uid;
		 }



	ngOnInit() {
		this.getMyCellarWines();
		//this.getWineryList();
	}

	refresh() {
		this.getMyCellarWines();
		this.filterText = "";
		this.filterColor = "";
		this.filterWinerySelect = "";
	}

	filterColorWine() {
		this.wineService.getWinesByColor(this.filterColor).subscribe((wines => {
			if (wines == null)
				this.wines = [];
			else
				this.wines = wines;
		}));
	}

	filterWinery() {
		this.wineService.getWinesByWinery(this.filterWinerySelect).subscribe((wines => {
			if (wines == null)
				this.wines = [];
			else
				this.wines = wines;
		}));
	}

	extractWineries(jsonArray: any[]) {
		this.wineryList = jsonArray.map(item => item.winery);
	}

	getMyCellarWines() {
		this.myCellarService.getMyCellarWines(this.userUid).subscribe((wines => {
			if (wines == null)
				this.wines = [];
			else
				this.wines = wines;
			this.extractWineries(this.wines);
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

	viewWineDetails(wine: any) {
		this.router.navigate(['/wine'], { state: { wineData: wine } });
	}

	getWineIcon(wine: WineTastingSheet) {
		var wineColor = wine.color.split("_")[0] || "";
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