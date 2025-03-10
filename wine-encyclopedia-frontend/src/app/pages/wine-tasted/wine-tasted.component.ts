import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

import { WineTastingSheet } from '../../_models/wine-tasting-sheet.model';

import { CookiesService } from '../../_services/cookies.service'
import { WineTastedService } from 'src/app/_services/wineTasted.service';
import { WineryService } from 'src/app/_services/winery.service';
import { WineService } from 'src/app/_services/wine.service';

@Component({
	selector: 'wine-tasted',
	templateUrl: './wine-tasted.component.html',
	styleUrls: ['./wine-tasted.component.css']
})
export class WineTastedComponent implements OnInit {
	wineTastingSheet: WineTastingSheet = new WineTastingSheet();
	wines: any = [];
	wineryList: any = [];
	filterText: string = "";
	filterColor: string = "";
	filterWinerySelect: string = "";
	userUid: string  = "";

	constructor(private wineTastedService: WineTastedService,
		private wineService: WineService,
		private wineryService: WineryService,
		private router: Router,
		private cookiesService: CookiesService) {
			this.userUid = JSON.parse(this.cookiesService.getCookieUser()).uid;
		 }



	ngOnInit() {
		this.getAllWinesTasted();
		//this.getWineryList();
	}

	refresh() {
		this.getAllWinesTasted();
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
		this.wineryList = [...new Set(jsonArray.map(item => item.winery))].sort();
	}

	getAllWinesTasted() {
		this.wineTastedService.getWinesTasted(this.userUid).subscribe((wines => {
			if (wines == null)
				this.wines = [];
			else
				this.wines = wines;
			this.extractWineries(this.wines);
		}));
	}

	getWineryList() {
		this.wineryService.getWineriesList().subscribe((wineryList => {
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

		this.router.navigate(['/wine-tasted-details'], { state: { wineData: wine } });
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

	viewWineDetails(wine: any) {
		this.router.navigate(['/wine'], { state: { wineData: wine } });
	}
}