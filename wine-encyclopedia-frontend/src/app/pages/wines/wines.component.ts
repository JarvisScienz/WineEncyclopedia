import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

import { WineTastingSheet } from '../../_models/wine-tasting-sheet.model';
import { CookiesService } from '../../_services/cookies.service';
import { WineService } from 'src/app/_services/wine.service';
import { WineryService } from 'src/app/_services/winery.service';

@Component({
	selector: 'wines',
	templateUrl: './wines.component.html',
	styleUrls: ['./wines.component.css']
})
export class WinesComponent implements OnInit, AfterViewInit, OnDestroy {
	wineTastingSheet: WineTastingSheet = new WineTastingSheet();

	/** Paginated list shown while browsing (no active filters). */
	wines: any[] = [];

	/** Complete dataset fetched in background — used when any filter/search is active. */
	allWines: any[] = [];
	allWinesLoaded = false;
	isPreloading = false;

	/** Filter-dropdown option lists, populated from allWines as batches arrive. */
	wineryList: string[] = [];
	denominationList: string[] = [];
	varietalList: string[] = [];

	filterText: string = "";
	filterColor: string = "";
	filterWinerySelect: string = "";
	filterDenomination: string = "";
	filterVarietal: string = "";

	userUid: string = "";
	showFilters = false;

	readonly pageSize = 20;
	isLoadingMore = false;
	hasMore = true;
	private lastDocId: string | null = null;
	private observer!: IntersectionObserver;

	@ViewChild('scrollAnchor') scrollAnchor!: ElementRef;

	constructor(
		private wineryService: WineryService,
		private wineService: WineService,
		private router: Router,
		private cookiesService: CookiesService
	) {
		this.userUid = JSON.parse(this.cookiesService.getCookieUser()).uid;
	}

	ngOnInit() {
		this.getAllWines();
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

	/** True when any search text or filter is active. */
	get isFilterModeActive(): boolean {
		return !!(this.filterText.trim() || this.filterColor ||
			this.filterWinerySelect || this.filterDenomination || this.filterVarietal);
	}

	/**
	 * Returns the wines to display after applying all active filters.
	 * Uses allWines (full dataset) when a filter/search is active so results
	 * are never limited by what infinite scroll has loaded so far.
	 */
	get displayedWines(): any[] {
		let result: any[] = this.isFilterModeActive ? this.allWines : this.wines;

		if (this.filterColor) {
			result = result.filter((w: any) => w.color === this.filterColor);
		}
		if (this.filterWinerySelect) {
			result = result.filter((w: any) => w.wineryName === this.filterWinerySelect);
		}
		if (this.filterDenomination) {
			result = result.filter((w: any) => w.denomination === this.filterDenomination);
		}
		if (this.filterVarietal) {
			result = result.filter((w: any) =>
				w.grapes && w.grapes.some((g: any) => g.nameGrape === this.filterVarietal)
			);
		}
		if (this.filterText.trim()) {
			const q = this.filterText.trim().toLowerCase();
			result = result.filter((w: any) =>
				(w.name && w.name.toLowerCase().includes(q)) ||
				(w.wineryName && w.wineryName.toLowerCase().includes(q)) ||
				(w.denomination && w.denomination.toLowerCase().includes(q))
			);
		}

		return result;
	}

	get activeFiltersCount(): number {
		let count = 0;
		if (this.filterColor) count++;
		if (this.filterWinerySelect) count++;
		if (this.filterDenomination) count++;
		if (this.filterVarietal) count++;
		return count;
	}

	toggleFilters() {
		this.showFilters = !this.showFilters;
	}

	/**
	 * Fetches all wines in the background using recursive cursor-based pagination.
	 * Populates allWines and the filter option lists incrementally as batches arrive.
	 */
	preloadAllWines() {
		if (this.allWinesLoaded || this.isPreloading) return;
		this.isPreloading = true;
		const batchSize = 100;

		const fetchBatch = (lastId: string | null) => {
			this.wineService.getWines(batchSize, lastId).subscribe({
				next: batch => {
					this.allWines = [...this.allWines, ...(batch ?? [])];
					this.extractFilterOptions(batch ?? []);
					if ((batch ?? []).length === batchSize) {
						fetchBatch(String(batch[batch.length - 1].id));
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

	refresh() {
		this.wines = [];
		this.allWines = [];
		this.wineryList = [];
		this.denominationList = [];
		this.varietalList = [];
		this.lastDocId = null;
		this.hasMore = true;
		this.filterText = "";
		this.filterColor = "";
		this.filterWinerySelect = "";
		this.filterDenomination = "";
		this.filterVarietal = "";
		this.allWinesLoaded = false;
		this.isPreloading = false;
		this.showFilters = false;
		this.getAllWines();
		this.preloadAllWines();
	}

	/** Accumulates unique winery, denomination, and varietal values from a wine batch. */
	extractFilterOptions(batch: any[]) {
		const merge = (existing: string[], incoming: string[]) =>
			[...new Set([...existing, ...incoming.filter(Boolean)])].sort() as string[];

		this.wineryList = merge(this.wineryList, batch.map(w => w.wineryName));
		this.denominationList = merge(this.denominationList, batch.map(w => w.denomination));

		const grapeNames: string[] = [];
		batch.forEach(w => w.grapes?.forEach((g: any) => { if (g.nameGrape) grapeNames.push(g.nameGrape); }));
		this.varietalList = merge(this.varietalList, grapeNames);
	}

	getAllWines() {
		this.isLoadingMore = true;
		this.wineService.getWines(this.pageSize, null).subscribe(wines => {
			this.wines = wines ?? [];
			this.hasMore = wines.length === this.pageSize;
			this.lastDocId = wines.length ? String(wines[wines.length - 1].id) : null;
			this.isLoadingMore = false;
		});
	}

	loadMore() {
		if (this.isLoadingMore || !this.hasMore || this.isFilterModeActive) return;
		this.isLoadingMore = true;
		this.wineService.getWines(this.pageSize, this.lastDocId).subscribe(wines => {
			this.wines = [...this.wines, ...(wines ?? [])];
			this.hasMore = wines.length === this.pageSize;
			this.lastDocId = wines.length ? String(wines[wines.length - 1].id) : this.lastDocId;
			this.isLoadingMore = false;
		});
	}

	updateTastedWine(wine: WineTastingSheet) {
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
		const wineColor = wine.color || "";
		switch (wineColor) {
			case "Rosso": return "../../assets/images/red-wine.png";
			case "Bianco": return "../../assets/images/yellow-wine.png";
			case "Rosato": return "../../assets/images/rose-wine.png";
			default: return "";
		}
	}

	extractGrapes(grapes: any) {
		let grapesList = "";
		for (const grape of grapes) {
			grapesList += grape.nameGrape + "\n";
		}
		return grapesList;
	}
}
