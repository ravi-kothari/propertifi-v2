import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTwoComponent } from './search-two.component';

describe('SearchTwoComponent', () => {
  let component: SearchTwoComponent;
  let fixture: ComponentFixture<SearchTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
