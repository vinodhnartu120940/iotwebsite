import { Component } from '@angular/core';
import { ExpenseService } from '../expense.service';

@Component({
  selector: 'app-expense-report',
  standalone: true,
  imports: [],
  templateUrl: './expense-report.component.html',
  styleUrl: './expense-report.component.scss',
})
export class ExpenseReportComponent {
  constructor(private expenseService: ExpenseService) {
    this.expenseService.GetExpenses().subscribe((res) => {
      console.log(res);
    });
  }
}
