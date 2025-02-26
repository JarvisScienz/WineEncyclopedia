import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { takeUntil, debounceTime, distinctUntilChanged, map, catchError } from 'rxjs/operators';
import { Subject, OperatorFunction, Observable, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

import { WineTastingSheet } from '../../_models/wine-tasting-sheet.model';
import { NotificationsComponent } from '../../components/notifications/notifications.component';
import { CookiesService } from '../../_services/cookies.service'
import { RadarChartComponent } from 'src/app/components/radar-chart/radar-chart.component';
import { WineTastedService } from 'src/app/_services/wineTasted.service';
import { GrapeService } from 'src/app/_services/grape.service';


@Component({
	selector: 'app-wine-tasted-details',
	templateUrl: './wine-tasted-details.component.html',
	styleUrls: ['./wine-tasted-details.component.css']
})
export class WineTastedDetailsComponent implements OnInit {
	wineDetails: any = {};
	notificationService: NotificationsComponent;
	wineTastingSheet: WineTastingSheet = new WineTastingSheet();
	destroy$: Subject<boolean> = new Subject<boolean>();
	wine: any;
	grapes: any = [];
	selectedItems: string[] = [];
	@ViewChild('input') inputEl: any;
	userUid: string  = "";
	isRedWine: boolean = false;
	isEffervescentWine: boolean = false;
	radarChartData: number[];
	tastingSheetForm!: UntypedFormGroup;
	//@ViewChild('radarChart') radarChartComponent: RadarChartComponent;

	public model: any;

	constructor(private wineTastedService: WineTastedService,
		private grapeService: GrapeService,
		private route: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService, 
		private cookiesService: CookiesService) {
		this.userUid = JSON.parse(this.cookiesService.getCookieUser()).uid;
		this.notificationService = new NotificationsComponent(this.toastr);
		this.wine = this.route.snapshot.queryParams;
		this.radarChartData = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	}

	ngOnInit() {
		this.wineDetails = history.state.wineData;
		this.isRedWine = this.wineDetails.color?.toLowerCase().includes('red');
		this.isEffervescentWine = this.wineDetails.wineType?.includes('Prosecco') || this.wineDetails.wineType?.includes('Spumante') || this.wineDetails.wineType?.includes('Champagne');
		this.tastingSheetForm = new UntypedFormGroup({
			id: new UntypedFormControl(this.wineDetails.id),
			user: new UntypedFormControl(this.wineDetails.user),
			name: new UntypedFormControl(this.wineDetails.name, Validators.required),
			winery: new UntypedFormControl(this.wineDetails.winery, Validators.required),
			wineType: new UntypedFormControl(this.wineDetails.wineType),
			vintage: new UntypedFormControl(this.wineDetails.vintage),
			grapeVariety: new UntypedFormControl(this.wineDetails.grapeVariety),
			alcoholContent: new UntypedFormControl(this.wineDetails.alcoholContent),
			servingTemperature: new UntypedFormControl(this.wineDetails.servingTemperature),
			price: new UntypedFormControl(this.wineDetails.price),
			score: new UntypedFormControl(this.wineDetails.score),
			color: new UntypedFormControl(this.wineDetails.color),
			colorDensity: new UntypedFormControl(this.wineDetails.colorDensity),
			limpidity: new UntypedFormControl(this.wineDetails.limpidity),
			consistency: new UntypedFormControl(this.wineDetails.consistency),
			effervescenceBubbleGrain: new UntypedFormControl(this.wineDetails.effervescenceBubbleGrain),
			effervescenceBubbleNumber: new UntypedFormControl(this.wineDetails.effervescenceBubbleNumber),
			effervescenceBubblePersistence: new UntypedFormControl(this.wineDetails.effervescenceBubblePersistence),
			olfactoryIntensity: new UntypedFormControl(this.wineDetails.olfactoryIntensity),
			olfactoryComplexity: new UntypedFormControl(this.wineDetails.olfactoryComplexity),
			olfactoryQuality: new UntypedFormControl(this.wineDetails.olfactoryQuality),
			olfactorySense: new UntypedFormControl(this.wineDetails.olfactorySense),
			olfactoryDescription: new UntypedFormControl(this.wineDetails.olfactoryDescription),
			sugars: new UntypedFormControl(this.wineDetails.sugars),
			alcohols: new UntypedFormControl(this.wineDetails.alcohols),
			polyalcohols: new UntypedFormControl(this.wineDetails.polyalcohols),
			acids: new UntypedFormControl(this.wineDetails.acids),
			tanninsQuantity: new UntypedFormControl(this.wineDetails.tanninsQuantity),
			tanninsQuality: new UntypedFormControl(this.wineDetails.tanninsQuality),
			mineralSubstances: new UntypedFormControl(this.wineDetails.mineralSubstances),
			equilibrium: new UntypedFormControl(this.wineDetails.equilibrium),
			tasteIntensity: new UntypedFormControl(this.wineDetails.tasteIntensity),
			tastePersistence: new UntypedFormControl(this.wineDetails.tastePersistence),
			tasteQuality: new UntypedFormControl(this.wineDetails.tasteQuality),
			bodyWine: new UntypedFormControl(this.wineDetails.bodyWine),
			evolutionaryState: new UntypedFormControl(this.wineDetails.evolutionaryState),
			harmony: new UntypedFormControl(this.wineDetails.harmony),
			typicality: new UntypedFormControl(this.wineDetails.typicality),
			foodPairings: new UntypedFormControl(this.wineDetails.foodPairings)
		});

		this.radarChartData = [this.getValueFromDefinition(this.wineDetails.polyalcohols), this.getValueFromDefinition(this.wineDetails.tastePersistence), 
			this.getValueFromDefinition(this.wineDetails.tasteIntensity), this.getValueFromDefinition(this.wineDetails.tanninsQuality), 
			this.getValueFromDefinition(this.wineDetails.bodyWine), this.getValueFromDefinition(this.wineDetails.polyalcohols), 
			this.getValueFromDefinition(this.wineDetails.equilibrium), this.getValueFromDefinition(this.wineDetails.alcohols), 
			this.getValueFromDefinition(this.wineDetails.acids)];
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
		this.grapeService.getGrapesName().subscribe((grapes => {
			if (grapes == null)
				this.grapes = [];
			else
				this.grapes = grapes;
		}));
	}

	submitForm() {
		if (Object.keys(this.wine).length !== 0) {
			this.updateTastingSheet();
		}
	}

	updateTastingSheet() {
		this.setWineInformation();

		this.wineTastedService.editWineTasted(this.tastingSheetForm.value)
		.pipe(
			takeUntil(this.destroy$),
			catchError(error => {
			console.error('Errore durante l’aggiornamento del vino:', error);
			this.notificationService.errorNotification("Errore durante l'aggiornamento del vino. Riprova.");
			return throwError(() => error); // Propaga l'errore se necessario
			})
		)
		.subscribe({
			next: data => {
			console.log('message::::', data);
			this.notificationService.successNotification("Vino aggiornato!");
			},
			error: err => {
			console.error("Errore gestito nello subscribe:", err);
			}
		});

	}

	changeColor(event: any) {	
		this.isRedWine = event.target.value.toLowerCase().includes('red');
	}

	changeWineType(event: any) {
		this.isEffervescentWine = event.target.value.includes('Prosecco') || event.target.value.includes('Spumante') || event.target.value.includes('Champagne');
	}

	updateRadarChart(event: any){
		let key = event.target.name;
		let value = event.target.options.selectedIndex+1;
		 switch (key){
			case 'polialcoli':
				//this.radarChartComponent.updateChartDataAtIndex(0, value);
				this.radarChartData = [value, this.radarChartData[1], this.radarChartData[2], this.radarChartData[3], this.radarChartData[4], this.radarChartData[5], this.radarChartData[6], this.radarChartData[7], this.radarChartData[8]];
				break;
			case 'persistenza':
				//this.radarChartComponent.updateChartDataAtIndex(0, value);
				this.radarChartData = [this.radarChartData[0], value, this.radarChartData[2], this.radarChartData[3], this.radarChartData[4], this.radarChartData[5], this.radarChartData[6], this.radarChartData[7], this.radarChartData[8]];
				break;
			case 'intensita':
				//this.radarChartComponent.updateChartDataAtIndex(0, value);
				this.radarChartData = [this.radarChartData[0], this.radarChartData[1], value, this.radarChartData[3], this.radarChartData[4], this.radarChartData[5], this.radarChartData[6], this.radarChartData[7], this.radarChartData[8]];
				break;
			case 'tanninoQualita':
				//this.radarChartComponent.updateChartDataAtIndex(0, value);
				this.radarChartData = [this.radarChartData[0], this.radarChartData[1], this.radarChartData[2], value, this.radarChartData[4], this.radarChartData[5], this.radarChartData[6], this.radarChartData[7], this.radarChartData[8]];
				break;
			case 'corpo':
				//this.radarChartComponent.updateChartDataAtIndex(0, value);
				this.radarChartData = [this.radarChartData[0], this.radarChartData[1], this.radarChartData[2], this.radarChartData[3], value, this.radarChartData[5], this.radarChartData[6], this.radarChartData[7], this.radarChartData[8]];
				break;
			case 'polialcoli':
				//this.radarChartComponent.updateChartDataAtIndex(0, value);
				this.radarChartData = [this.radarChartData[0], this.radarChartData[1], this.radarChartData[2], this.radarChartData[3], this.radarChartData[4], value, this.radarChartData[6], this.radarChartData[7], this.radarChartData[8]];
				break;
			case 'equilibrio':
				//this.radarChartComponent.updateChartDataAtIndex(0, value);
				this.radarChartData = [this.radarChartData[0], this.radarChartData[1], this.radarChartData[2], this.radarChartData[3], this.radarChartData[4], this.radarChartData[5], value, this.radarChartData[7], this.radarChartData[8]];
				break;
			case 'alcoli':
				//this.radarChartComponent.updateChartDataAtIndex(0, value);
				this.radarChartData = [this.radarChartData[0], this.radarChartData[1], this.radarChartData[2], this.radarChartData[3], this.radarChartData[4], this.radarChartData[5], this.radarChartData[6], value, this.radarChartData[8]];
				break;
			case 'acidi':
				//this.radarChartComponent.updateChartDataAtIndex(0, value);
				this.radarChartData = [this.radarChartData[0], this.radarChartData[1], this.radarChartData[2], this.radarChartData[3], this.radarChartData[4], this.radarChartData[5], this.radarChartData[6], this.radarChartData[7], value];
				break;
		 }
	}

	getValueFromDefinition(definition: string) {
		let returnValue = 0;
		switch (definition) {
			case 'Poco morbido':
				returnValue = 1;
				break;
			case 'Moderatamente morbido':
				returnValue = 2;
				break;
			case 'Morbido':
				returnValue = 3;
				break;
			case 'Rotondo':
				returnValue = 4;
				break;
			case 'Poco persistente':
				returnValue = 1;
				break;
			case 'Sufficientemente persistente':
				returnValue = 2;
				break;
			case 'Persistente':
				returnValue = 3;
				break;
			case 'Molto persistente':
				returnValue = 4;
				break;
			case 'Poco intenso':
				returnValue = 1;
				break;
			case 'Sufficientemente intenso':
				returnValue = 2;
				break;
			case 'Intenso':
				returnValue = 3;
				break;
			case 'Molto intenso':
				returnValue = 4;
				break;
			case 'Grossolano':
				returnValue = 1;
				break;
			case 'Duro':
				returnValue = 2;
				break;
			case 'Vellutato':
				returnValue = 3;
				break;
			case 'Nobile':
				returnValue = 4;
				break;
			case 'Leggero':
				returnValue = 1;
				break;
			case 'Medio':
				returnValue = 2;
				break;
			case 'Pieno':
				returnValue = 3;
				break;
			case 'Pesante':
				returnValue = 4;
				break;
			case 'Sbilanciato':
				returnValue = 1;
				break;
			case 'Poco equilibrato':
				returnValue = 2;
				break;
			case 'Sufficientemente equilibrato':
				returnValue = 3;
				break;
			case 'Equilibrato':
				returnValue = 4;
				break;
			case 'Poco caldo':
				returnValue = 1;
				break;
			case 'Moderatamente caldo':
				returnValue = 2;
				break;
			case 'Caldo':
				returnValue = 3;
				break;
			case 'Molto caldo':
				returnValue = 4;
				break;
			case 'Poco fresco':
				returnValue = 1;
				break;
			case 'Moderatamente fresco':
				returnValue = 2;
				break;
			case 'Fresco':
				returnValue = 3;
				break;
			case 'Molto fresco':
				returnValue = 4;
				break;
		}

		return returnValue;
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