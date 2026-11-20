
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Import the Create Event form component.
import { EventFormComponent } from '../event-form/event-form.component';

// Import the Event Card component.
import { EventCardComponent } from '../event-card/event-card.component';

// Import the template-driven RSVP form component and RSVP interface.
import {
  RsvpFormComponent,
  Rsvp
} from '../rsvp-form/rsvp-form.component';

// Import the Event model.
import { Event } from '../../models/event';

// Import the Event Service for localStorage persistence.
import { EventService } from '../../services/event.service';

// Import the RSVP Service for localStorage persistence.
import { RsvpService } from '../../services/rsvp.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
    EventFormComponent,
    EventCardComponent,
    RsvpFormComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  /* ========================================
     DASHBOARD INFORMATION
  ======================================== */

  title = 'Welcome to Eventopia!';
  subtitle = 'Plan it. Create it. Celebrate it!';

  totalEvents = 0;
  upcomingEvents = 0;
  completedEvents = 0;

  /* ========================================
     EVENT FORM STATE
  ======================================== */

  // Controls whether the Create/Edit Event form is visible.
  showEventForm = false;

  // Stores the event currently being edited.
  eventToEdit: Event | null = null;

  /* ========================================
     RSVP FORM STATE
  ======================================== */

  // Controls whether the RSVP form is visible.
  showRsvpForm = false;

  // Stores the event selected for RSVP.
  selectedRsvpEvent: Event | null = null;

  /* ========================================
     SIMULATED HTTP ERROR TESTING
  ======================================== */

  // Set to true to simulate an HTTP 503 error.
  // Keep false during normal application use.
  simulateRsvpError = false;

  /* ========================================
     EVENT DATA
  ======================================== */

  // Stores all events loaded from localStorage.
  events: Event[] = [];

  /* ========================================
     CONSTRUCTOR
  ======================================== */

  constructor(
    private snackBar: MatSnackBar,
    private eventService: EventService,
    private rsvpService: RsvpService
  ) {

    // Load previously saved events from localStorage.
    this.events = this.eventService.getEvents();

    // Calculate dashboard statistics.
    this.updateStatistics();

  }

  /* ========================================
     CREATE EVENT
  ======================================== */

  openEventForm(): void {

    // Reset editing mode.
    this.eventToEdit = null;

    // Close the RSVP form if it is open.
    this.showRsvpForm = false;
    this.selectedRsvpEvent = null;

    // Display the Create Event form.
    this.showEventForm = true;

  }

  /* ========================================
     CLOSE EVENT FORM
  ======================================== */

  closeEventForm(): void {

    this.showEventForm = false;
    this.eventToEdit = null;

  }

  /* ========================================
     SAVE OR UPDATE EVENT
  ======================================== */

  saveEvent(event: Event): void {

    try {

      if (this.eventToEdit) {

        // Update the existing event in localStorage.
        this.events = this.eventService.updateEvent(event);

        this.showMessage('Event updated successfully!');

      } else {

        // Save the new event to localStorage.
        this.events = this.eventService.addEvent(event);

        this.showMessage('Event created successfully!');

      }

      // Refresh dashboard statistics.
      this.updateStatistics();

      // Return to the dashboard.
      this.closeEventForm();

    } catch (error) {

      // Handle storage errors without crashing the application.
      console.error('Unable to save event:', error);

      this.showMessage(
        'Unable to save your event. Please try again.'
      );

      // Keep the Event form open if saving fails.

    }

  }

  /* ========================================
     EDIT EVENT
  ======================================== */

  editEvent(event: Event): void {

    // Close the RSVP form.
    this.showRsvpForm = false;
    this.selectedRsvpEvent = null;

    // Store the event being edited.
    this.eventToEdit = event;

    // Open the Create/Edit Event form.
    this.showEventForm = true;

  }

  /* ========================================
     DELETE EVENT
  ======================================== */

  deleteEvent(event: Event): void {

    // Ask the user to confirm before deleting.
    const confirmed = window.confirm(
      `Are you sure you want to delete "${event.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {

      // Delete the selected event from localStorage.
      this.events = this.eventService.deleteEvent(event.id);

      // Refresh dashboard statistics.
      this.updateStatistics();

      // Display a success notification.
      this.showMessage('Event deleted successfully!');

    } catch (error) {

      // Handle errors during deletion.
      console.error('Unable to delete event:', error);

      this.showMessage(
        'Unable to delete your event. Please try again.'
      );

    }

  }

  /* ========================================
     OPEN RSVP FORM
  ======================================== */

  openRsvpForm(event: Event): void {

    // Store the event selected by the guest.
    this.selectedRsvpEvent = event;

    // Hide the Create/Edit Event form.
    this.showEventForm = false;
    this.eventToEdit = null;

    // Display the template-driven RSVP form.
    this.showRsvpForm = true;

  }

  /* ========================================
     CLOSE RSVP FORM
  ======================================== */

  closeRsvpForm(): void {

    // Hide the RSVP form.
    this.showRsvpForm = false;

    // Clear the selected event.
    this.selectedRsvpEvent = null;

  }

  /* ========================================
     HANDLE RSVP SUBMISSION
  ======================================== */

  handleRsvpSubmission(rsvp: Rsvp): void {

    try {

      // Simulate an HTTP 503 error when testing is enabled.
      if (this.simulateRsvpError) {

        this.rsvpService.simulateHttpError();

      }

      // Save the guest response to localStorage.
      this.rsvpService.addRsvp(rsvp);

      // Display the saved RSVP in the browser console.
      console.log('RSVP saved successfully:', rsvp);

      // Display success only after saving completes.
      this.showMessage(
        'RSVP submitted and saved successfully!'
      );

      // Return to the dashboard after saving.
      this.closeRsvpForm();

    } catch (error) {

      // Log the error for debugging.
      console.error('Unable to save RSVP:', error);

      // Handle simulated HTTP failures.
      if (error instanceof HttpErrorResponse) {

        this.showMessage(
          'RSVP service is temporarily unavailable. Please try again.'
        );

      } else {

        // Handle localStorage or other unexpected failures.
        this.showMessage(
          'Unable to save your RSVP. Please try again.'
        );

      }

      // Keep the RSVP form open so the guest can retry.

    }

  }

  /* ========================================
     UPDATE DASHBOARD STATISTICS
  ======================================== */

  updateStatistics(): void {

    // Count all saved events.
    this.totalEvents = this.events.length;

    // Get today's date without the time.
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Count upcoming and ongoing events.
    this.upcomingEvents = this.events.filter(
      event => this.parseDate(event.endDate) >= today
    ).length;

    // Count completed events.
    this.completedEvents = this.events.filter(
      event => this.parseDate(event.endDate) < today
    ).length;

  }

  /* ========================================
     CONVERT EVENT DATE
  ======================================== */

  parseDate(dateString: string): Date {

    // Convert YYYY-MM-DD into a local Date object.
    const [year, month, day] = dateString.split('-').map(Number);

    return new Date(year, month - 1, day);

  }

  /* ========================================
     SNACKBAR NOTIFICATIONS
  ======================================== */

  showMessage(message: string): void {

    // Display Angular Material snackbar notifications.
    this.snackBar.open(message, 'Close', {
      duration: 3500,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });

  }

}
