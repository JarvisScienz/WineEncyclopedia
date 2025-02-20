interface WineTasted {
    user: string;
	// Wine information properties
	id: string;
	name: string;
	winery: string;
	wineType: string;
	grapeVariety: string;
	alcoholContent: string;
	servingTemperature: string;
	price: string;
	score: string;
	vintage: string;
	
	// Visual Analysis properties
	color: string;
	chromaticDensity: string;
	clarity: string;
	consistency: string;
	effervescenceBubbleGrain: string;
	effervescenceBubbleNumber: string;
	effervescenceBubblePersistence: string;

	// Olfactory Analysis properties
	olfactoryIntensity: string;
	complexity: string;
	olfactoryQuality: string;
	dominantAroma: string;
	olfactoryDescription: string;

	// Gustatory-Olfactory Analysis properties
	sweetness: string;
	alcoholPerception: string;
	polyalcohols: string;
	acidity: string;
	tanninQuantity: string;
	tanninQuality: string;
	mineralSubstances: string;
	balance: string;
	intensity: string;
	persistence: string;
	quality: string;
	body: string;

	// Conclusive part properties
	evolutionStage: string;
	harmony: string;
	typicity: string;
	foodPairing: string;

	//General data
	createdAt?: Date;
}