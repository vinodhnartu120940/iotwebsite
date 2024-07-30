import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent } from './tabs/tabs.component';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TabsComponent
  ],
  exports: [TabsComponent]
})
export class SharedModule { }
