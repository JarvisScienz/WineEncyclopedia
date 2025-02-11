import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomPhraseComponent } from './random-phrase.component';

describe('RandomPhraseComponent', () => {
  let component: RandomPhraseComponent;
  let fixture: ComponentFixture<RandomPhraseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RandomPhraseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RandomPhraseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
