import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.scss'
})
export class ExpenseComponent {
  
  expenseForm!: FormGroup; // Use non-null assertion
  categories = ['Irrigation', 'Fertigation', 'Machine', 'Pruning', 'Weeding', 'Scouting', 'Ploughing', 'Sprays', 'Harvesting', 'Transplant', 'Mulching', 'Inventory Purchase'];
  activityEvents :any= {
    'Irrigation': {
      'Watering': ['Water Source', 'Duration (hours)', 'Water Used (liters)', 'Cost'],
      'Pump Maintenance': ['Pump Type', 'Maintenance Date', 'Cost', 'Technician'],
      'Irrigation Setup': ['Equipment', 'Installation Date', 'Cost'],
      'Workers': ['Number of Workers', 'Wage per Worker', 'Individual Worker Details'],
      'Machines': ['Number of Machines', 'Cost per Machine', 'Individual Machine Details'],
      'Other Expenses': ['Description', 'Cost'],
    },
    'Fertigation': {
      'Fertilizer Application': ['Fertilizer Type', 'Application Date', 'Amount (kg)', 'Cost'],
      'Soil Testing': ['Lab Name', 'Sample Date', 'Cost', 'Results Date'],
      'Fertilizer Purchase': ['Fertilizer Type', 'Quantity (kg)', 'Cost', 'Supplier'],
      'Workers': ['Number of Workers', 'Wage per Worker', 'Individual Worker Details'],
      'Machines': ['Number of Machines', 'Cost per Machine', 'Individual Machine Details'],
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
      receipt: [null]
    });

    this.expenseForm.get('category')!.valueChanges.subscribe(value => {
      this.updateEventValidators(value);
    });

    this.expenseForm.get('event')!.valueChanges.subscribe(() => {
      this.updateDynamicFields();
    });
  }

  getEvents() {
    const category = this.expenseForm.get('category')!.value;
    return this.activityEvents[category] ? Object.keys(this.activityEvents[category]) : [];
  }

  getFields() {
    const category = this.expenseForm.get('category')!.value;
    const event = this.expenseForm.get('event')!.value;
    return this.activityEvents[category] && this.activityEvents[category][event] ? this.activityEvents[category][event] : [];
  }

  updateEventValidators(category: string) {
    if (this.activityEvents[category]) {
      this.expenseForm.get('event')!.setValidators([Validators.required]);
    } else {
      this.expenseForm.get('event')!.clearValidators();
    }
    this.expenseForm.get('event')!.updateValueAndValidity();
  }

  updateDynamicFields() {
    const fields = this.getFields();
    fields.forEach((field:any) => {
      if (!this.expenseForm.get(field)) {
        this.expenseForm.addControl(field, this.fb.control('', Validators.required));
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.expenseForm.patchValue({ receipt: file });
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      console.log('Expense saved', this.expenseForm.value);
    }
  }

  cancel() {
    this.expenseForm.reset();
  }
}