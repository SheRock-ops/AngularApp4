
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// Import the Event model.
import { Event } from '../../models/event';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css'
})
export class EventCardComponent {

  // Receives event details from the dashboard.
  @Input({ required: true }) event!: Event;

  // Sends edit, delete, and RSVP requests to the dashboard.
  @Output() editRequested = new EventEmitter<Event>();
  @Output() deleteRequested = new EventEmitter<Event>();
  @Output() rsvpRequested = new EventEmitter<Event>();

  /* ========================================
     EVENT ACTIONS
  ======================================== */

  // Request to edit the selected event.
  editEvent(): void {

    this.editRequested.emit(this.event);

  }

  // Request to delete the selected event.
  deleteEvent(): void {

    this.deleteRequested.emit(this.event);

  }

  // Request to RSVP to the selected event.
  openRsvp(): void {

    this.rsvpRequested.emit(this.event);

  }

}
