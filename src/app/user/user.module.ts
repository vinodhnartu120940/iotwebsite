import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ProfileComponent } from './Pages/profile/profile.component';
import { PredictDiseaseComponent } from './Pages/predict-disease/predict-disease.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [UserComponent, PredictDiseaseComponent, ProfileComponent],
  imports: [CommonModule, UserRoutingModule, NgbModule,SharedModule],
  providers: [provideCharts(withDefaultRegisterables())],
})
export class UserModule {}
