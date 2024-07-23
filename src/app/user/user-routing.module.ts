import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SensordataComponent } from './Pages/sensordata/sensordata.component';
import { DashboardtwoComponent } from './Pages/dashboardtwo/dashboardtwo.component';
import { PredictDiseaseCopyComponent } from './Pages/predict-disease-one/predict-disease.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardtwoComponent,
    children: [
      {
        path: '',
        component: SensordataComponent,
        data: { title: 'Sensor Data' },
      },
      {
        path: 'predict',
        component: PredictDiseaseCopyComponent,
        data: { title: 'Coffe Plant Detection' },
      },
    ],
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
