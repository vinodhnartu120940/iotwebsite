import { AfterViewInit, Component, ChangeDetectorRef } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { PieChartComponent } from '../../../shared/pie-chart/pie-chart.component';
import { RouterLink } from '@angular/router';
import { ExpenseService } from '../../Pages/expense/expense.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-finances',
  standalone: true,
  imports: [PieChartComponent, RouterLink, NgIf,NgFor],
  templateUrl: './finances.component.html',
  styleUrls: ['./finances.component.scss'],
})
export class FinancesComponent implements AfterViewInit {
  financialData: any;
  pieChartWidth: number = 400;
  pieChartHeight: number = 300;
  isLoading: boolean = true;

  expensePieChartOptions: ChartOptions<'pie'> = {
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
        text: 'Coffee Crop Expenses',
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
        text: 'Coffee Crop Revenue',
        font: {
          size: 36,
          weight: 'bold',
        },
      },
    },
  };

  constructor(private expensiveService: ExpenseService, private cdr: ChangeDetectorRef) {
    this.expensiveService.GetToatlRevenueAndExpenses().subscribe((res) => {
      this.financialData = res;
      console.log(res);

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

  // Pie chart data for expenses
  expensePieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#5E954E', '#D4E8CE', '#85C572'],
      },
    ],
  };

  // Pie chart data for revenues
  revenuePieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#8A382B', '#B84A3A', '#FCB3A8'],
      },
    ],
  };

  ngAfterViewInit() {
    // Trigger a resize event after view init to ensure the charts render correctly
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 500);
  }
}
