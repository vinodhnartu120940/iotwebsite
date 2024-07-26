import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardtwoComponent } from './dashboardtwo.component';

describe('DashboardtwoComponent', () => {
  let component: DashboardtwoComponent;
  let fixture: ComponentFixture<DashboardtwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardtwoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardtwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
