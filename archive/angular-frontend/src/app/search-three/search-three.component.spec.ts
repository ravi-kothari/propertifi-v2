import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchThreeComponent } from './search-three.component';

describe('SearchThreeComponent', () => {
  let component: SearchThreeComponent;
  let fixture: ComponentFixture<SearchThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchThreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
