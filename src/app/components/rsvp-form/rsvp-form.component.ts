
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Import the Event model.
import { Event } from '../../models/event';

// Represents the information submitted by an RSVP guest.
export interface Rsvp {
  id: string;
  eventId: string;
  guestName: string;
  email: string;
  attendance: 'Yes' | 'No';
  numberOfGuests: number;
  message: string;
  submittedAt: string;
}

@Component({
  selector: 'app-rsvp-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './rsvp-form.component.html',
  styleUrl: './rsvp-form.component.css'
})
export class RsvpFormComponent {

  /* ========================================
     COMPONENT INPUTS AND OUTPUTS
  ======================================== */

  // The event for which the guest is responding.
  @Input({ required: true }) event!: Event;

  // Notifies the parent component when the form is closed.
  @Output() cancelled = new EventEmitter<void>();

  // Sends the submitted RSVP to the parent component.
  @Output() rsvpSubmitted = new EventEmitter<Rsvp>();

  /* ========================================
     TEMPLATE-DRIVEN FORM DATA
  ======================================== */

  // ngModel binds these values to the HTML form.
  guestName = '';
  email = '';
  attendance: 'Yes' | 'No' | '' = '';
  numberOfGuests = 1;
  message = '';

  // Tracks whether submission has been attempted.
  submitted = false;

  /* ========================================
     SUBMIT RSVP
  ======================================== */

  submitRsvp(form: NgForm): void {

    this.submitted = true;

    // Stop submission when required fields are invalid.
    if (form.invalid || !this.attendance) {

      form.control.markAllAsTouched();
      return;

    }

    // Build the RSVP object from the form values.
    const rsvp: Rsvp = {
      id: crypto.randomUUID(),
      eventId: this.event.id,
      guestName: this.guestName.trim(),
      email: this.email.trim(),
      attendance: this.attendance,
      numberOfGuests: this.attendance === 'Yes'
        ? Number(this.numberOfGuests)
        : 0,
      message: this.message.trim(),
      submittedAt: new Date().toISOString()
    };

    // Send the RSVP to the dashboard for saving.
    // The dashboard handles success and error notifications.
    this.rsvpSubmitted.emit(rsvp);

    // Do not reset the form here.
    // Keep the entered information if saving fails.

  }

  /* ========================================
     CANCEL RSVP
  ======================================== */

  cancel(): void {

    // Close the form without submitting.
    this.cancelled.emit();

  }

}
