import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { WineTastingSheet } from '../../_models/wine-tasting-sheet.model';
import { CookiesService } from '../../_services/cookies.service';
import { WineTastedService } from 'src/app/_services/wineTasted.service';
import { WineService } from 'src/app/_services/wine.service';

@Component({
	selector: 'wine-tasted',
	templateUrl: './wine-tasted.component.html',
	styleUrls: ['./wine-tasted.component.css']
})
export class WineTastedComponent implements OnInit, AfterViewInit, OnDestroy {
	wineTastingSheet: WineTastingSheet = new WineTastingSheet();

	/** Paginated list for the default browse view. */
	wines: any[] = [];

	/** Full dataset fetched in background — used when any filter/search is active. */
	allWines: any[] = [];
	allWinesLoaded = false;
	isPreloading = false;

	/** Filter-dropdown option lists populated as batches arrive. */
	wineryList: string[] = [];
	varietalList: string[] = [];
	vintageList: string[] = [];

	filterText: string = "";
	filterColor: string = "";
	filterWinery: string = "";
	filterVarietal: string = "";
	filterVintage: string = "";

	userUid: string = "";
	showFilters = false;

	readonly pageSize = 20;
	isLoadingMore = false;
	hasMore = true;
	private lastDocId: string | null = null;
	private observer!: IntersectionObserver;

	@ViewChild('scrollAnchor') scrollAnchor!: ElementRef;

	constructor(
		private wineTastedService: WineTastedService,
		private wineService: WineService,
		private router: Router,
		private cookiesService: CookiesService
	) {
		this.userUid = JSON.parse(this.cookiesService.getCookieUser()).uid;
	}

	ngOnInit() {
		this.getAllWinesTasted();
		this.preloadAllWines();
	}

	ngAfterViewInit() {
		this.observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !this.isLoadingMore && this.hasMore && !this.isFilterModeActive) {
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

	get isFilterModeActive(): boolean {
		return !!(this.filterText.trim() || this.filterColor ||
			this.filterWinery || this.filterVarietal || this.filterVintage);
	}

	get displayedWines(): any[] {
		let result: any[] = this.isFilterModeActive ? this.allWines : this.wines;

		if (this.filterColor) {
			result = result.filter((w: any) => w.color?.split('_')[0] === this.filterColor);
		}
		if (this.filterWinery) {
			result = result.filter((w: any) => w.winery === this.filterWinery);
		}
		if (this.filterVarietal) {
			result = result.filter((w: any) => w.grapeVariety === this.filterVarietal);
		}
		if (this.filterVintage) {
			result = result.filter((w: any) => String(w.vintage) === this.filterVintage);
		}
		if (this.filterText.trim()) {
			const q = this.filterText.trim().toLowerCase();
			result = result.filter((w: any) =>
				(w.name && w.name.toLowerCase().includes(q)) ||
				(w.winery && w.winery.toLowerCase().includes(q)) ||
				(w.grapeVariety && w.grapeVariety.toLowerCase().includes(q))
			);
		}

		return result;
	}

	get activeFiltersCount(): number {
		let count = 0;
		if (this.filterColor) count++;
		if (this.filterWinery) count++;
		if (this.filterVarietal) count++;
		if (this.filterVintage) count++;
		return count;
	}

	toggleFilters() {
		this.showFilters = !this.showFilters;
	}

	preloadAllWines() {
		if (this.allWinesLoaded || this.isPreloading) return;
		this.isPreloading = true;
		const batchSize = 100;

		const fetchBatch = (lastId: string | null) => {
			this.wineTastedService.getWinesTasted(this.userUid, batchSize, lastId).subscribe({
				next: batch => {
					this.allWines = [...this.allWines, ...(batch ?? [])];
					this.extractFilterOptions(batch ?? []);
					if ((batch ?? []).length === batchSize) {
						fetchBatch(batch[batch.length - 1].id);
					} else {
						this.allWinesLoaded = true;
						this.isPreloading = false;
					}
				},
				error: () => { this.isPreloading = false; }
			});
		};

		fetchBatch(null);
	}

	extractFilterOptions(batch: any[]) {
		const merge = (existing: string[], incoming: string[]) =>
			[...new Set([...existing, ...incoming.filter(Boolean)])].sort() as string[];

		this.wineryList = merge(this.wineryList, batch.map(w => w.winery));
		this.varietalList = merge(this.varietalList, batch.map(w => w.grapeVariety));

		const vintages = batch.map(w => w.vintage ? String(w.vintage) : null).filter(Boolean) as string[];
		// Sort vintages descending (newest first)
		this.vintageList = [...new Set([...this.vintageList, ...vintages])].sort((a, b) => Number(b) - Number(a));
	}

	refresh() {
		this.wines = [];
		this.allWines = [];
		this.wineryList = [];
		this.varietalList = [];
		this.vintageList = [];
		this.lastDocId = null;
		this.hasMore = true;
		this.filterText = "";
		this.filterColor = "";
		this.filterWinery = "";
		this.filterVarietal = "";
		this.filterVintage = "";
		this.allWinesLoaded = false;
		this.isPreloading = false;
		this.showFilters = false;
		this.getAllWinesTasted();
		this.preloadAllWines();
	}

	getAllWinesTasted() {
		this.isLoadingMore = true;
		this.wineTastedService.getWinesTasted(this.userUid, this.pageSize, null).subscribe(wines => {
			this.wines = wines ?? [];
			this.hasMore = wines.length === this.pageSize;
			this.lastDocId = wines.length ? wines[wines.length - 1].id : null;
			this.isLoadingMore = false;
		});
	}

	loadMore() {
		if (this.isLoadingMore || !this.hasMore || this.isFilterModeActive) return;
		this.isLoadingMore = true;
		this.wineTastedService.getWinesTasted(this.userUid, this.pageSize, this.lastDocId).subscribe(wines => {
			this.wines = [...this.wines, ...(wines ?? [])];
			this.hasMore = wines.length === this.pageSize;
			this.lastDocId = wines.length ? wines[wines.length - 1].id : this.lastDocId;
			this.isLoadingMore = false;
		});
	}

	updateTastedWine(wine: WineTastingSheet) {
		this.router.navigate(['/wine-tasted-details'], { state: { wineData: wine } });
	}

	viewWineDetails(wine: any) {
		if (!wine.wineId) return;
		this.wineService.getWinesById(wine.wineId).subscribe({
			next: wineData => this.router.navigate(['/wine'], { state: { wineData } }),
			error: () => this.router.navigate(['/wine'], { state: { wineData: wine } })
		});
	}

	getWineIcon(wine: WineTastingSheet) {
		const wineColor = wine.color?.split('_')[0] || '';
		switch (wineColor) {
			case 'red': return '../../assets/images/red-wine.png';
			case 'yellow': return '../../assets/images/yellow-wine.png';
			case 'rose': return '../../assets/images/rose-wine.png';
			default: return '';
		}
	}
}
