import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFiveComponent } from './search-five.component';

describe('SearchFiveComponent', () => {
  let component: SearchFiveComponent;
  let fixture: ComponentFixture<SearchFiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchFiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
