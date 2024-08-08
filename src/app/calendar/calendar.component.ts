import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventDialogComponent } from '../event-dialog/event-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Event } from '../shared/events/event.model';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DragDropModule,
    MatIconModule,
    EventDialogComponent
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  hours: string[] = [];
  events: Event[] = [];
  todayEvents: Event[] = [];
  appointmentDate: Date = new Date();
  connectedDropLists: string[] = [];

  constructor(public dialog: MatDialog) {
    this.generateHours();
    this.generateConnectedDropLists();
    this.updateTodayEvents();
  }

  generateHours() {
    for (let i = 0; i < 24; i++) {
      const hour = i % 12 === 0 ? 12 : i % 12;
      const period = i < 12 ? 'AM' : 'PM';
      const time = `${hour}:00 ${period}`;
      this.hours.push(time);
    }
  }

  generateConnectedDropLists() {
    this.connectedDropLists = this.hours.map((_, index) => `hour-${index}`);
  }

  getEventsForHour(hour: string): Event[] {
    return this.todayEvents.filter(event => event.time === hour);
  }

  openDialog(eventData?: Event): void {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '400px',
      data: eventData || {}
    });

    dialogRef.afterClosed().subscribe(result  => {
      console.log('The dialog was closed', result);
      if (result?.action === 'delete') {
        console.log('delete', result);
        this.events = this.events.filter(event => event.title !== result.event.title || event.time !== result.event.time || event.date !== result.event.date);
        this.updateTodayEvents();
      } else if (result?.action === 'save') {
        const existingEventIndex = this.events.findIndex(event => event.title === result.event.title && event.time === result.event.time && event.date === result.event.date);
        if (existingEventIndex !== -1) {
          this.events[existingEventIndex] = result.event;
        } else {
          this.events.push(result.event);
        }
        this.updateTodayEvents();
      } else if (result?.action === 'cancel') {
        console.log('cancel');
      }
    });
  }


  addEvent(hour: string) {
    console.log('add event', hour);
    this.openDialog({ time: hour, date: this.appointmentDate, title: '' });
  }

  editEvent(event: Event, eventClick: MouseEvent) {
    eventClick.stopPropagation();
    console.log('edit event', event);
    this.openDialog(event);
  }

  drop(event: CdkDragDrop<Event[]>, hour: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const movedEvent = event.previousContainer.data[event.previousIndex];
      movedEvent.time = hour;
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      this.updateTodayEvents();
    }
  }

  updateTodayEvents() {
    this.todayEvents = this.events.filter(event => {
      const eventDateObj = new Date(event.date);
      const appointmentDateObj = new Date(this.appointmentDate);
      return  eventDateObj.toDateString() === appointmentDateObj.toDateString();
    });

  }

  onAppointmentDateChange(newDate: Date) {
    this.appointmentDate = newDate;
    this.updateTodayEvents();
  }

  noop(): void {
    // This method intentionally left blank to satisfy linting rules
  }

}