import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './Pages/dashboard/dashboard.component';
import { PredictDiseaseComponent } from './Pages/predict-disease/predict-disease.component';
import { UserComponent } from './user.component';
import { SensordataComponent } from './Pages/sensordata/sensordata.component';


const routes: Routes = [
  {
    path: 'dashboard', component: DashboardComponent, children: [
      { path: "", component: SensordataComponent, data: { title: 'Sensor Readings' } }, {
        path: 'predict', component: PredictDiseaseComponent, data: { title: "Coffe Plant Detection" }
      }
    ]
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },


];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule { }
