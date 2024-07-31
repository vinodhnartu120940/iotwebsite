import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.scss',
})
export class ExpenseComponent implements OnInit {
  expenseForm!: FormGroup;
  dynamicFormCards: { category: string; event: string; formGroups: FormGroup[] }[] = [];
  categories = [
    'Irrigation',
    'Fertigation',
    'Machine',
    'Pruning',
    'Weeding',
    'Scouting',
    'Ploughing',
    'Sprays',
    'Harvesting',
    'Transplant',
    'Mulching',
    'Inventory Purchase',
  ];
  activityEvents: any = {
    Irrigation: {
      Watering: ['Water Source', 'Duration (hours)', 'Water Used (liters)', 'Cost'],
      'Pump Maintenance': ['Pump Type', 'Maintenance Date', 'Cost', 'Technician'],
      'Irrigation Setup': ['Equipment', 'Installation Date', 'Cost'],
      Workers: ['Number of Workers', 'Wage per Worker', 'Individual Worker Details'],
      Machines: ['Number of Machines', 'Cost per Machine', 'Individual Machine Details'],
      'Other Expenses': ['Description', 'Cost'],
    },
    Fertigation: {
      'Fertilizer Application': ['Fertilizer Type', 'Application Date', 'Amount (kg)', 'Cost'],
      'Soil Testing': ['Lab Name', 'Sample Date', 'Cost', 'Results Date'],
      'Fertilizer Purchase': ['Fertilizer Type', 'Quantity (kg)', 'Cost', 'Supplier'],
      Workers: ['Number of Workers', 'Wage per Worker', 'Individual Worker Details'],
      Machines: ['Number of Machines', 'Cost per Machine', 'Individual Machine Details'],
      'Other Expenses': ['Description', 'Cost'],
    },
    // Add other categories and their events here...
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.expenseForm = this.fb.group({
      date: ['', Validators.required],
      category: ['', Validators.required],
      event: [''],
      notes: [''],
      receipt: [null],
    });

    this.expenseForm.get('category')!.valueChanges.subscribe(() => {
      this.expenseForm.get('event')!.setValue('');
    });

    this.expenseForm.get('event')!.valueChanges.subscribe(() => {
      this.addNewCard();
    });
  }

  getEvents() {
    const category = this.expenseForm.get('category')!.value;
    return this.activityEvents[category] ? Object.keys(this.activityEvents[category]) : [];
  }

  getFields(category: string, event: string) {
    return this.activityEvents[category] && this.activityEvents[category][event]
      ? this.activityEvents[category][event]
      : [];
  }

  addNewCard() {
    const category = this.expenseForm.get('category')!.value;
    const event = this.expenseForm.get('event')!.value;

    if (category && event) {
      const formGroups = [];
      formGroups.push(this.createFormGroup(category, event));

      // Add the new card to the top of the list
      this.dynamicFormCards.unshift({
        category: category,
        event: event,
        formGroups: formGroups,
      });
    }
  }

  createFormGroup(category: string, event: string): FormGroup {
    const fields = this.getFields(category, event);
    const formGroup = this.fb.group({});
    fields.forEach((field: any) => {
      formGroup.addControl(field, new FormControl('', Validators.required));
    });
    return formGroup;
  }

  addFormGroup(category: string, event: string) {
    const card = this.dynamicFormCards.find((c) => c.category === category && c.event === event);
    if (card) {
      card.formGroups.push(this.createFormGroup(category, event));
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
    if (this.expenseForm.valid) {
      const formData = {
        ...this.expenseForm.value,
        dynamicGroups: this.dynamicFormCards.map((card) => ({
          category: card.category,
          event: card.event,
          formGroups: card.formGroups.map((group) => group.value),
        })),
      };
      console.log('Expense saved', formData);
    }
  }

  cancel() {
    this.expenseForm.reset();
    this.dynamicFormCards = [];
  }
}
