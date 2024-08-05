import { AfterViewInit, Component } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { PieChartComponent } from '../../../shared/pie-chart/pie-chart.component';
import { RouterLink } from '@angular/router';
import { ExpenseService } from '../../Pages/expense/expense.service';

@Component({
  selector: 'app-finances',
  standalone: true,
  imports: [PieChartComponent, RouterLink],
  templateUrl: './finances.component.html',
  styleUrl: './finances.component.scss',
})
export class FinancesComponent {
  financialData: any;
  pieChartWidth: number = 400;
  pieChartHeight: number = 300;
  constructor(private expensiveService: ExpenseService) {
    this.expensiveService.GetToatlRevenueAndExpenses().subscribe((res) => {
      this.financialData = res;
    });
  }

  pieChartData: ChartData<'pie'> = {
    // labels: ['Gross crop sale', 'Government subsidies', 'Other income'],
    labels: [],
    datasets: [
      {
        data: [800, 500, 100],
        backgroundColor: ['#5E954E', '#D4E8CE', '#85C572'],
      },
    ],
  };

  pieChartOptions: ChartOptions<'pie'> = {
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
}
