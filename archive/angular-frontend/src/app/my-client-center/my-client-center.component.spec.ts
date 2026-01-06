import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyClientCenterComponent } from './my-client-center.component';

describe('MyClientCenterComponent', () => {
  let component: MyClientCenterComponent;
  let fixture: ComponentFixture<MyClientCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyClientCenterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyClientCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
