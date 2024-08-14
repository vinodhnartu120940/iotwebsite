import { AfterViewInit, Component, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { PieChartComponent } from '../../../shared/pie-chart/pie-chart.component';
import { RouterLink } from '@angular/router';
import { ExpenseService } from '../../Pages/expense/expense.service';
import { NgFor, NgIf } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, NgModel } from '@angular/forms';
import { NotificationService } from '../../../Services/notification.service';
@Component({
  selector: 'app-finances',
  standalone: true,
  imports: [PieChartComponent, RouterLink, NgIf,NgFor,FormsModule],
  templateUrl: './finances.component.html',
  styleUrls: ['./finances.component.scss'],
})
export class FinancesComponent implements AfterViewInit {
  financialData = {
    totalExpenses:0,
    totalRevenue:0,
    budget: 0 
  };
  pieChartWidth: number = 400;
  pieChartHeight: number = 300;
  isLoading: boolean = true;
  budgetAmount: number=0;
  originalBudgetAmount!: number;

  @ViewChild('budgetModal') budgetModal: ElementRef | undefined;
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
  modalTitle: string | undefined;

  constructor(
    private expensiveService: ExpenseService, 
    private cdr: ChangeDetectorRef, 
    private modalService: NgbModal,
    private notify:NotificationService
  ) {
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
        backgroundColor: ['#8A382B', '#B84A3A', '#FCB3A8'],
      },
    ],
  };

  // Pie chart data for revenues
  revenuePieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#5E954E', '#D4E8CE', '#85C572',],
      },
    ],
  };

  ngAfterViewInit() {
    // Trigger a resize event after view init to ensure the charts render correctly
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 500);
  }
  openModal(content: any, action: string) {
    if (action === 'Edit') {
      this.budgetAmount = this.financialData.budget;
      this.originalBudgetAmount = this.financialData.budget;
      this.modalTitle = 'Edit Budget';
    } else {
      this.budgetAmount = 0;
      this.modalTitle = 'Add Budget';
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  saveBudget(modal: any) {
    if (!this.budgetAmount || this.budgetAmount <= 0) {
      this.notify.showWarning('Input should not be empty or zero!');
      return;
    }

    if (this.modalTitle === 'Edit Budget' && this.budgetAmount === this.originalBudgetAmount) {
      this.notify.showWarning('No changes made to the budget!');
      return;
    }
    this.financialData.budget = this.budgetAmount;
    this.expensiveService.SaveCustomerBudget(this.budgetAmount).subscribe((res)=>{
      this.notify.showSuccess("Budget Amount Added successfully!");
    });
    console.log('Budget Amount:', this.budgetAmount);
    modal.close();
  }

  
}
