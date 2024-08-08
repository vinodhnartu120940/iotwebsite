import { Component } from '@angular/core';
import { ExpenseService } from '../expense.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-revenue-reports',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './revenue-reports.component.html',
  styleUrl: './revenue-reports.component.scss',
})
export class RevenueReportsComponent {
  revenues: any;
  constructor(private expenseService: ExpenseService) {
    this.expenseService.GetCustomerRevenues().subscribe((res) => {
      console.log(res);
      this.revenues = res;
    });
  }
}
