import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ExpenseService } from '../expense.service';
import { NotificationService } from '../../../../Services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cash-in',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, NgIf],
  templateUrl: './cash-in.component.html',
  styleUrl: './cash-in.component.scss',
})
export class CashInComponent implements OnInit {
  revenueForm!: FormGroup;
  revunueCategories: any;
  grandTotal: number = 0;
  selectedCategory: any;
  showLogCashIn: boolean = false;
  constructor(
    private fb: FormBuilder,
    private expenseServie: ExpenseService,
    private notificationService: NotificationService,
    private route: Router
  ) {}
  ngOnInit(): void {
    this.expenseServie.GetRevenueCategories().subscribe((res) => {
      this.revunueCategories = res;
    });
    this.revenueForm = this.fb.group({
      categoryId: [''],
      categoryName: [''],
      date: ['', Validators.required],
      quanity: ['', Validators.required],
      price: ['', Validators.required],
      revenueName: [''],
      amount: [],
    });

    // Calculate Grand Total whenever quantity or price changes
    this.revenueForm.get('quanity')!.valueChanges.subscribe(() => {
      this.calculateGrandTotal();
    });

    this.revenueForm.get('price')!.valueChanges.subscribe(() => {
      this.calculateGrandTotal();
    });
  }

  goToCardsScreen() {
    if (this.showLogCashIn) {
      this.showLogCashIn = false;
    } else {
      this.route.navigateByUrl('/user/dashboard/expense');
    }
  }

  calculateGrandTotal(): void {
    const quantity = this.revenueForm.get('quanity')?.value || 0;
    const price = this.revenueForm.get('price')?.value || 0;
    this.grandTotal = quantity * price;
  }

  goToRevenueScreen(category: any) {
    this.selectedCategory = category;
    this.revenueForm.patchValue({
      categoryId: category?.RevenueId,
      categoryName: category?.RevenueName,
    });
    this.showLogCashIn = true;
  }

  onRevenueSave() {
    const {
      categoryId,
      categoryName,
      date,
      quanity,
      price,
      revenueName,
      amount,
    } = this.revenueForm.value;

    let payload: any = {};

    if (this.selectedCategory.RevenueName === 'Harvested and sold') {
      payload.harvestedAndSold = [
        {
          categoryId: categoryId,
          categoryName: categoryName,
          quantity: quanity,
          quantityUnits: 'kg',
          price: price,
          priceUnits: 'per kg',
          date: new Date(date).toISOString(),
          total: this.grandTotal,
        },
      ];
      payload.revenueDetails = [];
    } else if (this.selectedCategory.RevenueName === 'Revenue details') {
      payload.revenueDetails = [
        {
          categoryId: categoryId,
          categoryName: categoryName,
          revenueName: revenueName,
          amount: amount,
          date: new Date(date).toISOString(),
          total: amount ?? 0,
        },
      ];
      payload.harvestedAndSold = [];
    }

    this.expenseServie.SaveCustomerRevenueNew(payload).subscribe(
      (res) => {
        console.log('Revenue saved successfully:', res);
        if (res.status == 'Success') {
          this.notificationService.showSuccess('Revenue saved successfully');
          this.route.navigateByUrl('/user/dashboard/expense');
        }
      },
      (error) => {
        console.error('Error saving revenue:', error);
      }
    );
  }
}
