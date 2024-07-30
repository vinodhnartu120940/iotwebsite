import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoffeeCycleComponent } from './coffee-cycle.component';

describe('CoffeeCycleComponent', () => {
  let component: CoffeeCycleComponent;
  let fixture: ComponentFixture<CoffeeCycleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoffeeCycleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoffeeCycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
