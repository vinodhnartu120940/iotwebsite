import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { PieChartComponent } from '../../../shared/pie-chart/pie-chart.component';
import { CalendarService } from '../../Services/calendar.service';
import { formatISO, parseISO } from 'date-fns';
import { ExpenseService } from '../expense/expense.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { UserService } from '../../user.service';
import { thresholds } from '../../../utils/farm.data';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectLatestWeather } from '../../Store/selector/weather.selector';
import { map } from 'rxjs';
Chart.register(...registerables);

@Component({
  selector: 'app-new-dashboard',
  standalone: true,
  imports: [PieChartComponent, NgIf, NgFor, CommonModule, RouterLink],
  templateUrl: './new-dashboard.component.html',
  styleUrls: ['./new-dashboard.component.scss'],
})
export class NewDashboardComponent implements OnInit {
  chart: Chart | undefined;
  CoffeeCycle: any;
  currentPhaseTitle: string = 'No current phase';
  isLoading: boolean = true;
  financialData: any;
  pieChartHeight = 200;
  pieChartWidth = 400;
  sensorData: any;
  //threshold values;
  temperatureThresholds = thresholds.temperature;
  humidityThresholds = thresholds.humidity;
  moistureThresholds = thresholds.moisture;
  nitrogenThresholds = thresholds.nitrogen;
  phosphorusThresholds = thresholds.phosphorus;
  potassiumThresholds = thresholds.potassium;
  latestWeather$ = this.store
    .select(selectLatestWeather);
    

  ngOnInit() {
    this.getCalendarEvents();
    this.GetAllSensorsLatestData();
  }
  constructor(
    private expensiveService: ExpenseService,
    private calendarService: CalendarService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private store: Store
  ) {
    this.expensiveService.GetToatlRevenueAndExpenses().subscribe((res) => {
      this.financialData = res;

      // Update pie chart data for expenses
      if (res.totalExpenses > 0) {
        this.expensePieChartData.labels = Object.keys(res.categorisedExpenses);
        this.expensePieChartData.datasets[0].data = Object.values(
          res.categorisedExpenses
        );
      } else {
        this.expensePieChartData.labels = ['No Data'];
        this.expensePieChartData.datasets[0].data = [1];
      }

      // Update pie chart data for revenues
      if (res.totalRevenue > 0) {
        this.revenuePieChartData.labels = Object.keys(res.categorisedRevenues);
        this.revenuePieChartData.datasets[0].data = Object.values(
          res.categorisedRevenues
        );
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
        backgroundColor: ['#8A382B', '#B84A3A', '#FCB3A8'],
      },
    ],
  };

  revenuePieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#5E954E', '#D4E8CE', '#85C572'],
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

  getCalendarEvents() {
    this.calendarService.getCalendarEvents().subscribe((res: any) => {
      this.CoffeeCycle = res.calendarCommonEvents;
      this.updateCurrentMonthEventTitle();
    });
  }
  GetAllSensorsLatestData() {
    this.userService.GetAllSensorsLatestData().subscribe((res) => {
      this.sensorData = res;
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
  goToDetailView(sensor: any): void {
    this.router.navigate(['user/dashboard/sensor-data'], {
      state: { sensorData: sensor },
    });
  }

  date = new Date();
  formattedDate = this.date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: 'numeric',
  });
}
