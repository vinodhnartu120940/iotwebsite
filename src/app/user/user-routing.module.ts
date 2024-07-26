import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SensordataComponent } from './Pages/sensordata/sensordata.component';
import { DashboardtwoComponent } from './Pages/dashboard/dashboardtwo.component';
import { ProfileComponent } from './Pages/profile/profile.component';
import { PredictDiseaseComponent } from './Pages/predict-disease/predict-disease.component';

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
        component: PredictDiseaseComponent,
        data: { title: 'Coffe Leaf Disease Detection' },
      },
      {
        path: 'my-account',
        component: ProfileComponent,
        data: { title: 'My Account' },
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
