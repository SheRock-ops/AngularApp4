
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  MatDatepickerModule,
  MatDatepickerInputEvent
} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Import the Event model.
import { Event, EventCategory } from '../../models/event';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css'
})
export class EventFormComponent implements OnInit {

  /* ========================================
     COMPONENT INPUTS AND OUTPUTS
  ======================================== */

  // Receives existing events for duplicate title validation.
  @Input() existingEvents: Event[] = [];

  // Receives an event when the user clicks Edit.
  @Input() eventToEdit: Event | null = null;

  // Sends a created or updated event to the dashboard.
  @Output() eventSaved = new EventEmitter<Event>();

  // Notifies the dashboard when Cancel is clicked.
  @Output() cancelled = new EventEmitter<void>();

  /* ========================================
     EVENT CATEGORIES
  ======================================== */

  categories: EventCategory[] = [
    'Birthday',
    'Wedding',
    'Meeting',
    'Conference',
    'Celebration',
    'Travel',
    'Other'
  ];

  /* ========================================
     FORM PROPERTIES
  ======================================== */

  // Reactive form instance.
  eventForm: FormGroup;

  // Tracks whether the user attempted to submit the form.
  submitted = false;

  // Prevents selecting past dates.
  minDate = new Date();

  constructor(private formBuilder: FormBuilder) {

    // Remove the time portion from today's date.
    this.minDate.setHours(0, 0, 0, 0);

    /* ========================================
       INITIALIZE REACTIVE FORM
    ======================================== */

    this.eventForm = this.formBuilder.group(
      {
        title: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
            this.uniqueEventTitleValidator()
          ]
        ],

        category: [
          '',
          Validators.required
        ],

        location: [
          '',
          [
            Validators.required,
            Validators.maxLength(150)
          ]
        ],

        startDate: [
          null,
          Validators.required
        ],

        endDate: [
          null,
          Validators.required
        ],

        time: [
          '',
          Validators.required
        ],

        capacity: [
          1,
          [
            Validators.required,
            Validators.min(1),
            Validators.max(10000)
          ]
        ],

        description: [
          '',
          Validators.maxLength(1000)
        ]
      },
      {
        validators: this.eventDateRangeValidator()
      }
    );

  }

  /* ========================================
     LOAD EVENT DATA FOR EDITING
  ======================================== */

  ngOnInit(): void {

    // Recheck title uniqueness using the latest event list.
    this.eventForm.get('title')?.updateValueAndValidity();

    // Check whether an existing event was selected.
    if (this.eventToEdit) {

      // Populate the reactive form with the event details.
      this.eventForm.patchValue({

        title: this.eventToEdit.title,
        category: this.eventToEdit.category,
        location: this.eventToEdit.location,

        // Angular Material Datepicker expects Date objects.
        startDate: this.parseDate(this.eventToEdit.startDate),
        endDate: this.parseDate(this.eventToEdit.endDate),

        time: this.eventToEdit.time,
        capacity: this.eventToEdit.capacity,
        description: this.eventToEdit.description

      });

      // Keep the form clean until the user makes changes.
      this.eventForm.markAsPristine();
      this.eventForm.markAsUntouched();

    }

  }

  /* ========================================
     CUSTOM VALIDATOR - UNIQUE EVENT TITLE
  ======================================== */

  uniqueEventTitleValidator(): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {

      // Ignore empty values because required validation handles them.
      if (!control.value) {
        return null;
      }

      const enteredTitle = String(control.value)
        .trim()
        .toLowerCase();

      // Check whether another event already uses this title.
      const duplicateExists = this.existingEvents.some(event => {

        // Allow the event being edited to keep its original title.
        if (this.eventToEdit && event.id === this.eventToEdit.id) {
          return false;
        }

        return event.title.trim().toLowerCase() === enteredTitle;

      });

      return duplicateExists
        ? { duplicateTitle: true }
        : null;

    };

  }

  /* ========================================
     CUSTOM VALIDATOR - EVENT DATE RANGE
  ======================================== */

  eventDateRangeValidator(): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {

      const startDate = control.get('startDate')?.value;
      const endDate = control.get('endDate')?.value;

      // Do not compare dates until both are selected.
      if (!startDate || !endDate) {
        return null;
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      // Reject an end date earlier than the start date.
      if (end < start) {
        return { invalidDateRange: true };
      }

      return null;

    };

  }

  /* ========================================
     DATE CONVERSION HELPERS
  ======================================== */

  // Convert YYYY-MM-DD into a local Date object.
  parseDate(dateString: string): Date {

    const [year, month, day] = dateString
      .split('-')
      .map(Number);

    return new Date(year, month - 1, day);

  }

  // Convert a Date object into YYYY-MM-DD.
  formatDate(date: Date): string {

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1)
      .padStart(2, '0');

    const day = String(date.getDate())
      .padStart(2, '0');

    return `${year}-${month}-${day}`;

  }

  /* ========================================
     DISPLAY VALIDATION ERRORS
  ======================================== */

  hasError(controlName: string, errorName: string): boolean {

    const control = this.eventForm.get(controlName);

    if (!control) {
      return false;
    }

    return control.hasError(errorName) &&
      (control.touched || control.dirty || this.submitted);

  }

  /* ========================================
     SAVE CREATED OR EDITED EVENT
  ======================================== */

  saveEvent(): void {

    // Mark the form as submitted.
    this.submitted = true;

    // Recheck validation before saving.
    this.eventForm.updateValueAndValidity();

    // Display validation errors if the form is invalid.
    if (this.eventForm.invalid) {

      this.eventForm.markAllAsTouched();
      return;

    }

    // Read the form values.
    const formValue = this.eventForm.value;

    /* ========================================
       CREATE EVENT OBJECT
    ======================================== */

    const event: Event = {

      // Preserve the ID when editing an existing event.
      id: this.eventToEdit?.id ?? crypto.randomUUID(),

      title: String(formValue.title).trim(),

      category: formValue.category,

      description: String(formValue.description ?? '').trim(),

      location: String(formValue.location).trim(),

      startDate: this.formatDate(formValue.startDate),

      endDate: this.formatDate(formValue.endDate),

      time: formValue.time,

      capacity: Number(formValue.capacity),

      // Preserve the status when editing an existing event.
      status: this.eventToEdit?.status ?? 'Upcoming',

      // Preserve the original creation date when editing.
      createdAt: this.eventToEdit?.createdAt
        ?? new Date().toISOString()

    };

    // Send the event to the dashboard.
    this.eventSaved.emit(event);

  }

  /* ========================================
     CANCEL CREATE OR EDIT EVENT
  ======================================== */

  cancel(): void {

    // Notify the dashboard to close the form.
    this.cancelled.emit();

  }

}
