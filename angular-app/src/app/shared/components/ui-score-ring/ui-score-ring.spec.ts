import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiScoreRing } from './ui-score-ring';

describe('UiScoreRing', () => {
  let component: UiScoreRing;
  let fixture: ComponentFixture<UiScoreRing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiScoreRing]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiScoreRing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
