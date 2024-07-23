import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { PredictDiseaseComponent } from './Pages/predict-disease/predict-disease.component';
import { SensordataComponent } from './Pages/sensordata/sensordata.component';
import { PredictDiseaseCopyComponent } from './Pages/predict-disease-one/predict-disease.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    UserComponent,
    DashboardComponent,
    PredictDiseaseComponent,
    SensordataComponent,
    PredictDiseaseCopyComponent,
  ],
  imports: [CommonModule, UserRoutingModule, NgbModule],
})
export class UserModule {}
