import { CurrencyPipe, KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ExpenseService } from './expense.service';
import { NotificationService } from '../../../Services/notification.service';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf, KeyValuePipe, CurrencyPipe],
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
})
export class ExpenseComponent implements OnInit {
  expenseForm!: FormGroup;
  categoryScreen: boolean = false;
  categories: any;
  subcategories: any;
  dynamicFormCards: {
    category: string;
    event: string;
    formGroups: FormGroup[];
  }[] = [];

  gotoExpenseScreen(category: any) {
    this.categoryScreen = true;
    this.expenseForm.patchValue({
      category: category.name,
      categoryId: category.id,
    });
    this.subcategories = category.subCategory;
  }

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

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private notificationServie: NotificationService
  ) {
    this.expenseService.GetExpensesCategories().subscribe((res) => {
      this.categories = res;
    });
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

    this.expenseForm.get('event')!.valueChanges.subscribe(() => {
      this.addNewCard();
    });
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
      let control: FormControl;

      if (field.type === 'number') {
        control = new FormControl('', [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
        ]);
      } else if (field.type === 'date') {
        control = new FormControl('', Validators.required);
      } else if (field.type === 'text') {
        control = new FormControl('', Validators.required);
      } else if (field.type === 'dropdown') {
        control = new FormControl('', Validators.required);
      } else if (field.type === 'file') {
        control = new FormControl(null, Validators.required);
      } else {
        control = new FormControl('', Validators.required);
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
    let totalConsolidatedCost = 0; // Variable to accumulate total cost

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
      categoryId: formData.categoryId, // Replace with actual data or logic
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
      totalCost: formData.dynamicGroups
        .reduce((sum: any, group: any) => sum + group.totalCost, 0)
        .toString(),
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
              noOfWorkers: item['NO of workers'],
              costPerWorker: item['Cost per worker'],
              totalCost: item['NO of workers'] * item['Cost per worker'],
            },
          },
          Machinery: {
            key: 'machinery',
            data: {
              noOfMachines: item['NO of machines'],
              costPerMachine: item['Cost per machine'],
              totalCost: item['NO of machines'] * item['Cost per machine'],
            },
          },
          'Other Expenses': {
            key: 'otherExpenses',
            data: {
              expense: item['expense name'],
              cost: item['cost'],
              totalCost: item['cost'],
            },
          },
          'Fertilizer Details': {
            key: 'categorySubExpenses',
            data: {
              name: item['fertilizer name'],
              quantity: item['Quantity'],
              units: item['units'],
              cost: item['cost'],
            },
          },
          'Spray Details': {
            key: 'categorySubExpenses',
            data: {
              name: item['Spray name'],
              quantity: item['Quantity'],
              units: item['units'],
              cost: item['cost'],
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
          }
        }

        // Accumulate total cost
        totalConsolidatedCost += group.totalCost;
      });
    });

    // Update the total consolidated cost in the payload
    apiPayload.totalCost = totalConsolidatedCost.toString();

    // Call the API with the constructed payload
    this.expenseService.SaveExpensesNew(apiPayload).subscribe(
      (response) => {
        console.log('API Response:', response);
        this.cancel(); // Clear the form after saving
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }

  cancel() {
    this.expenseForm.reset();
    this.dynamicFormCards = [];
  }

  calculateTotalCost(card: any): number {
    let totalCost = 0;

    card.formGroups.forEach((formGroup: FormGroup) => {
      Object.keys(formGroup.controls).forEach((field) => {
        const value = formGroup.get(field)?.value;

        // Ensure that the field names and types match your form controls
        if (['cost', 'Cost per worker', 'Cost per machine'].includes(field)) {
          totalCost += parseFloat(value || 0);
        } else if (field === 'NO of workers') {
          const wage = parseFloat(formGroup.get('Cost per worker')?.value || 0);
          totalCost += parseFloat(value || 0) * wage;
        } else if (field === 'NO of machines') {
          const machineCost = parseFloat(
            formGroup.get('Cost per machine')?.value || 0
          );
          totalCost += parseFloat(value || 0) * machineCost;
        }
      });
    });

    return totalCost;
  }
}
