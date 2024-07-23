import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictDiseaseCopyComponent } from './predict-disease.component';
import { PredictDiseaseComponent } from '../predict-disease/predict-disease.component';

describe('PredictDiseaseComponent', () => {
  let component: PredictDiseaseComponent;
  let fixture: ComponentFixture<PredictDiseaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PredictDiseaseComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PredictDiseaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
