import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { PredictDiseaseComponent } from './Pages/predict-disease/predict-disease.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SensordataComponent } from './Pages/sensordata/sensordata.component';




@NgModule({
  declarations: [
    UserComponent,
    DashboardComponent,
    PredictDiseaseComponent,
    SensordataComponent,

  ],
  imports: [
    CommonModule,
    UserRoutingModule,

  ]
})
export class UserModule { }
