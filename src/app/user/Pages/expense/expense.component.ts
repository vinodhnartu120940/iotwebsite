import { KeyValuePipe, NgFor, NgIf } from '@angular/common';
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
  imports: [ReactiveFormsModule, NgFor, NgIf, KeyValuePipe],
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
})
export class ExpenseComponent implements OnInit {
  expenseForm!: FormGroup;
  dynamicFormCards: {
    category: string;
    event: string;
    formGroups: FormGroup[];
  }[] = [];
  savedExpenses: { [key: string]: any[] } = {}; // Initialize as an empty object

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
      Watering: [
        'Water Source',
        'Duration (hours)',
        'Water Used (liters)',
        'Cost',
      ],
      'Pump Maintenance': [
        'Pump Type',
        'Maintenance Date',
        'Cost',
        'Technician',
      ],
      'Irrigation Setup': ['Equipment', 'Installation Date', 'Cost'],
      Workers: [
        'Number of Workers',
        'Wage per Worker',
        'Individual Worker Details',
      ],
      Machines: [
        'Number of Machines',
        'Cost per Machine',
        'Individual Machine Details',
      ],
      'Other Expenses': ['Description', 'Cost'],
    },
    Fertigation: {
      'Fertilizer Application': [
        'Fertilizer Type',
        'Application Date',
        'Amount (kg)',
        'Cost',
      ],
      'Soil Testing': ['Lab Name', 'Sample Date', 'Cost', 'Results Date'],
      'Fertilizer Purchase': [
        'Fertilizer Type',
        'Quantity (kg)',
        'Cost',
        'Supplier',
      ],
      Workers: [
        'Number of Workers',
        'Wage per Worker',
        'Individual Worker Details',
      ],
      Machines: [
        'Number of Machines',
        'Cost per Machine',
        'Individual Machine Details',
      ],
      'Other Expenses': ['Description', 'Cost'],
    },
    // Add other categories and their events here...
  };
  dataShowing: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.expenseForm = this.fb.group({
      date: ['', Validators.required],
      category: ['', Validators.required],
      event: ['', Validators.required],
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
    return this.activityEvents[category]
      ? Object.keys(this.activityEvents[category])
      : [];
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

  createFormGroup(category: string, event: string): FormGroup {
    const fields = this.getFields(category, event);
    const formGroup = this.fb.group({});
    fields.forEach((field: any) => {
      formGroup.addControl(field, new FormControl('', Validators.required));
    });
    return formGroup;
  }

  addFormGroup(category: string, event: string) {
    const card = this.dynamicFormCards.find(
      (c) => c.category === category && c.event === event
    );
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
    // if (this.expenseForm.valid) {
    const formData = {
      ...this.expenseForm.value,
      dynamicGroups: this.dynamicFormCards.map((card) => ({
        category: card.category,
        event: card.event,
        formGroups: card.formGroups.map((group) => group.value),
      })),
    };

    // Save the form data by category and event
    const key = `${formData.category}-${formData.event}`;
    if (!this.savedExpenses[key]) {
      this.savedExpenses[key] = [];
    }
    this.savedExpenses[key].push(formData);

    console.log('Expense saved', formData);
    this.dataShowing = true;
    this.cancel(); // Clear the form after saving
    // }
  }

  cancel() {
    this.expenseForm.reset();
    this.dynamicFormCards = [];
  }
  // Function to group expenses by category
  groupByCategory(expenses: { [key: string]: any[] }) {
    const groupedExpenses: { [key: string]: any[] } = {};
    Object.keys(expenses).forEach((key) => {
      const category = expenses[key][0].category;
      if (!groupedExpenses[category]) {
        groupedExpenses[category] = [];
      }
      groupedExpenses[category].push(...expenses[key]);
    });
    return groupedExpenses;
  }

  // Function to handle category deletion
  deleteDynamicGroup(entryIndex: number, groupIndex: number) {
    const entryKey = Object.keys(this.savedExpenses)[entryIndex];
    const expense = this.savedExpenses[entryKey];

    if (expense && expense[0].dynamicGroups[groupIndex]) {
      expense[0].dynamicGroups.splice(groupIndex, 1);

      // If the dynamicGroups array is empty, remove the entire entry
      if (expense[0].dynamicGroups.length === 0) {
        delete this.savedExpenses[entryKey];
      }
    }
  }

  // Function to reverse the grouping (to be used after deletion)
  reverseGroupByCategory(groupedExpenses: { [key: string]: any[] }) {
    const reversed: { [key: string]: any[] } = {};
    Object.keys(groupedExpenses).forEach((category) => {
      groupedExpenses[category].forEach((expense, index) => {
        const key = `${category}-${index}`;
        reversed[key] = [expense];
      });
    });
    return reversed;
  }
}
