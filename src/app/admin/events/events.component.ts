import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { CalendarOptions } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction'; // For dateClick and eventClick
import dayGridPlugin from '@fullcalendar/daygrid';
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent {
  breadCrumbItems: any = [];
  constructor(private location: Location) {
    this.breadCrumbItems = [
      {
        icon: 'fa fa-house',
        label: '  Dashboard',
        routerLink: '/user/dashboard',
      },
      { label: 'Events' },
    ];
  }
  calendarOptions: CalendarOptions = {
    plugins: [interactionPlugin, dayGridPlugin], // Register plugins
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    editable: true,
    selectable: true,
    events: [
      { title: 'Event 1', date: '2024-10-01' },
      { title: 'Event 2', date: '2024-10-05' }
    ],
    // Use functions for event handling
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this)
  };

  handleDateClick(arg: any) {
    alert(`Date clicked: ${arg.dateStr}`);
  }

  handleEventClick(info: any) {
    alert(`Event clicked: ${info.event.title}`);
  }

  goBack() {
    this.location.back();
  }
}
