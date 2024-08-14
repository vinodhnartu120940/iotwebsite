import { Injectable } from '@angular/core';

import { APIEndPoints } from '../../../utils/api-endpoint';
import { ApiHttpService } from '../../../Services/api.http.service';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  constructor(private http: ApiHttpService) {}

  GetExpensesCategories() {
    return this.http.get(
      `${APIEndPoints.ExpensesManagement}/GetExpensesCategories`
    );
  }

  SaveExpensesNew(data: any) {
    return this.http.post(
      `${APIEndPoints.ExpensesManagement}/SaveExpensesNew`,
      data
    );
  }
  GetExpenses() {
    return this.http.get(`${APIEndPoints.ExpensesManagement}/GetExpenses`);
  }

  GetToatlRevenueAndExpenses() {
    return this.http.get(
      `${APIEndPoints.ExpensesManagement}/GetToatlRevenueAndExpenses`
    );
  }
  SaveCustomerBudget(budget:number){
    const data = {'budget':budget}
    return this.http.post(
      `${APIEndPoints.ExpensesManagement}/SaveCustomerBudget`,data
    );
  }
}
