import { ChangeDetectorRef, Component } from '@angular/core';
import { CalendarView, CalendarEvent, CalendarModule } from 'angular-calendar';
import { startOfDay, endOfDay, addDays, addMonths, isWithinInterval, startOfMonth } from 'date-fns';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../../Services/notification.service';
import { CalendarService } from '../../Services/calendar.service';
import { UserService } from '../../user.service';
import { CustomCalendarEvent } from './custom-calendar-event';

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
  modalData!: { event: CustomCalendarEvent; };
  newEvent: CustomCalendarEvent = { start: new Date(), end: new Date(), title: '', color: { primary: '#ad2121', secondary: '#FAE3E3' }, meta: { details: [], expenses: [] } };
  expense = { amount: null, date: '', vendor: '', notes: '', receipt: null };
  events: CustomCalendarEvent[] = [];
  calendarCommonEvents: CustomCalendarEvent[] = [];
  isEdit: boolean = false;
  activeModalRef: NgbModalRef | null = null;

  CalendarView = CalendarView;
  addEventForm: FormGroup;
  addExpenseForm: FormGroup;
  currentMonthEventTitle: any;

  constructor(
    private calendarService: CalendarService,
    private modalService: NgbModal,
    private fb: FormBuilder, 
    private notify: NotificationService,
    private userService: UserService
  ) { 
    this.addEventForm = this.fb.group({
      title: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      details: ['']
    });

    this.addExpenseForm = this.fb.group({
      amount: ['', Validators.required],
      date: ['', Validators.required],
      vendor: ['', Validators.required],
      notes: ['', Validators.required],
      receipt: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.GetCalendarEvents();
  }

  changeView(view: CalendarView) {
    this.view = view;
  }

  setViewDate(months: number) {
    this.viewDate = addMonths(this.viewDate, months);
    this.updateCurrentMonthEventTitle();
  }

  setToday() {
    this.viewDate = new Date();
    this.updateCurrentMonthEventTitle();
  }

  handleEvent(action: string, event: CustomCalendarEvent, content: any): void {
    this.modalData = { event };
    this.activeModalRef = this.modalService.open(content, { size: 'lg' });
  }

  editEvent(event: CustomCalendarEvent, content: any): void {
    if (this.activeModalRef) {
      this.activeModalRef.close();
    }
    this.modalData = { event };
    this.isEdit = true;
    this.addEventForm.patchValue({
      title: event.title,
      start: this.formatDateForInput(event.start),
      end: event.end ? this.formatDateForInput(event.end) : '',
      details: event.meta.details[0] || ''
    });
    this.activeModalRef = this.modalService.open(content, { size: 'lg' });
  }

  addExpense(modal: any) {
    if (!this.addExpenseForm.valid) {
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
    if (!this.addEventForm.valid) {
      this.notify.showWarning("Fill missing fields!");
      this.addEventForm.markAllAsTouched();
      return;
    }

    const eventData: CustomCalendarEvent = {
      ...this.addEventForm.value,
      start: new Date(this.addEventForm.value.start),
      end: new Date(this.addEventForm.value.end),
      meta: { details: [this.addEventForm.value.details], expenses: [] },
      eventID: this.isEdit ? this.modalData.event.eventID : undefined // Maintain the eventID for edit
    };

    const data = {
      "start": new Date(this.addEventForm.value.start),
      "end": new Date(this.addEventForm.value.end),
      "title": this.addEventForm.value.title,
      "metaDetails": [
        this.addEventForm.value.details
      ],
      "userID": this.userService.userId,
      "eventID": this.isEdit ? this.modalData.event.eventID : undefined // Include eventID if editing
    };

    this.calendarService.addNewCalendarEvent(data).subscribe(() => {
      if (this.isEdit) {
        const index = this.events.findIndex(event => event.eventID === this.modalData.event.eventID);
        if (index !== -1) {
          this.events[index] = { ...this.modalData.event, ...eventData };
          this.notify.showSuccess("Event Updated Successfully!");
        }
      } else {
        this.events.push({
          ...eventData,
          color: { primary: '#ad2121', secondary: '#FAE3E3' },
        });
        this.notify.showSuccess("Event Added Successfully!");
      }

      this.setToday();
      modal.close();
      if (this.activeModalRef) {
        this.activeModalRef.close();
        this.activeModalRef = null;
      }
      this.addEventForm.reset();
      this.isEdit = false;
    });
  }

  GetCalendarEvents() {
    this.calendarService.getCalendarEvents().subscribe((res: any) => {
      this.calendarCommonEvents = this.getCommonEventsForFirstOfMonth(res.calendarCommonEvents);
      
      const userCalendarEvents = res.userCalendarEvents.map((event: any) => ({
        start: new Date(event.start),
        end: new Date(event.end),
        title: event.title,
        color: { primary: '#1e90ff', secondary: '#D1E8FF' }, // you can customize these colors if needed
        allDay: true,
        meta: { details: event.metaDetails, expenses: [] },
        eventID: event.eventID // Include eventID
      }));

      this.events = [...this.calendarCommonEvents, ...userCalendarEvents];
      console.log(this.events);
      this.updateCurrentMonthEventTitle();
    });
  }

  getCommonEventsForFirstOfMonth(events: any[]): CustomCalendarEvent[] {
    const commonEvents: CustomCalendarEvent[] = [];

    events.forEach(event => {
      const startDate = new Date(event.start);
      const endDate = new Date(event.end);
      let current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

      while (current <= endDate) {
        commonEvents.push({
          start: new Date(current),
          end: new Date(current),
          title: event.title,
          color: { primary: event.colorPrimary, secondary: event.colorSecondary },
          allDay: true,
          meta: { details: event.metaDetails, expenses: [] },
          eventID: event.eventID|| '' // Include eventID
        });
        current = addMonths(current, 1);
      }
    });

    return commonEvents;
  }

  openAddEventModal(content: any, isEdit: boolean = false) {
    this.isEdit = isEdit;
    if (!isEdit) {
      this.addEventForm.reset();
    }
    this.modalService.open(content, { size: 'lg' });
  }

  openCoffeeCalendar(content: any) {
    this.modalService.open(content, { size: 'lg' });
  }

  updateCurrentMonthEventTitle() {
    const currentDate = new Date(this.viewDate);
    const currentEvent = this.calendarCommonEvents.find((event: any) =>
      event.start.getFullYear() === currentDate.getFullYear() && event.start.getMonth() === currentDate.getMonth()
    );

    this.currentMonthEventTitle = currentEvent ? currentEvent.title : 'No Event for this Month';
  }

  formatDateForInput(date: Date | undefined): string {
    if (!date) {
        return '';
    }
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) 
      month = '0' + month;
    if (day.length < 2) 
      day = '0' + day;

    return [year, month, day].join('-');
  }
  isCommonEvent(event: CustomCalendarEvent): boolean {
    return this.calendarCommonEvents.some(commonEvent => commonEvent.eventID === event.eventID);
}
}
