import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { takeUntil, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Subject, OperatorFunction, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

import { AppService } from '../../app.service';
import { WineTastingSheet } from '../../_models/wine-tasting-sheet.model';
import { NotificationsComponent } from '../../components/notifications/notifications.component';
import { CookiesService } from '../../_services/cookies.service'


@Component({
	selector: 'app-tasting-sheet',
	templateUrl: './tasting-sheet.component.html',
	styleUrls: ['./tasting-sheet.component.css']
})
export class TastginSheetComponent implements OnInit {
	notificationService: NotificationsComponent;
	wineTastingSheet: WineTastingSheet = new WineTastingSheet();
	destroy$: Subject<boolean> = new Subject<boolean>();
	wine: any;
	grapes: any = [];
	buttonLabel = "Invia";
	selectedItems: string[] = [];
	@ViewChild('input') inputEl: any;
	userUid: string  = "";

	public model: any;

	constructor(private appService: AppService,
		private route: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService, 
		private cookiesService: CookiesService) {
		this.userUid = JSON.parse(this.cookiesService.getCookieUser()).uid;
		this.notificationService = new NotificationsComponent(this.toastr);
		this.wine = this.route.snapshot.queryParams;
		if (Object.keys(this.wine).length !== 0) {
			this.setFormWineInformation(this.wine);
			this.buttonLabel = "Modifica";
		}
	}

	tastingSheetForm = new UntypedFormGroup({
		id: new UntypedFormControl(''),
		user: new UntypedFormControl(''),
		name: new UntypedFormControl('', Validators.required),
		winery: new UntypedFormControl('', Validators.required),
		wineType: new UntypedFormControl(''),
		vintage: new UntypedFormControl(''),
		grapeVariety: new UntypedFormControl(''),
		alcoholContent: new UntypedFormControl(''),
		servingTemperature: new UntypedFormControl(''),
		price: new UntypedFormControl(''),
		score: new UntypedFormControl(''),
		color: new UntypedFormControl(''),
		colorDensity: new UntypedFormControl(''),
		limpidity: new UntypedFormControl(''),
		consistency: new UntypedFormControl(''),
		effervescenceBubbleGrain: new UntypedFormControl(''),
		effervescenceBubbleNumber: new UntypedFormControl(''),
		effervescenceBubblePersistence: new UntypedFormControl(''),
		olfactoryIntensity: new UntypedFormControl(''),
		olfactoryComplexity: new UntypedFormControl(''),
		olfactoryQuality: new UntypedFormControl(''),
		olfactorySense: new UntypedFormControl(''),
		olfactoryDescription: new UntypedFormControl(''),
		sugars: new UntypedFormControl(''),
		alcohols: new UntypedFormControl(''),
		polyalcohols: new UntypedFormControl(''),
		acids: new UntypedFormControl(''),
		tanninsQuantity: new UntypedFormControl(''),
		tanninsQuality: new UntypedFormControl(''),
		mineralSubstances: new UntypedFormControl(''),
		equilibrium: new UntypedFormControl(''),
		tasteIntensity: new UntypedFormControl(''),
		tastePersistence: new UntypedFormControl(''),
		tasteQuality: new UntypedFormControl(''),
		bodyWine: new UntypedFormControl(''),
		evolutionaryState: new UntypedFormControl(''),
		harmony: new UntypedFormControl(''),
		typicality: new UntypedFormControl(''),
		foodPairings: new UntypedFormControl('')
	});

	ngOnInit() {
		this.getAllGrapes();
	}

	formatter = (result: string) => result.toUpperCase();

	search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			distinctUntilChanged(),
			map((term: any) => {
				// Se term contiene virgole, prendi solo l'ultimo termine
				const termsArray = term.split(',');
				const lastTerm = termsArray[termsArray.length - 1].trim();

				return lastTerm === ''
					? []
					: this.grapes.filter((v: any) => v.toLowerCase().indexOf(lastTerm.toLowerCase()) > -1).slice(0, 10);
			}),
		);

	selected($e: any) {
		$e.preventDefault();
		this.selectedItems.push($e.item);
		var grapesSplitted = this.tastingSheetForm.value.grapeVariety.split(",");
		var finalString = "";
		if (grapesSplitted.length === 1){
			finalString =  $e.item;
		}else{
			grapesSplitted[grapesSplitted.length-1] = $e.item;
			finalString = grapesSplitted.toString().replace(",", ", ");
		}
		this.tastingSheetForm.patchValue({
			grapeVariety: finalString,
		});
		//this.inputEl.nativeElement.value = '';
	}

	getAllGrapes() {
		this.appService.getGrapesName().subscribe((grapes => {
			if (grapes == null)
				this.grapes = [];
			else
				this.grapes = grapes;
		}));
	}

	submitForm() {
		if (Object.keys(this.wine).length !== 0) {
			this.updateTastingSheet();
		} else {
			this.saveTastingSheet();
		}
	}

	saveTastingSheet(): void {
		this.setWineInformation();

		this.appService.addWine(this.wineTastingSheet).pipe(takeUntil(this.destroy$)).subscribe(data => {
			console.log('message::::', data);
			this.notificationService.successNotification("Vino salvato!");
			this.tastingSheetForm.reset();
			this.router.navigate(['/wine-tasted']);
		});

		console.log(this.wineTastingSheet);
	}

	updateTastingSheet() {
		this.setWineInformation();

		this.appService.editWine(this.tastingSheetForm.value).pipe(takeUntil(this.destroy$)).subscribe(data => {
			console.log('message::::', data);

			this.tastingSheetForm.reset();
		});
	}

	setFormWineInformation(wine: any): void {
		this.tastingSheetForm.patchValue({
			user: this.userUid,
			id: wine.id,
			name: wine.name,
			winery: wine.winery,
			wineType: wine.wineType,
			vintage: wine.vintage,
			grapeVariety: wine.grapeVariety,
			alcoholContent: wine.alcoholContent,
			servingTemperature: wine.servingTemperature,
			price: wine.price,
			score: wine.score,
			color: wine.color,
			colorDensity: wine.colorDensity,
			limpidity: wine.limpidity,
			consistency: wine.consistency,
			effervescenceBubbleGrain: wine.effervescenceBubbleGrain,
			effervescenceBubbleNumber: wine.effervescenceBubbleNumber,
			effervescenceBubblePersistence: wine.effervescenceBubblePersistence,
			olfactoryIntensity: wine.olfactoryIntensity,
			olfactoryComplexity: wine.olfactoryComplexity,
			olfactoryQuality: wine.olfactoryQuality,
			olfactorySense: wine.olfactorySense,
			olfactoryDescription: wine.olfactoryDescription,
			sugars: wine.sugars,
			alcohols: wine.alcohols,
			polyalcohols: wine.polyalcohols,
			acids: wine.acids,
			tanninsQuantity: wine.tanninsQuantity,
			tanninsQuality: wine.tanninsQuality,
			mineralSubstances: wine.mineralSubstances,
			equilibrium: wine.equilibrium,
			tasteIntensity: wine.tasteIntensity,
			tastePersistence: wine.tastePersistence,
			tasteQuality: wine.tasteQuality,
			evolutionaryState: wine.evolutionaryState,
			harmony: wine.harmony,
			typicality: wine.typicality,
			foodPairings: wine.foodPairings
		});
	}

	setWineInformation() {
		// Assegna i valori dai campi del form alle propriet� dell'oggetto WineTastingSheet
		//this.wineTastingSheet.id = "4";
		this.wineTastingSheet.user = this.userUid;
		this.wineTastingSheet.id = this.tastingSheetForm.controls['id'].value;
		this.wineTastingSheet.name = this.tastingSheetForm.controls['name'].value;
		this.wineTastingSheet.winery = this.tastingSheetForm.controls['winery'].value;
		this.wineTastingSheet.wineType = this.tastingSheetForm.controls['wineType'].value;
		this.wineTastingSheet.grapeVariety = this.tastingSheetForm.controls['grapeVariety'].value;
		this.wineTastingSheet.vintage = this.tastingSheetForm.controls['vintage'].value;
		this.wineTastingSheet.alcoholContent = this.tastingSheetForm.controls['alcoholContent'].value;
		this.wineTastingSheet.servingTemperature = this.tastingSheetForm.controls['servingTemperature'].value;
		this.wineTastingSheet.price = this.tastingSheetForm.controls['price'].value;
		this.wineTastingSheet.dominantAroma = this.tastingSheetForm.controls['score'].value;
		this.wineTastingSheet.color = this.tastingSheetForm.controls['color'].value;
		this.wineTastingSheet.chromaticDensity = this.tastingSheetForm.controls['colorDensity'].value;
		this.wineTastingSheet.clarity = this.tastingSheetForm.controls['limpidity'].value;
		this.wineTastingSheet.consistency = this.tastingSheetForm.controls['consistency'].value;
		this.wineTastingSheet.effervescenceBubbleGrain = this.tastingSheetForm.controls['effervescenceBubbleGrain'].value;
		this.wineTastingSheet.effervescenceBubbleNumber = this.tastingSheetForm.controls['effervescenceBubbleNumber'].value;
		this.wineTastingSheet.effervescenceBubblePersistence = this.tastingSheetForm.controls['effervescenceBubblePersistence'].value;
		this.wineTastingSheet.olfactoryIntensity = this.tastingSheetForm.controls['olfactoryIntensity'].value;
		this.wineTastingSheet.complexity = this.tastingSheetForm.controls['olfactoryComplexity'].value;
		this.wineTastingSheet.olfactoryQuality = this.tastingSheetForm.controls['olfactoryQuality'].value;
		this.wineTastingSheet.dominantAroma = this.tastingSheetForm.controls['olfactorySense'].value;
		this.wineTastingSheet.olfactoryDescription = this.tastingSheetForm.controls['olfactoryDescription'].value;
		this.wineTastingSheet.sweetness = this.tastingSheetForm.controls['sugars'].value;
		this.wineTastingSheet.alcoholPerception = this.tastingSheetForm.controls['alcohols'].value;
		this.wineTastingSheet.polyalcohols = this.tastingSheetForm.controls['polyalcohols'].value;
		this.wineTastingSheet.acidity = this.tastingSheetForm.controls['acids'].value;
		this.wineTastingSheet.tanninQuantity = this.tastingSheetForm.controls['tanninsQuantity'].value;
		this.wineTastingSheet.tanninQuality = this.tastingSheetForm.controls['tanninsQuality'].value;
		this.wineTastingSheet.mineralSubstances = this.tastingSheetForm.controls['mineralSubstances'].value;
		this.wineTastingSheet.balance = this.tastingSheetForm.controls['equilibrium'].value;
		this.wineTastingSheet.intensity = this.tastingSheetForm.controls['tasteIntensity'].value;
		this.wineTastingSheet.persistence = this.tastingSheetForm.controls['tastePersistence'].value;
		this.wineTastingSheet.quality = this.tastingSheetForm.controls['tasteQuality'].value;
		this.wineTastingSheet.body = this.tastingSheetForm.controls['bodyWine'].value;
		this.wineTastingSheet.evolutionStage = this.tastingSheetForm.controls['evolutionaryState'].value;
		this.wineTastingSheet.harmony = this.tastingSheetForm.controls['harmony'].value;
		this.wineTastingSheet.typicity = this.tastingSheetForm.controls['typicality'].value;
		this.wineTastingSheet.foodPairing = this.tastingSheetForm.controls['foodPairings'].value;
	}

	ngOnDestroy() {
		this.destroy$.next(true);
		this.destroy$.unsubscribe();
	}
}