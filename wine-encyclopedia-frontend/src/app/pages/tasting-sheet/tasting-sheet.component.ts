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
import { WineService } from 'src/app/_services/wine.service';
import { WineryService } from 'src/app/_services/winery.service';


@Component({
	selector: 'app-tasting-sheet',
	templateUrl: './tasting-sheet.component.html',
	styleUrls: ['./tasting-sheet.component.css']
})
export class TastingSheetComponent implements OnInit {
	notificationService: NotificationsComponent;
	wineTastingSheet: WineTastingSheet = new WineTastingSheet();
	destroy$: Subject<boolean> = new Subject<boolean>();
	previousValueForm: any = [];
	grapes: any = [];
	wineries: any = [];
	wines: any = [];
	buttonLabel = "Invia";
	selectedItems: string[] = [];
	@ViewChild('input') inputEl: any;
	userUid: string  = "";
	isRedWine: boolean = false;
	isEffervescentWine: boolean = false;
	radarChartData: number[];
	score: number = 0;

	public model: any;

	constructor(private wineTastedService: WineTastedService,
		private wineryService: WineryService,
		private wineService: WineService,
		private grapeService: GrapeService,
		private route: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService, 
		private cookiesService: CookiesService) {
		this.userUid = JSON.parse(this.cookiesService.getCookieUser()).uid;
		this.notificationService = new NotificationsComponent(this.toastr);
		this.radarChartData = [0, 0, 0, 0, 0, 0, 0, 0, 0];
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
		this.getAllWineries();
		this.getAllWines();
	}

	formatter = (result: string) => result.toUpperCase();

	searchGrapes: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
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
	
