import { Component } from '@angular/core';
import { CalendarView, CalendarEvent, CalendarModule } from 'angular-calendar';
import { startOfDay, endOfDay, addDays, addMonths } from 'date-fns';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    CalendarModule,
    NgFor,
    NgIf
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  modalData: { event: CalendarEvent; } | undefined;
  newEvent: CalendarEvent = { start: new Date(), end: new Date(), title: '', color: { primary: '', secondary: '' }, meta: { details: [] } };
  expense = { amount: null, date: '', vendor: '', notes: '', receipt: null };
  events: CalendarEvent[] = [
    {
      start: startOfDay(new Date(2024, 0, 1)),
      end: addDays(startOfDay(new Date(2024, 1, 28)), 1),
      title: 'Pruning, Shade Management, Soil Preparation',
      color: { primary: '#ad2121', secondary: '#FAE3E3' },
      allDay: true,
      meta: {
        details: [
          'Pruning Tools and Labor: Cost of pruning shears, saws, and labor.',
          'Shade Management: Costs associated with trimming shade trees.',
          'Soil Testing and Amendments: Expenses for soil testing kits and soil amendments like lime and organic matter.'
        ]
      }
    },
    {
      start: startOfDay(new Date(2024, 2, 1)),
      end: addDays(startOfDay(new Date(2024, 3, 30)), 1),
      title: 'Flowering, Irrigation, Fertilization',
      color: { primary: '#1e90ff', secondary: '#D1E8FF' },
      allDay: true,
      meta: {
        details: [
          'Fertilizers: Cost of purchasing and applying fertilizers.',
          'Irrigation: Installation and maintenance costs, water usage.',
          'Pest Control: Expenses for pesticides and labor for application.'
        ]
      }
    },
    {
      start: startOfDay(new Date(2024, 4, 1)),
      end: addDays(startOfDay(new Date(2024, 5, 30)), 1),
      title: 'Berry Development, Weed Control',
      color: { primary: '#32CD32', secondary: '#F0FFF0' },
      allDay: true,
      meta: {
        details: [
          'Irrigation and Nutrients: Ongoing irrigation and nutrient management costs.',
          'Weeding: Manual or chemical weed control expenses.',
          'Mulching: Cost of mulch materials and application labor.'
        ]
      }
    },
    {
      start: startOfDay(new Date(2024, 6, 1)),
      end: addDays(startOfDay(new Date(2024, 7, 31)), 1),
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
    {
      start: startOfDay(new Date(2024, 8, 1)),
      end: addDays(startOfDay(new Date(2024, 9, 31)), 1),
      title: 'Final Berry Development, Pre-Harvest Preparation',
      color: { primary: '#8A2BE2', secondary: '#E6E6FA' },
      allDay: true,
      meta: {
        details: [
          'Shade Management: Costs for maintaining optimal shade.',
          'Pre-Harvest Supplies: Preparing drying yards and storage facilities.'
        ]
      }
    },
    {
      start: startOfDay(new Date(2024, 10, 1)),
      end: addDays(startOfDay(new Date(2024, 11, 31)), 1),
      title: 'Harvesting, Post-Harvest Processing',
      color: { primary: '#FF4500', secondary: '#FFDEAD' },
      allDay: true,
      meta: {
        details: [
          'Harvesting: Labor costs for picking coffee cherries.',
          'Processing: Costs for pulping, fermenting, washing, and drying beans.'
        ]
      }
    },
  ];

  CalendarView = CalendarView;

  constructor(private modalService: NgbModal) {}

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
}
