import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFourComponent } from './search-four.component';

describe('SearchFourComponent', () => {
  let component: SearchFourComponent;
  let fixture: ComponentFixture<SearchFourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchFourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