	searchWineries: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			distinctUntilChanged(),
			map((term: any) => {
				// Se term contiene virgole, prendi solo l'ultimo termine
				const termsArray = term.split(',');
				const lastTerm = termsArray[termsArray.length - 1].trim();

				return lastTerm === ''
					? []
					: this.wineries.filter((v: any) => v.toLowerCase().indexOf(lastTerm.toLowerCase()) > -1).slice(0, 10);
			}),
		);
	
		searchWines: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
			text$.pipe(
				debounceTime(200),
				distinctUntilChanged(),
				map((term: any) => {
					// Se term contiene virgole, prendi solo l'ultimo termine
					const termsArray = term.split(',');
					const lastTerm = termsArray[termsArray.length - 1].trim();
	
					return lastTerm === ''
						? []
						: this.wines
							.filter((v: any) => v.name.toLowerCase().includes(lastTerm.toLowerCase()))
							.map((v: any) => v.name) // Estrai solo i nomi dei vini
							.slice(0, 10); // Limita a 10 risultati
				}),
			);

	filterSelectGrapes($e: any) {
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

	filterSelectWineries($e: any) {
		$e.preventDefault();
		this.selectedItems.push($e.item);
		var wineriesSplitted = this.tastingSheetForm.value.winery.split(",");
		var finalString = "";
		if (wineriesSplitted.length === 1){
			finalString =  $e.item;
		}else{
			wineriesSplitted[wineriesSplitted.length-1] = $e.item;
			finalString = wineriesSplitted.toString().replace(",", ", ");
		}
		this.tastingSheetForm.patchValue({
			winery: finalString,
		});
		//this.inputEl.nativeElement.value = '';
	}

	filterSelectWines($e: any) {
		$e.preventDefault();
		const selectedWineName = $e.item;
		const selectedWine = this.wines.find((v: any) => v.name === selectedWineName); 
		this.selectedItems.push(selectedWineName);
		var winesSplitted = this.tastingSheetForm.value.name.split(",");
		var finalString = "";
		if (winesSplitted.length === 1){
			finalString =  selectedWineName;
		}else{
			winesSplitted[winesSplitted.length-1] = selectedWineName;
			finalString = winesSplitted.toString().replace(",", ", ");
		}
		this.tastingSheetForm.patchValue({
			name: finalString,
			winery: selectedWine.wineryName,
			wineType: this.getWineType(selectedWine.color),
		});
	}

	getAllGrapes() {
		this.grapeService.getGrapesName().subscribe((grapes => {
			if (grapes == null)
				this.grapes = [];
			else
				this.grapes = grapes;
		}));
	}

	getAllWineries(){
		this.wineryService.getWineriesList().subscribe((wineries => {
			if (wineries == null)
				this.wineries = [];
			else
				this.wineries = wineries;
		}));
	}

	getAllWines(){
		this.wineService.getWines().subscribe((wines => {
			if (wines == null)
				this.wines = [];
			else
				this.wines = wines;
		}));
	}

	submitForm() {
		this.saveTastingSheet();
	}

	saveTastingSheet(): void {
		this.setWineInformation();

		this.wineTastedService.addWineTasted(this.wineTastingSheet).pipe(takeUntil(this.destroy$)).subscribe(data => {
			console.log('message::::', data);
			this.notificationService.successNotification("Vino salvato!");
			this.tastingSheetForm.reset();
			this.router.navigate(['/wine-tasted']);
		});

		console.log(this.wineTastingSheet);
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

	updateWinePoint(event: Event){
		let key = (event.target as HTMLSelectElement).name;
		let value = (event.target as HTMLSelectElement).options.selectedIndex+1;
		let oldValue = 0;
		 switch (key){
			case 'colore':
				if (this.previousValueForm['color'] !== undefined){
					oldValue = this.previousValueForm['color'];
				}
				this.previousValueForm['color'] = 10 ;
				this.score = this.score - oldValue + 10;
				this.tastingSheetForm.patchValue({
					score: this.score,
				});	
				break;
			case 'limpidezza':
				if (this.previousValueForm['limpidity'] !== undefined){
					oldValue = this.previousValueForm['limpidity'];
				}
				this.previousValueForm['limpidity'] = value ;
				this.score = this.score - oldValue + value;
				this.tastingSheetForm.patchValue({
					score: this.score,
				});	
				break;
			case 'complessita':
				if (this.previousValueForm['olfactoryComplexity'] !== undefined){
					oldValue = this.previousValueForm['olfactoryComplexity'];
				}
				this.previousValueForm['olfactoryComplexity'] = value*3 ;
				this.score = this.score - oldValue + (value*3);
				this.tastingSheetForm.patchValue({
					score: this.score,
				});	
				break;
			case 'olfactoryQuality':
				if (this.previousValueForm['olfactoryQuality'] !== undefined){
					oldValue = this.previousValueForm['olfactoryQuality'];
				}
				value = this.getOlfactoryQualityValue(value);
				this.previousValueForm['olfactoryQuality'] = value ;
				this.score = this.score - oldValue + value;
				this.tastingSheetForm.patchValue({
					score: this.score,
				});	
				break;
			case 'equilibrio':
				if (this.previousValueForm['equilibrium'] !== undefined){
					oldValue = this.previousValueForm['equilibrium'];
				}
				value = this.getEquilibriumValue(value);
				this.previousValueForm['equilibrium'] = value ;
				this.score = this.score - oldValue + value;
				this.tastingSheetForm.patchValue({
					score: this.score,
				});	
				break;
			case 'tasteIntensity':
				if (this.previousValueForm['tasteIntensity'] !== undefined){
					oldValue = this.previousValueForm['tasteIntensity'];
				}
				this.previousValueForm['tasteIntensity'] = value ;
				this.score = this.score - oldValue + value;
				this.tastingSheetForm.patchValue({
					score: this.score,
				});	
				break;
			case 'tastePersistence':
				if (this.previousValueForm['tastePersistence'] !== undefined){
					oldValue = this.previousValueForm['tastePersistence'];
				}
				value = this.getTastePersistenceValue(value);
				this.previousValueForm['tastePersistence'] = value ;
				this.score = this.score - oldValue + value;
				this.tastingSheetForm.patchValue({
					score: this.score,
				});	
				break;
			case 'tasteQuality':
				if (this.previousValueForm['tasteQuality'] !== undefined){
					oldValue = this.previousValueForm['tasteQuality'];
				}
				value = this.getOlfactoryQualityValue(value);
				this.previousValueForm['tasteQuality'] = value ;
				this.score = this.score - oldValue + value;
				this.tastingSheetForm.patchValue({
					score: this.score,
				});	
				break;
			case 'tipicita':
				if (this.previousValueForm['typicality'] !== undefined){
					oldValue = this.previousValueForm['typicality'];
				}
				this.previousValueForm['typicality'] = value+4 ;
				this.score = this.score - oldValue + (value+4);
				this.tastingSheetForm.patchValue({
					score: this.score,
				});	
				break;
		 }
	}

	getOlfactoryQualityValue(value: number): number{
		switch (value){
			case 1:
				return 6;
			case 2:
				return 10;
			case 3:
				return 14;
			case 4:
				return 18;
			default:
				return 6;
		}
	}
	
	getEquilibriumValue(value: number): number{
		switch (value){
			case 1:
				return 4;
			case 2:
				return 6;
			case 3:
				return 8;
			case 4:
				return 10;
			default:
				return 4;
		}
	}

	getTastePersistenceValue(value: number): number{
		switch (value){
			case 1:
				return 10;
			case 2:
				return 12;
			case 3:
				return 14;
			case 4:
				return 16;
			default:
				return 10;
		}
	}

	setFormWineInformation(wine: any): void {
		this.isRedWine = wine.color?.toLowerCase().includes('red');
		this.isEffervescentWine = wine.wineType?.includes('Prosecco') || wine.wineType?.includes('Spumante') || wine.wineType?.includes('Champagne');
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
			bodyWine: wine.bodyWine,
			harmony: wine.harmony,
			typicality: wine.typicality,
			foodPairings: wine.foodPairings
		});
		this.radarChartData = [this.getValueFromDefinition(wine.polyalcohols), this.getValueFromDefinition(wine.tastePersistence), 
			this.getValueFromDefinition(wine.tasteIntensity), this.getValueFromDefinition(wine.tanninsQuality), 
			this.getValueFromDefinition(wine.bodyWine), this.getValueFromDefinition(wine.polyalcohols), 
			this.getValueFromDefinition(wine.equilibrium), this.getValueFromDefinition(wine.alcohols), 
			this.getValueFromDefinition(wine.acids)];
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

	getScoreClass(score: number): string {
		if (score >= 0 && score <= 73) {
		  return 'border-common';
		} else if (score >= 74 && score <= 80) {
		  return 'border-good';
		} else if (score >= 81 && score <= 90) {
		  return 'border-very-good';
		} else if (score >= 91 && score <= 100) {
		  return 'border-excellent';
		}
		return '';
	  }

	  updateScore(event: any) {
		this.score = event.target.value;
	  }

	  getWineType(color: string): string {
		if (color.toLowerCase().includes('rosso')) {
		  return 'Vino rosso';
		} else if (color.toLowerCase().includes('bianco')) {
		  return 'Vino bianco';	  
		} else if (color.toLowerCase().includes('rosato')) {
		  return 'Vino rosato';	  
		} else if (color.toLowerCase().includes('sparkling')) {
		  return 'Spumante';	  
		} else if (color.toLowerCase().includes('liqueur')) {
		  return 'iVino liquoroso';	  
		} else if (color.toLowerCase().includes('champagne')) {
		  return 'Champagne';	  
		} else if (color.toLowerCase().includes('prosecco')) {
		  return 'Prosecco';	  
		} else {
		  return 'Vino rosso';
		}
	  }
}