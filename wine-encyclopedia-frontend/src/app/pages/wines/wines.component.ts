import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

import { WineTastingSheet } from '../../_models/wine-tasting-sheet.model';

import { CookiesService } from '../../_services/cookies.service'
import { WineService } from 'src/app/_services/wine.service';
import { WineryService } from 'src/app/_services/winery.service';
import { Grapes } from 'src/app/_models/wine';

@Component({
	selector: 'wines',
	templateUrl: './wines.component.html',
	styleUrls: ['./wines.component.css']
})
export class WinesComponent implements OnInit, AfterViewInit, OnDestroy {
	wineTastingSheet: WineTastingSheet = new WineTastingSheet();
	wines: any = [];
	wineryList: any = [];
	filterText: string = "";
	filterColor: string = "";
	filterWinerySelect: string = "";
	userUid: string  = "";

	readonly pageSize = 20;
	isLoadingMore = false;
	hasMore = true;
	private lastDocId: string | null = null;
	private observer!: IntersectionObserver;

	@ViewChild('scrollAnchor') scrollAnchor!: ElementRef;

	constructor(private wineryService: WineryService,
		private wineService: WineService,
		private router: Router,
		private cookiesService: CookiesService) {
			this.userUid = JSON.parse(this.cookiesService.getCookieUser()).uid;
		 }

	ngOnInit() {
		this.getAllWines();
	}

	ngAfterViewInit() {
		this.observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !this.isLoadingMore && this.hasMore) {
					this.loadMore();
				}
			},
			{ threshold: 0.1 }
		);
		this.observer.observe(this.scrollAnchor.nativeElement);
	}

	ngOnDestroy() {
		this.observer?.disconnect();
	}

	refresh() {
		this.wines = [];
		this.lastDocId = null;
		this.hasMore = true;
		this.filterText = "";
		this.filterColor = "";
		this.filterWinerySelect = "";
		this.getAllWines();
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
		const newWineries = [...new Set(jsonArray.map(item => item.wineryName))];
		const merged = [...new Set([...this.wineryList, ...newWineries])].sort();
		this.wineryList = merged;
	}

	getAllWines() {
		this.isLoadingMore = true;
		this.wineService.getWines(this.pageSize, null).subscribe((wines => {
			this.wines = wines ?? [];
			this.hasMore = wines.length === this.pageSize;
			this.lastDocId = wines.length ? String(wines[wines.length - 1].id) : null;
			this.extractWineries(this.wines);
			this.isLoadingMore = false;
		}));
	}

	loadMore() {
		if (this.isLoadingMore || !this.hasMore) return;
		this.isLoadingMore = true;
		this.wineService.getWines(this.pageSize, this.lastDocId).subscribe((wines => {
			this.wines = [...this.wines, ...wines];
			this.hasMore = wines.length === this.pageSize;
			this.lastDocId = wines.length ? String(wines[wines.length - 1].id) : this.lastDocId;
			this.extractWineries(wines);
			this.isLoadingMore = false;
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

	viewWineDetails(wine: any) {
		this.router.navigate(['/wine'], { state: { wineData: wine } });
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

	extractGrapes(grapes: any){
		var grapesList = "";
		for (const grape of grapes){
			grapesList += grape.nameGrape + "\n";
		}
		return grapesList;
	}

}