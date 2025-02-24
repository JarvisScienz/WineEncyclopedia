import { TestBed } from '@angular/core/testing';
import { WinesComponent } from './wines.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppService } from 'src/app/app.service';
import { Wine } from 'src/app/_models/wine';
import { of } from 'rxjs';
import { WineTastingSheet } from 'src/app/_models/wine-tasting-sheet.model';
import { CookiesService } from 'src/app/_services/cookies.service';

describe('WineService', () => {
  let service: AppService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        WinesComponent, 
        AppService,
        { provide: CookiesService, useValue: { getCookieUser: () => JSON.stringify({ uid: '12345' }), set: () => {} } }]
    });

    service = TestBed.inject(AppService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica che non ci siano chiamate HTTP in sospeso
  });

  it('should create the WinesComponent', () => {
    const fixture = TestBed.createComponent(WinesComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should fetch all wines and populate wines array', () => {
    const fixture = TestBed.createComponent(WinesComponent);
    const component = fixture.componentInstance;
  
    const mockWines: Wine[] = [
      { id: 1, wineryName: "Palmento Costanzo", name: "Chianti", color: "Rosso", winery: "TestWinery", grapes: [], soil: "", tastingDescription: "", denomination: "", productionZone: "", refinement: "", winemaking: "" },
      { id: 2, wineryName: "Palmento Costanzo", name: "Barolo", color: "Bianco", winery: "TestWinery", grapes: [], soil: "", tastingDescription: "", denomination: "", productionZone: "", refinement: "", winemaking: "" }
    ];
  
    jest.spyOn(service, 'getWines').mockReturnValue(of(mockWines));
  
    component.getAllWines();
    expect(component.wines.length).toBe(2);
    expect(component.wines).toEqual(mockWines);
  });

  it('should fetch wines', () => {
    const mockWines: Wine[] = [{ id: 1,
        wineryName: "Palmento Costanzo",
        grapes: [{nameGrape:"Nerello Mascalese", percentageGrape: 100}],
        soil: "soil",
        tastingDescription: "string",
        denomination: "string",
      productionZone: "string",
        refinement: "string",
        name: "Chianti",
        color: "string",
        winery: "string",
        winemaking: "string" 
      }, { id: 1,
        wineryName: "Palmento Costanzo",
        grapes: [{nameGrape:"Nerello Mascalese", percentageGrape: 100}],
        soil: "soil",
        tastingDescription: "string",
        denomination: "string",
      productionZone: "string",
        refinement: "string",
        name: "Barolo",
        color: "string",
        winery: "string",
        winemaking: "string" 
      }];

    service.getWines().subscribe(wines => {
      expect(wines.length).toBe(2);
      expect(wines).toEqual(mockWines);
    });

    // Simula una richiesta HTTP e restituisce il mock
    const req = httpMock.expectOne('/api/wines');
    expect(req.request.method).toBe('POST');
    req.flush(mockWines);
  });

  it('should filter wines by color', () => {
    const fixture = TestBed.createComponent(WinesComponent);
    const component = fixture.componentInstance;
  
    const mockWines: Wine[] = [
      { id: 1, wineryName: "Palmento Costanzo", name: "Chianti", color: "Rosso", winery: "TestWinery", grapes: [], soil: "", tastingDescription: "", denomination: "", productionZone: "", refinement: "", winemaking: "" }
    ];
  
    jest.spyOn(service, 'getWinesByColor').mockReturnValue(of(mockWines));
      
    component.filterColor = 'Rosso';
    component.filterColorWine();
  
    expect(component.wines.length).toBe(1);
    expect(component.wines[0].color).toBe('Rosso');
  });

  it('should filter wines by winery', () => {
    const fixture = TestBed.createComponent(WinesComponent);
    const component = fixture.componentInstance;
  
    const mockWines: Wine[] = [
      { id: 1, wineryName: "Palmento Costanzo", name: "Chianti", color: "Rosso", winery: "Cantina Test", grapes: [], soil: "", tastingDescription: "", denomination: "", productionZone: "", refinement: "", winemaking: "" }
    ];
  
    jest.spyOn(service, 'getWinesByWinery').mockReturnValue(of(mockWines));
  
    component.filterWinerySelect = 'Cantina Test';
    component.filterWinery();
  
    expect(component.wines.length).toBe(1);
    expect(component.wines[0].winery).toBe('Cantina Test');
  });
  
  it('should return correct wine icon based on color', () => {
    const fixture = TestBed.createComponent(WinesComponent);
    const component = fixture.componentInstance;
  
    const wineRed = { color: 'Rosso' } as WineTastingSheet;
    const wineWhite = { color: 'Bianco' } as WineTastingSheet;
    const wineRose = { color: 'Rosato' } as WineTastingSheet;
    const wineUnknown = { color: 'Blu' } as WineTastingSheet; // Caso non definito
  
    expect(component.getWineIcon(wineRed)).toBe('../../assets/images/red-wine.png');
    expect(component.getWineIcon(wineWhite)).toBe('../../assets/images/yellow-wine.png');
    expect(component.getWineIcon(wineRose)).toBe('../../assets/images/rose-wine.png');
    expect(component.getWineIcon(wineUnknown)).toBe(''); // Caso non definito
  });
  
});
