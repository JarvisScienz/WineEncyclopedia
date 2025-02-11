export class Wine {
    id!: number;
    wineryName!: string;
    grapes!: Grapes[];
    soil!: string;
    tastingDescription!: string;
    denomination!: string;
	productionZone!: string;
    refinement!: string;
    name!: string;
    color!: string;
    winery!: string;
    winemaking!: string;
    img?: string;
}

export class Grapes {
    nameGrape!: string;
    percentageGrape!: number;
}