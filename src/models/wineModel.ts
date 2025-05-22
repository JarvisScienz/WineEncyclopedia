interface Wine {
    id: string;
    wineryName: string;
    grapes: Grape[];
    soil: string;
    tastingDescription: string;
    denomination: string;
	productionZone: string;
    refinement: string;
    name: string;
    color: string;
    winery: string;
    winemaking: string;
    img?: string;
    tastedCount?: number;
}