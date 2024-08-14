import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ExpenseService } from './expense.service';
import { NotificationService } from '../../../Services/notification.service';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { ExpenseReportComponent } from "./expense-report/expense-report.component";

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
  imports: [ReactiveFormsModule, NgFor, NgIf, ExpenseReportComponent],
  standalone: true,
})
export class ExpenseComponent implements OnInit {
  expenseForm!: FormGroup;
  revenueForm!: FormGroup;
  grandTotal: number = 0;
  categories: any;
  subcategories: any;
  financeData:any;
  dynamicFormCards: {
    category: string;
    event: string;
    formGroups: FormGroup[];
  }[] = [];
  currentScreen:
    | 'cards'
    | 'category'
    | 'expenseForm'
    | 'revenuecategory'
    | 'revenueForm' = 'cards';
  activityEvents: any = {
    Workers: [
      {
        field: 'NO of workers',
        type: 'number',
        placeholder: 'Enter number of workers',
      },
      {
        field: 'Cost per worker',
        type: 'number',
        placeholder: 'Enter cost per worker',
      },
    ],
    Machinery: [
      {
        field: 'NO of machines',
        type: 'number',
        placeholder: 'Enter number of machines',
      },
      {
        field: 'Cost per machine',
        type: 'number',
        placeholder: 'Enter cost per machine',
      },
    ],
    'Other Expenses': [
      {
        field: 'expense name',
        type: 'text',
        placeholder: 'Enter expense name',
      },
      {
        field: 'cost',
        type: 'number',
        placeholder: 'Enter cost',
      },
    ],
    Duration: [
      {
        field: 'hours',
        type: 'dropdown',
        options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        placeholder: 'Select hours',
      },
      {
        field: 'minutes',
        type: 'dropdown',
        options: [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
          21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
          38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54,
          55, 56, 57, 58, 59, 60,
        ],
        placeholder: 'Select minutes',
      },
    ],
    'Fertilizer Details': [
      {
        field: 'fertilizer name',
        type: 'text',
        placeholder: 'Enter fertilizer name',
      },
      {
        field: 'Quantity',
        type: 'number',
        placeholder: 'Enter quantity',
      },
      {
        field: 'units',
        type: 'dropdown',
        options: ['kg', 'g', 'lb', 'oz', 'liters', 'ml'],
        placeholder: 'Select unit',
      },
      {
        field: 'cost',
        type: 'number',
        placeholder: 'Enter cost',
      },
    ],
    'Spray Details': [
      {
        field: 'Spray name',
        type: 'text',
        placeholder: 'Enter spray name',
      },
      {
        field: 'Quantity',
        type: 'number',
        placeholder: 'Enter quantity',
      },
      {
        field: 'units',
        type: 'dropdown',
        options: ['ml', 'liters', 'gallons', 'oz'],
        placeholder: 'Select unit',
      },
      {
        field: 'cost',
        type: 'number',
        placeholder: 'Enter cost',
      },
    ],
    Quantity: [
      {
        field: 'Quantity',
        type: 'number',
        placeholder: 'Enter quantity',
      },
      {
        field: 'units',
        type: 'dropdown',
        options: ['kg', 'g', 'lb', 'oz'],
        placeholder: 'Select unit',
      },
    ],
    'Cost of mulch': [
      {
        field: 'cost',
        type: 'number',
        placeholder: 'Enter cost',
      },
    ],
    Attachments: {
      field: 'document attachment',
      type: 'file',
      placeholder: 'Upload document',
    },
  };
  revunueCategories: any;
  revenueFormType: boolean = false;
  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.expenseService.GetExpensesCategories().subscribe((res) => {
      this.categories = res;
    });
    this.expenseService.GetToatlRevenueAndExpenses().subscribe((res)=>{
      this.financeData = res;
    })
    this.expenseService.GetRevenueCategories().subscribe((res) => {
      this.revunueCategories = res;
    });
  }

  // Method to calculate grand total
  calculateGrandTotal(): void {
    const quantity = this.revenueForm.get('quanity')?.value || 0;
    const price = this.revenueForm.get('price')?.value || 0;
    this.grandTotal = quantity * price;
  }
  ngOnInit(): void {
    this.expenseForm = this.fb.group({
      date: ['', Validators.required],
      category: ['', Validators.required],
      event: ['', Validators.required],
      notes: [''],
      receipt: [null],
      categoryId: [''],
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

    this.expenseForm.get('event')!.valueChanges.subscribe(() => {
      this.addNewCard();
    });
    // Calculate Grand Total whenever quantity or price changes
    this.revenueForm.get('quanity')!.valueChanges.subscribe(() => {
      this.calculateGrandTotal();
    });

    this.revenueForm.get('price')!.valueChanges.subscribe(() => {
      this.calculateGrandTotal();
    });
  }

  goToCategoryScreen(data: any) {
    this.currentScreen = data;
  }

  goToCardsScreen() {
    this.currentScreen = 'cards';
  }

  gotoExpenseScreen(category: any) {
    this.currentScreen = 'expenseForm';
    this.expenseForm.patchValue({
      category: category.name,
      categoryId: category.id,
    });
    this.subcategories = category.subCategory;
  }

  getFields(event: string) {
    return this.activityEvents[event] ? this.activityEvents[event] : [];
  }

  addNewCard() {
    const category = this.expenseForm.get('category')!.value;
    const event = this.expenseForm.get('event')!.value;
    if (category && event) {
      const formGroups = [];
      formGroups.push(this.createFormGroup(event));

      // Add the new card to the list if it doesn't exist
      const existingCardIndex = this.dynamicFormCards.findIndex(
        (card) => card.category === category && card.event === event
      );

      if (existingCardIndex === -1) {
        this.dynamicFormCards.unshift({
          category: category,
          event: event,
          formGroups: formGroups,
        });
      }
    }
  }

  createFormGroup(event: string): FormGroup {
    const fields = this.getFields(event);
    const formGroup = this.fb.group({});

    fields.forEach((field: any) => {
      let control;

      if (field.type === 'number') {
        control = this.fb.control('', [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
        ]);
      } else if (field.type === 'date') {
        control = this.fb.control('', Validators.required);
      } else if (field.type === 'text') {
        control = this.fb.control('', Validators.required);
      } else if (field.type === 'dropdown') {
        control = this.fb.control('', Validators.required);
      } else if (field.type === 'file') {
        control = this.fb.control(null, Validators.required);
      } else {
        control = this.fb.control('', Validators.required);
      }

      formGroup.addControl(field.field, control);
    });

    return formGroup;
  }

  addFormGroup(category: string, event: string) {
    const card = this.dynamicFormCards.find(
      (c) => c.category === category && c.event === event
    );
    if (card) {
      card.formGroups.push(this.createFormGroup(event));
    }
  }

  removeFormGroup(cardIndex: number, formGroupIndex: number) {
    if (this.dynamicFormCards[cardIndex].formGroups.length > 1) {
      this.dynamicFormCards[cardIndex].formGroups.splice(formGroupIndex, 1);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.expenseForm.patchValue({ receipt: file });
  }

  onSubmit() {
    let totalConsolidatedCost = 0;

    const formData = {
      ...this.expenseForm.value,
      dynamicGroups: this.dynamicFormCards.map((card) => ({
        category: card.category,
        event: card.event,
        formGroups: card.formGroups.map((group) => group.value),
        totalCost: this.calculateTotalCost(card),
      })),
    };

    const apiPayload: any = {
      categoryId: formData.categoryId,
      categoryName: formData.category,
      categoryDate: formData.date,
      irrigationDuration: {
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
      observations: formData.notes,
      attachments: formData.receipt ? formData.receipt.name : '',
      categorySubExpenses: [],
      workers: [],
      machinery: [],
      otherExpenses: [],
      totalCost: '0',
    };

    formData.dynamicGroups.forEach((group: any) => {
      const addToPayload = (key: string, data: any) => {
        apiPayload[key].push(data);
      };

      group.formGroups.forEach((item: any) => {
        const mapping: any = {
          Workers: {
            key: 'workers',
            data: {
              noOfWorkers: parseFloat(item['NO of workers']) || 0,
              costPerWorker: parseFloat(item['Cost per worker']) || 0,
              totalCost:
                (parseFloat(item['NO of workers']) || 0) *
                (parseFloat(item['Cost per worker']) || 0),
            },
          },
          Machinery: {
            key: 'machinery',
            data: {
              noOfMachines: parseFloat(item['NO of machines']) || 0,
              costPerMachine: parseFloat(item['Cost per machine']) || 0,
              totalCost:
                (parseFloat(item['NO of machines']) || 0) *
                (parseFloat(item['Cost per machine']) || 0),
            },
          },
          'Other Expenses': {
            key: 'otherExpenses',
            data: {
              expense: item['expense name'],
              cost: parseFloat(item['cost']) || 0,
              totalCost: parseFloat(item['cost']) || 0,
            },
          },
          'Fertilizer Details': {
            key: 'categorySubExpenses',
            data: {
              name: item['fertilizer name'],
              quantity: parseFloat(item['Quantity']) || 0,
              units: item['units'],
              cost: parseFloat(item['cost']) || 0,
            },
          },
          'Spray Details': {
            key: 'categorySubExpenses',
            data: {
              name: item['Spray name'],
              quantity: parseFloat(item['Quantity']) || 0,
              units: item['units'],
              cost: parseFloat(item['cost']) || 0,
            },
          },
          Duration: {
            key: 'irrigationDuration',
            data: {
              hours: parseInt(item['hours'], 10) || 0,
              minutes: parseInt(item['minutes'], 10) || 0,
              seconds: 0,
            },
          },
        };

        if (mapping[group.event]) {
          if (group.event === 'Duration') {
            apiPayload.irrigationDuration = mapping[group.event].data;
          } else {
            addToPayload(mapping[group.event].key, mapping[group.event].data);
            totalConsolidatedCost += mapping[group.event].data.totalCost;
          }
        }
      });
    });

    // Convert the totalConsolidatedCost to a string for the payload
    apiPayload.totalCost = totalConsolidatedCost.toFixed(2);

    // Call the API with the constructed payload
    this.expenseService.SaveExpensesNew(apiPayload).subscribe({
      next: (response: any) => {
        if (response?.status === 'Success') {
          this.router.navigateByUrl('/user/dashboard/expenses');
        }
        console.log(response);
      },
      error: (error: any) => {
        console.error('Error occurred:', error);
      },
    });
  }

  cancel() {
    this.expenseForm.reset();
    this.dynamicFormCards = [];
    this.currentScreen = 'category';
  }

  calculateTotalCost(card: any): number {
    let totalCost = 0;

    card.formGroups.forEach((formGroup: FormGroup) => {
      Object.keys(formGroup.controls).forEach((field) => {
        const value = formGroup.get(field)?.value;

        if (value !== null && value !== undefined && value !== '') {
          if (['cost', 'Cost per worker', 'Cost per machine'].includes(field)) {
            const parsedValue = parseFloat(value);
            if (!isNaN(parsedValue)) {
              totalCost += parsedValue;
            }
          } else if (field === 'NO of workers') {
            const wage = parseFloat(
              formGroup.get('Cost per worker')?.value || '0'
            );
            const workerCount = parseFloat(value);
            if (!isNaN(workerCount) && !isNaN(wage)) {
              totalCost += workerCount * wage;
            }
          } else if (field === 'NO of machines') {
            const machineCost = parseFloat(
              formGroup.get('Cost per machine')?.value || '0'
            );
            const machineCount = parseFloat(value);
            if (!isNaN(machineCount) && !isNaN(machineCost)) {
              totalCost += machineCount * machineCost;
            }
          }
        }
      });
    });

    return totalCost;
  }

  goToRevenueScreen(category: any) {
    debugger;
    this.currentScreen = 'revenueForm';
    this.revenueForm.patchValue({
      categoryId: category.revenueId,
      categoryName: category.revenueName,
    });
    if (category && category.revenueName == 'Revenue details') {
      this.revenueFormType = true;
    } else {
      this.revenueFormType = false;
    }

    console.log(category);
  }

  onRevenueSave() {
    // console.log(this.revenueForm.value);
    // const data = [
    //   {
    //     revenueCategoryId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    //     revenueCategoryName: 'string',
    //     name: 'string',
    //     price: 0,
    //     priceUnits: 'string',
    //     quantity: 0,
    //     quantityUnits: 'string',
    //     date: new Date().toISOString(), // Use the current date and time
    //     total: 0,
    //     activityTotal: 0,
    //   },
    // ];
    const {
      categoryId,
      categoryName,
      date,
      quanity,
      price,
      revenueName,
      amount,
    } = this.revenueForm.value;

    const data = [
      {
        revenueCategoryId: categoryId,
        revenueCategoryName: categoryName,
        name: revenueName,
        price: price,
        priceUnits: 'your-price-unit-here', // You need to specify or derive this value
        quantity: quanity,
        quantityUnits: 'your-quantity-unit-here', // You need to specify or derive this value
        date: new Date(date).toISOString(), // Convert date to ISO string
        total: amount ?? 0,
        activityTotal: this.grandTotal, // Or calculate differently if needed
      },
    ];

    this.expenseService.SaveCustomerRevenue(data).subscribe(
      (res) => {
        // Handle the response here
        console.log('Revenue saved successfully:', res);
        this.notificationService.showSuccess('Revenue saved successfully');
      },
      (error) => {
        // Handle any errors here
        console.error('Error saving revenue:', error);
      }
    );
  }
}
