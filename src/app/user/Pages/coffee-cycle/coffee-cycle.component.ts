import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TabsComponent } from '../../../shared/tabs/tabs.component';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { FinancesComponent } from '../../components/finances/finances.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-coffee-cycle',
  standalone: true,
  imports: [TabsComponent, FinancesComponent, CalendarComponent,RouterLink],
  templateUrl: './coffee-cycle.component.html',
  styleUrl: './coffee-cycle.component.scss'
})
export class CoffeeCycleComponent {
  // @ViewChild('calendar', { static: true }) calendar!: TemplateRef<any>;
  // @ViewChild('finances', { static: true }) finances!: TemplateRef<any>;

  // tabs = [
  //   { id: 'calendar', title: 'Calendar', component: CalendarComponent },
  //   // { id: 'finances', title: 'Finances', component: FinancesComponent }
  // ];
}
