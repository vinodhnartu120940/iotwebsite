import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent } from './tabs/tabs.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';


@NgModule({
  declarations: [
   
  ],
  imports: [
    CommonModule,
    PieChartComponent,
    TabsComponent,
    
  ],
  exports: [TabsComponent,PieChartComponent]
})
export class SharedModule { }
