import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { PieChartComponent } from '../../../shared/pie-chart/pie-chart.component';
import { CalendarService } from '../../Services/calendar.service';
import { formatISO, parseISO } from 'date-fns';
import { ExpenseService } from '../expense/expense.service';
import { NgIf } from '@angular/common';

Chart.register(...registerables);

@Component({
  selector: 'app-new-dashboard',
  standalone: true,
  imports: [PieChartComponent,NgIf],
  templateUrl: './new-dashboard.component.html',
  styleUrls: ['./new-dashboard.component.scss']
})
export class NewDashboardComponent implements OnInit {
  chart: Chart | undefined;
  CoffeeCycle: any;
  currentPhaseTitle: string = 'No current phase';
  isLoading: boolean = true;
  financialData: any;

  constructor(private expensiveService: ExpenseService, private cdr: ChangeDetectorRef, private calendarService:CalendarService) {
    this.expensiveService.GetToatlRevenueAndExpenses().subscribe((res) => {
      this.financialData = res;

      // Update pie chart data for expenses
      if (res.totalExpenses > 0) {
        this.expensePieChartData.labels = Object.keys(res.categorisedExpenses);
        this.expensePieChartData.datasets[0].data = Object.values(res.categorisedExpenses);
      } else {
        this.expensePieChartData.labels = ['No Data'];
        this.expensePieChartData.datasets[0].data = [1];
      }

      // Update pie chart data for revenues
      if (res.totalRevenue > 0) {
        this.revenuePieChartData.labels = Object.keys(res.categorisedRevenues);
        this.revenuePieChartData.datasets[0].data = Object.values(res.categorisedRevenues);
      } else {
        this.revenuePieChartData.labels = ['No Data'];
        this.revenuePieChartData.datasets[0].data = [1];
      }

      // Set loading to false
      this.isLoading = false;

      // Detect changes
      this.cdr.detectChanges();
    });
  }
  expensePieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#5E954E', '#D4E8CE', '#85C572'],
      },
    ],
  };

  revenuePieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#8A382B', '#B84A3A', '#FCB3A8'],
      },
    ],
  };

  expensePieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        align: 'start',
      },
      title: {
        display: true,
        text: 'Cash Out',
        font: {
          size: 36,
          weight: 'bold',
        },
      },
    },
  };
  revenuePieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        align: 'start',
        labels: {
          font: {
            size: 18,
          },
        },
      },
      title: {
        display: true,
        text: 'Cash In',
        font: {
          size: 36,
          weight: 'bold',
        },
      },
    },
  };

  pieChartHeight = 200;
  pieChartWidth = 400;


  ngOnInit() {
    this.calendarService.getCalendarEvents().subscribe((res:any) => {
      this.CoffeeCycle = res.calendarCommonEvents;
      this.updateCurrentMonthEventTitle();
    });
  }

  updateCurrentMonthEventTitle() {
    const currentDate = new Date();

    for (const event of this.CoffeeCycle) {
      const startDate = parseISO(event.start);
      const endDate = parseISO(event.end);

      if (currentDate >= startDate && currentDate <= endDate) {
        this.currentPhaseTitle = event.title;
        break;
      }
    }
  }
}
