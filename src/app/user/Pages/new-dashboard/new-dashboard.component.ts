import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { PieChartComponent } from '../../../shared/pie-chart/pie-chart.component';
import { CalendarService } from '../../Services/calendar.service';
import { formatISO, parseISO } from 'date-fns';
import { ExpenseService } from '../expense/expense.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { UserService } from '../../user.service';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectLatestWeather } from '../../Store/selector/weather.selector';
import { map } from 'rxjs';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
Chart.register(...registerables);

@Component({
  selector: 'app-new-dashboard',
  standalone: true,
  imports: [
    PieChartComponent,
    NgIf,
    NgFor,
    CommonModule,
    RouterLink,
    TranslateModule,
  ],
  templateUrl: './new-dashboard.component.html',
  styleUrls: ['./new-dashboard.component.scss'],
})
export class NewDashboardComponent implements OnInit {
  isPageLoading: boolean = true;
  isSensorDataLoading: boolean = true;
  isFinancialDataLoading: boolean = true;
  CoffeeCycle: any;
  currentPhaseTitle: string = 'No current phase';
  financialData: any;
  sensorData: any[] = [];
  latestWeather$ = this.store.select(selectLatestWeather);

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

  constructor(
    private expensiveService: ExpenseService,
    private calendarService: CalendarService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private store: Store,
    private translate: TranslateService
  ) {
    this.translate.addLangs(['en', 'kn', 'ta']);
    this.translate.setDefaultLang('en');
  }

  ngOnInit() {
    this.getCalendarEvents();
    this.GetAllSensorsLatestData();
    this.loadFinancialData();
  }

  loadFinancialData() {
    this.expensiveService.GetToatlRevenueAndExpenses().subscribe(
      (res) => {
        this.financialData = res;
        if (res.TotalExpenses > 0) {
          this.expensePieChartData.labels = Object.keys(
            res.CategorisedExpenses
          );
          this.expensePieChartData.datasets[0].data = Object.values(
            res.CategorisedExpenses
          );
        } else {
          this.expensePieChartData.labels = ['No Data'];
          this.expensePieChartData.datasets[0].data = [1];
        }

        // Update pie chart data for revenues
        if (res.TotalRevenue > 0) {
          this.revenuePieChartData.labels = Object.keys(
            res.CategorisedRevenues
          );
          this.revenuePieChartData.datasets[0].data = Object.values(
            res.CategorisedRevenues
          );
        } else {
          this.revenuePieChartData.labels = ['No Data'];
          this.revenuePieChartData.datasets[0].data = [1];
        }

        // Set financial data loading to false
        this.isFinancialDataLoading = false;
        this.checkIfPageLoadingComplete();
      },
      (error) => {
        console.error('Error fetching financial data:', error);
        this.isFinancialDataLoading = false; // Ensure loading state is updated
        this.checkIfPageLoadingComplete();
      }
    );
  }

  GetAllSensorsLatestData() {
    this.userService.GetAllSensorsLatestData().subscribe(
      (res: any) => {
        this.sensorData = res;
        console.log(this.sensorData); // For debugging, check if data is available

        // Set sensor data loading to false
        this.isSensorDataLoading = false;
        this.checkIfPageLoadingComplete();
      },
      (error) => {
        console.error('Error fetching sensor data:', error);
        this.isSensorDataLoading = false; // Ensure loading state is updated
        this.checkIfPageLoadingComplete();
      }
    );
  }

  checkIfPageLoadingComplete() {
    if (!this.isFinancialDataLoading && !this.isSensorDataLoading) {
      this.isPageLoading = false;
      this.cdr.detectChanges();
    }
  }

  getCalendarEvents() {
    this.calendarService.getCalendarEvents().subscribe((res: any) => {
      this.CoffeeCycle = res?.CalendarCommonEvents;
      this.updateCurrentMonthEventTitle();
    });
  }

  // updateCurrentMonthEventTitle() {
  //   const currentDate = new Date();

  //   for (const event of this.CoffeeCycle) {
  //     const startDate = parseISO(event.start);
  //     const endDate = parseISO(event.end);

  //     if (currentDate >= startDate && currentDate <= endDate) {
  //       this.currentPhaseTitle = event.title;
  //       break;
  //     }
  //   }
  // }

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

  changeLanguage(lang: any) {
    this.translate.use(lang.value);
  }

  updateCurrentMonthEventTitle() {
    const currentDate = new Date();
    for (const event of this.CoffeeCycle) {
      const startDate = parseISO(event?.Start);
      const endDate = parseISO(event?.End);

      if (currentDate >= startDate && currentDate <= endDate) {
        this.currentPhaseTitle = this.translate.instant(
          `DASHBOARD.${event?.Title.toUpperCase()}`
        );
        break;
      }
    }
  }
}
