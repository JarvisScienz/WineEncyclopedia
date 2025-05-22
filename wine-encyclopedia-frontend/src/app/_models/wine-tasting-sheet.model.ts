// wine-tasting-sheet.model.ts

export class WineTastingSheet {
	public user: string;
	// Wine information properties
	public id: string;
	public name: string;
	public winery: string;
	public wineType: string;
	public wineId: string;
	public grapeVariety: string;
	public alcoholContent: string;
	public servingTemperature: string;
	public price: string;
	public score: string;
	public vintage: string;
	
	// Visual Analysis properties
	public color: string;
	public chromaticDensity: string;
	public clarity: string;
	public consistency: string;
	public effervescenceBubbleGrain: string;
	public effervescenceBubbleNumber: string;
	public effervescenceBubblePersistence: string;

	// Olfactory Analysis properties
	public olfactoryIntensity: string;
	public complexity: string;
	public olfactoryQuality: string;
	public dominantAroma: string;
	public olfactoryDescription: string;

	// Gustatory-Olfactory Analysis properties
	public sweetness: string;
	public alcoholPerception: string;
	public polyalcohols: string;
	public acidity: string;
	public tanninQuantity: string;
	public tanninQuality: string;
	public mineralSubstances: string;
	public balance: string;
	public intensity: string;
	public persistence: string;
	public quality: string;
	public body: string;

	// Conclusive part properties
	public evolutionStage: string;
	public harmony: string;
	public typicity: string;
	public foodPairing: string;

	//General data
	public createdAt?: Date;

	constructor() {
		// Initialize properties with default values
		this.user = '';
		this.id = '';
		this.wineId = '';
		this.color = '';
		this.chromaticDensity = '';
		this.clarity = '';
		this.consistency = '';
		this.olfactoryIntensity = '';
		this.complexity = '';
		this.olfactoryQuality = '';
		this.dominantAroma = '';
		this.olfactoryDescription = '';
		this.sweetness = '';
		this.alcoholPerception = '';
		this.polyalcohols = '';
		this.acidity = '';
		this.tanninQuantity = '';
		this.tanninQuality = '';
		this.mineralSubstances = '';
		this.balance = '';
		this.intensity = '';
		this.persistence = '';
		this.quality = '';
		this.body = '';
		this.evolutionStage = '';
		this.harmony = '';
		this.typicity = '';
		this.foodPairing = '';
		this.name = '';
		this.winery = '';
		this.wineType = '';
		this.grapeVariety = '';
		this.vintage = '';
		this.alcoholContent = '';
		this.servingTemperature = '';
		this.price = '';
		this.score = '';
		this.effervescenceBubbleGrain = '';
		this.effervescenceBubbleNumber = '';
		this.effervescenceBubblePersistence = '';
	}
}
