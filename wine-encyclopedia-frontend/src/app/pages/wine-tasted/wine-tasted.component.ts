import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

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
export class WineTastedComponent implements OnInit, AfterViewInit, OnDestroy {
	wineTastingSheet: WineTastingSheet = new WineTastingSheet();
	wines: any = [];
	wineryList: any = [];
	filterText: string = "";
	filterColor: string = "";
	filterWinerySelect: string = "";
	userUid: string = "";

	readonly pageSize = 20;
	isLoadingMore = false;
	hasMore = true;
	private lastDocId: string | null = null;
	private observer!: IntersectionObserver;

	@ViewChild('scrollAnchor') scrollAnchor!: ElementRef;

	constructor(private wineTastedService: WineTastedService,
		private wineService: WineService,
		private wineryService: WineryService,
		private router: Router,
		private cookiesService: CookiesService) {
			this.userUid = JSON.parse(this.cookiesService.getCookieUser()).uid;
		 }

	ngOnInit() {
		this.getAllWinesTasted();
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
		this.getAllWinesTasted();
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
		const newWineries = [...new Set(jsonArray.map(item => item.winery))];
		const merged = [...new Set([...this.wineryList, ...newWineries])].sort();
		this.wineryList = merged;
	}

	getAllWinesTasted() {
		this.isLoadingMore = true;
		this.wineTastedService.getWinesTasted(this.userUid, this.pageSize, null).subscribe((wines => {
			this.wines = wines;
			this.hasMore = wines.length === this.pageSize;
			this.lastDocId = wines.length ? wines[wines.length - 1].id : null;
			this.extractWineries(wines);
			this.isLoadingMore = false;
		}));
	}

	loadMore() {
		if (this.isLoadingMore || !this.hasMore) return;
		this.isLoadingMore = true;
		this.wineTastedService.getWinesTasted(this.userUid, this.pageSize, this.lastDocId).subscribe((wines => {
			this.wines = [...this.wines, ...wines];
			this.hasMore = wines.length === this.pageSize;
			this.lastDocId = wines.length ? wines[wines.length - 1].id : this.lastDocId;
			this.extractWineries(wines);
			this.isLoadingMore = false;
		}));
	}

	updateTastedWine(wine: WineTastingSheet) {
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
