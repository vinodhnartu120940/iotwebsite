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
      exp.workers?.reduce(
        (sum: any, worker: any) => sum + worker.totalCost,
        0
      ) || 0
    );
  }

  // Method to calculate total machinery cost
  getTotalMachineryCost(exp: any): number {
    return (
      exp.machinery?.reduce(
        (sum: any, machine: any) => sum + machine.totalCost,
        0
      ) || 0
    );
  }

  // Method to calculate total other expenses cost
  getTotalOtherExpensesCost(exp: any): number {
    return (
      exp.otherExpenses?.reduce(
        (sum: any, other: any) => sum + other.totalCost,
        0
      ) || 0
    );
  }
}
