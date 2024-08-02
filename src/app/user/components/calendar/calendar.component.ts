import { ChangeDetectorRef, Component } from '@angular/core';
import { CalendarView, CalendarEvent, CalendarModule } from 'angular-calendar';
import { startOfDay, endOfDay, addDays, addMonths, isWithinInterval } from 'date-fns';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators,  } from '@angular/forms';
import { NotificationService } from '../../../Services/notification.service';
import { CalendarService } from '../../Services/calendar.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    CalendarModule,
    NgFor,
    NgIf,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  modalData!: { event: CalendarEvent; };
  newEvent: CalendarEvent = { start: new Date(), end: new Date(), title: '', color: { primary: '#ad2121', secondary: '#FAE3E3' }, meta: { details: [], expenses: [] } };
  expense = { amount: null, date: '', vendor: '', notes: '', receipt: null };
  events: CalendarEvent[] = [
    {
      start: startOfDay(new Date(2024, 7, 1)),
      end: addDays(startOfDay(new Date(2024, 7, 1)), 1),
      title: 'Fruit Setting, Rain Management',
      color: { primary: '#FF8C00', secondary: '#FFEFD5' },
      allDay: true,
      meta: {
        details: [
          'Nutrient Management: Continued application of fertilizers.',
          'Drainage: Costs for maintaining proper drainage during monsoon.',
          'Pest and Disease Management: Ongoing costs for pesticides and fungicides.'
        ]
      }
    },
  
  ];

  Coffe_crop_Calendar: any = [
    {
      start: startOfDay(new Date(2024, 0, 1)),
      end: addDays(startOfDay(new Date(2024, 1, 28)), 1),
      title: 'Pruning, Shade Management, Soil Preparation',
     
    },
    {
      start: startOfDay(new Date(2024, 2, 1)),
      end: addDays(startOfDay(new Date(2024, 3, 30)), 1),
      title: 'Flowering, Irrigation, Fertilization',
      
    },
    {
      start: startOfDay(new Date(2024, 4, 1)),
      end: addDays(startOfDay(new Date(2024, 5, 30)), 1),
      title: 'Berry Development, Weed Control',
      
    },
    {
      start: startOfDay(new Date(2024, 6, 1)),
      end: addDays(startOfDay(new Date(2024, 7, 31)), 1),
      title: 'Fruit Setting, Rain Management',
      
    },
    {
      start: startOfDay(new Date(2024, 8, 1)),
      end: addDays(startOfDay(new Date(2024, 9, 31)), 1),
      title: 'Final Berry Development, Pre-Harvest Preparation',
     
    },
    {
      start: startOfDay(new Date(2024, 10, 1)),
      end: addDays(startOfDay(new Date(2024, 11, 31)), 1),
      title: 'Harvesting, Post-Harvest Processing',
      
    },
  ];

  CalendarView = CalendarView;
  addEventForm: FormGroup;
  addExpenseForm: FormGroup;
  currentMonthEventTitle: any;
  constructor(
    private calendarService: CalendarService,
    private modalService: NgbModal,
    private fb: FormBuilder, 
    private notify:NotificationService ) { 
    this.addEventForm = this.fb.group({
      title: ['',Validators.required],
      start: ['',Validators.required],
      end: ['',Validators.required],
      details: ['']
    });

    this.addExpenseForm = this.fb.group({
      amount: ['',Validators.required],
      date: ['',Validators.required],
      vendor: ['',Validators.required],
      notes: ['',Validators.required],
      receipt: [null,Validators.required]
    });
  }
  ngOnInit() {
    this.updateCurrentMonthEventTitle();
  }

  changeView(view: CalendarView) {
    this.view = view;
  }

  setViewDate(months: number) {
    this.viewDate = addMonths(this.viewDate, months);
  }

  setToday() {
    this.viewDate = new Date();
  }

  handleEvent(action: string, event: CalendarEvent, content: any): void {
    this.modalData = { event };
    this.modalService.open(content, { size: 'lg' });
  }

  addExpense(modal: any) {

    if(!this.addExpenseForm.valid){
      this.notify.showWarning("Fill missing fields!");
      this.addEventForm.markAllAsTouched();
      return;
    }

    if (!this.modalData.event.meta.expenses) {
      this.modalData.event.meta.expenses = [];
    }
    const expense = this.addExpenseForm.value;
    this.modalData.event.meta.expenses.push({ ...expense });
    modal.close('Save click');
    console.log(expense);
    this.notify.showSuccess("Expenses added Successfully!");
   
    this.addExpenseForm.reset();
  }


  handleFileInput(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.expense.receipt = file;
    }
  }

  addEvent(modal: any) {
    if(!this.addEventForm.valid){
      this.notify.showWarning("Fill missing fields!")
      this.addEventForm.markAllAsTouched();
      return;
    }
    
    const newEvent = {
      ...this.addEventForm.value,
      start: new Date(this.addEventForm.value.start),
      end: new Date(this.addEventForm.value.end),
      color: { primary: '#ad2121', secondary: '#FAE3E3' },
      meta: { details: [this.addEventForm.value.details], expenses: [] }
    };
    this.notify.showSuccess("Event Added Successfully!");
    
    this.events.push(newEvent);
    console.log(this.events);
    console.log(this.events);
    this.setToday();
    modal.close();
    this.addEventForm.reset();
  }

  openAddEventModal(content: any) {
    this.modalService.open(content, { size: 'lg' });
  }
  openCoffeeCalendar(content: any) {
    this.modalService.open(content, { size: 'lg' });
  }

  updateCurrentMonthEventTitle() {
    const currentDate = new Date();

    const currentEvent = this.Coffe_crop_Calendar.find((event: any) =>
      isWithinInterval(currentDate, { start: event.start, end: event.end })
    );

    this.currentMonthEventTitle = currentEvent ? currentEvent.title : 'No Event for this Month';
  }
}
