import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SensordataComponent } from './Pages/sensordata/sensordata.component';
import { DashboardtwoComponent } from './Pages/dashboard/dashboardtwo.component';
import { ProfileComponent } from './Pages/profile/profile.component';
import { PredictDiseaseComponent } from './Pages/predict-disease/predict-disease.component';
import { CoffeeCycleComponent } from './Pages/coffee-cycle/coffee-cycle.component';
import { RevenueComponent } from './Pages/revenue/revenue.component';
import { ExpenseComponent } from './Pages/expense/expense.component';
import { ExpenseReportComponent } from './Pages/expense/expense-report/expense-report.component';
import { RevenueReportsComponent } from './Pages/expense/revenue-reports/revenue-reports.component';
import { FinancesComponent } from './components/finances/finances.component';
import { NewDashboardComponent } from './Pages/new-dashboard/new-dashboard.component';
import { PestManagementComponent } from './Pages/pest-management/pest-management.component';
import { CropEducationComponent } from './Pages/crop-education/crop-education.component';
import { WeatherforecastComponent } from './Pages/weatherforecast/weatherforecast.component';
import { CashInComponent } from './Pages/expense/cash-in/cash-in.component';
import { CashOutComponent } from './Pages/expense/cash-out/cash-out.component';
import { YieldCalculatorComponent } from './Pages/yield-calculator/yield-calculator.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardtwoComponent,
    children: [
      {
        path: 'sensor-data',
        component: SensordataComponent,
        data: { title: 'Sensor Data' },
      },
      {
        path: '',
        component: NewDashboardComponent,
        data: { title: 'Dashboard' },
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
      {
        path: 'coffee-cycle',
        component: CoffeeCycleComponent,
        data: { title: 'Coffee-Cycle' },
      },
      {
        path: 'finance',
        component: FinancesComponent,
        data: { title: 'Finances' },
      },
      {
        path: 'expense',
        component: ExpenseComponent,
        data: { title: 'Expense' },
      },
      {
        path: 'expenses',
        component: ExpenseReportComponent,
        data: { title: 'Expenses' },
      },
      {
        path: 'revenue',
        component: RevenueReportsComponent,
        data: { title: 'Revenue' },
      },
      {
        path: 'pest-management',
        component: PestManagementComponent,
        data: { title: 'Pest Management' },
      },
      {
        path: 'crop-education',
        component: CropEducationComponent,
        data: { title: 'Crop Education' },
      },
      {
        path: 'weather',
        component: WeatherforecastComponent,
        data: { title: 'Weather Data' },
      },
      {path:'coffee-yield-calculator',
        component:YieldCalculatorComponent,
        data:{title:'Coffee Yield Calculator'}
      },
      {
        path: 'cash-in',
        component: CashInComponent,
        data: { title: 'Cash-In' },
      },
      {
        path: 'cash-out',
        component: CashOutComponent,
        data: { title: 'Cash-Out' },
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
