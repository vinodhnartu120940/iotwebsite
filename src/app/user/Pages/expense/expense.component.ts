import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ExpenseService } from './expense.service';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { ExpenseReportComponent } from './expense-report/expense-report.component';
import { RevenueReportsComponent } from "./revenue-reports/revenue-reports.component";

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
  imports: [ReactiveFormsModule, NgFor, NgIf, ExpenseReportComponent, RevenueReportsComponent],
  standalone: true,
})
export class ExpenseComponent implements OnInit {
  financeData: any;

  constructor(private expenseService: ExpenseService, private router: Router) {
    this.expenseService.GetToatlRevenueAndExpenses().subscribe((res) => {
      this.financeData = res;
    });
  }

  ngOnInit(): void {}

  goToCategoryScreen() {
    this.router.navigateByUrl('/user/dashboard/cash-in');
  }
  goToCashout() {
    this.router.navigateByUrl('/user/dashboard/cash-out');
  }
}
