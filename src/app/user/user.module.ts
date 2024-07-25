import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { PredictDiseaseComponent } from './Pages/predict-disease/predict-disease.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { PredictDiseaseCopyComponent } from './Pages/predict-disease-one/predict-disease.component';
import { ProfileComponent } from './Pages/profile/profile.component';


@NgModule({
  declarations: [
    UserComponent,
    DashboardComponent,
    PredictDiseaseComponent,
    PredictDiseaseCopyComponent,   
    ProfileComponent
 ],
  imports: [CommonModule, UserRoutingModule, NgbModule],
  providers: [provideCharts(withDefaultRegisterables())],
})
export class UserModule {}
