import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute  } from '@angular/router';

import { WineTastingSheet } from '../../_models/wine-tasting-sheet.model';

import { CookiesService } from '../../_services/cookies.service'
import { Wine } from 'src/app/_models/wine';
import { WineryService } from 'src/app/_services/winery.service';
import { WineService } from 'src/app/_services/wine.service';
import { LoadingService } from 'src/app/_services/loading-spinner.service';

@Component({
	selector: 'wine',
	templateUrl: './wine.component.html',
	styleUrls: ['./wine.component.css']
})
export class WineComponent implements OnInit {
	wineDetails!: Wine;
	wineTastingSheet: WineTastingSheet = new WineTastingSheet();
	wines: any = [];
	winesByWinery: any = [];
	similarWines: any = [];
	wineryList: any = [];
	filterText: string = "";
	filterColor: string = "";
	filterWinerySelect: string = "";
	userUid: string  = "";
	 isLoading = false;

	constructor(private wineryService: WineryService,
		private wineService: WineService,
		private router: Router,
		private route: ActivatedRoute,
		private cookiesService: CookiesService,
		private loadingService: LoadingService) {
			this.userUid = JSON.parse(this.cookiesService.getCookieUser()).uid;
		 }



	ngOnInit() {
		this.isLoading = true;
		this.wineDetails = history.state.wineData;
		
    	if (this.wineDetails) {
			this.wineService.getWinesByWinery(this.wineDetails.wineryName).subscribe(wines => {
				this.winesByWinery = wines;
				this.isLoading = false;
			});

			// Carica vini simili
			this.wineService.getSimilarWines(this.wineDetails).subscribe(wines => {
				this.similarWines = wines;
				this.isLoading = false;
			});
		}
	}

	refresh() {
		this.getAllWines();
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

	getAllWines() {
		this.wineService.getWines().subscribe((wines => {
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

		this.router.navigate(['/tasting-sheet'], navigationExtras);
	}

	getWineIcon(wine: WineTastingSheet) {
		var wineColor = wine.color || "";
		var pathImage = "";
		switch (wineColor) {
			case "Rosso":
				pathImage = "../../assets/images/red-wine.png";
				break;
			case "Bianco":
				pathImage = "../../assets/images/yellow-wine.png";
				break;
			case "Rosato":
				pathImage = "../../assets/images/rose-wine.png";
				break;
		}
		return pathImage;
	}


	getImageWine(wine: Wine) {
		var url = wine.img;
		if (url != null && url != ""){
			return url;
		}else{
			if (wine.color == "Bianco"){
				return "../../assets/images/generic-white-bottle.png";
			}else {
				return "../../assets/images/generic-red-bottle.png";
			}
		}
	}

}