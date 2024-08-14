import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../expense.service';
import { NgFor, NgIf } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { activityEvents } from '../../../../utils/cash-out.activityevents';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cash-out',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, NgIf],
  templateUrl: './cash-out.component.html',
  styleUrl: './cash-out.component.scss',
})
export class CashOutComponent implements OnInit {
  categories: any;
  expenseForm!: FormGroup;
  subcategories: any;
  dynamicFormCards: {
    category: string;
    event: string;
    formGroups: FormGroup[];
  }[] = [];
  activityEvents: any = activityEvents;
  showLogCashOut: boolean = false;
  constructor(
    private expenseService: ExpenseService,
    private fb: FormBuilder,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.expenseForm = this.fb.group({
      date: ['', Validators.required],
      category: ['', Validators.required],
      event: ['', Validators.required],
      notes: [''],
      receipt: [null],
      categoryId: [''],
    });
    this.expenseService.GetExpensesCategories().subscribe((res) => {
      this.categories = res;
    });
    this.expenseForm.get('event')!.valueChanges.subscribe(() => {
      this.addNewCard();
    });
  }

  goToCardsScreen() {
    if (this.showLogCashOut) {
      this.showLogCashOut = false;
    } else {
      this.router.navigateByUrl('/user/dashboard/expense');
    }
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

  gotoExpenseScreen(category: any) {
    this.showLogCashOut = true;
    this.expenseForm.patchValue({
      category: category.name,
      categoryId: category.id,
    });
    this.subcategories = category.subCategory;
  }
  getFields(event: string) {
    return this.activityEvents[event] ? this.activityEvents[event] : [];
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.expenseForm.patchValue({ receipt: file });
  }

  removeFormGroup(cardIndex: number, formGroupIndex: number) {
    if (this.dynamicFormCards[cardIndex].formGroups.length > 1) {
      this.dynamicFormCards[cardIndex].formGroups.splice(formGroupIndex, 1);
    }
  }

  addFormGroup(category: string, event: string) {
    const card = this.dynamicFormCards.find(
      (c) => c.category === category && c.event === event
    );
    if (card) {
      card.formGroups.push(this.createFormGroup(event));
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
      categoryDate: new Date(formData.date).toISOString(),
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
          this.router.navigateByUrl('/user/dashboard/expense');
        }
        console.log(response);
      },
      error: (error: any) => {
        console.error('Error occurred:', error);
      },
    });
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
  cancel() {
    this.expenseForm.reset();
    this.dynamicFormCards = [];
    this.showLogCashOut = false;
  }
}
