import { Component } from '@angular/core';
import { ExpenseService } from '../expense.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-expense-report',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './expense-report.component.html',
  styleUrl: './expense-report.component.scss',
})
export class ExpenseReportComponent {
  expenses: any;

  constructor(private expenseService: ExpenseService) {
    this.expenseService.GetExpenses().subscribe((res) => {
      console.log(res);
      this.expenses = res;
    });
  }

  // Method to calculate total worker cost
  getTotalWorkerCost(exp: any): number {
    return (
      exp.Workers?.reduce(
        (sum: any, worker: any) => sum + worker.TotalCost,
        0
      ) || 0
    );
  }

  getTotalMachineryCost(exp: any): number {
    return (
      exp.Machinery?.reduce(
        (sum: any, machine: any) => sum + machine.TotalCost,
        0
      ) || 0
    );
  }

  getTotalOtherExpensesCost(exp: any): number {
    return (
      exp.OtherExpenses?.reduce(
        (sum: any, other: any) => sum + other.TotalCost,
        0
      ) || 0
    );
  }
}
