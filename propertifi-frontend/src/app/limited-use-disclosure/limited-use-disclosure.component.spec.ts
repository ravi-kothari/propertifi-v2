import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitedUseDisclosureComponent } from './limited-use-disclosure.component';

describe('LimitedUseDisclosureComponent', () => {
  let component: LimitedUseDisclosureComponent;
  let fixture: ComponentFixture<LimitedUseDisclosureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LimitedUseDisclosureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LimitedUseDisclosureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
