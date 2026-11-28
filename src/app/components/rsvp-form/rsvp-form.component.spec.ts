
/// <reference types="jasmine" />

import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';

import {
  RsvpFormComponent,
  Rsvp
} from './rsvp-form.component';

import { Event } from '../../models/event';

describe('RsvpFormComponent', () => {

  let component: RsvpFormComponent;
  let fixture: ComponentFixture<RsvpFormComponent>;
  let form: NgForm;

  /* ========================================
     MOCK EVENT DATA
  ======================================== */

  const mockEvent: Event = {
    id: 'event-001',
    title: 'Technology Conference',
    category: 'Conference',
    startDate: '2099-12-10',
    endDate: '2099-12-12',
    time: '10:00',
    location: 'Toronto',
    description: 'An exciting technology conference.',
    capacity: 100,
    createdAt: '2026-11-27T10:00:00',
    status: ''
  };

  /* ========================================
     TEST SETUP
  ======================================== */

  beforeEach(async () => {

    await TestBed.configureTestingModule({

      imports: [RsvpFormComponent]

    }).compileComponents();

    fixture = TestBed.createComponent(
      RsvpFormComponent
    );

    component = fixture.componentInstance;

    // Supply the required event input.
    fixture.componentRef.setInput(
      'event',
      mockEvent
    );

    fixture.detectChanges();

    await fixture.whenStable();

    fixture.detectChanges();

    // Retrieve the actual template-driven form.
    form = fixture.debugElement
      .query(By.directive(NgForm))
      .injector.get(NgForm);

  });

  /* ========================================
     FORM SYNCHRONIZATION HELPER
  ======================================== */

  async function updateForm(): Promise<void> {

    fixture.detectChanges();

    await fixture.whenStable();

    fixture.detectChanges();

  }

  /* ========================================
     VALID RSVP HELPER
  ======================================== */

  async function fillValidForm(
    attendance: 'Yes' | 'No' = 'Yes'
  ): Promise<void> {

    component.guestName = 'Alex Morgan';

    component.email = 'alex@example.com';

    component.attendance = attendance;

    component.numberOfGuests = 2;

    component.message = 'Looking forward to the event!';

    await updateForm();

  }

  /* ========================================
     TEST 1: COMPONENT INITIALIZATION
  ======================================== */

  it('should create the RSVP form component', () => {

    expect(component).toBeTruthy();

    expect(form).toBeTruthy();

  });

  /* ========================================
     TEST 2: DEFAULT FORM VALUES
  ======================================== */

  it('should initialize with correct default values', () => {

    expect(component.guestName).toBe('');

    expect(component.email).toBe('');

    expect(component.attendance).toBe('');

    expect(component.numberOfGuests).toBe(1);

    expect(component.message).toBe('');

    expect(component.submitted).toBeFalse();

  });

  /* ========================================
     TEST 3: SELECTED EVENT INFORMATION
  ======================================== */

  it('should display the selected event title', () => {

    const compiled =
      fixture.nativeElement as HTMLElement;

    expect(compiled.textContent)
      .toContain(mockEvent.title);

    expect(compiled.textContent)
      .toContain('RSVP to Your Event');

  });

  /* ========================================
     TEST 4: REQUIRED GUEST NAME
  ======================================== */

  it('should require a guest name', () => {

    const control = form.controls['guestName'];

    expect(control.hasError('required'))
      .toBeTrue();

  });

  /* ========================================
     TEST 5: MINIMUM GUEST NAME LENGTH
  ======================================== */

  it('should reject guest names shorter than 2 characters', async () => {

    component.guestName = 'A';

    await updateForm();

    expect(
      form.controls['guestName']
        .hasError('minlength')
    ).toBeTrue();

  });

  /* ========================================
     TEST 6: MAXIMUM GUEST NAME LENGTH
  ======================================== */

  it('should reject guest names longer than 100 characters', async () => {

    component.guestName = 'A'.repeat(101);

    await updateForm();

    expect(
      form.controls['guestName']
        .hasError('maxlength')
    ).toBeTrue();

  });

  /* ========================================
     TEST 7: REQUIRED EMAIL
  ======================================== */

  it('should require an email address', () => {

    expect(
      form.controls['email']
        .hasError('required')
    ).toBeTrue();

  });

  /* ========================================
     TEST 8: INVALID EMAIL FORMAT
  ======================================== */

  it('should reject an invalid email address', async () => {

    component.email = 'invalid-email';

    await updateForm();

    expect(
      form.controls['email']
        .hasError('email')
    ).toBeTrue();

  });

  /* ========================================
     TEST 9: VALID EMAIL FORMAT
  ======================================== */

  it('should accept a valid email address', async () => {

    component.email = 'alex@example.com';

    await updateForm();

    expect(
      form.controls['email'].valid
    ).toBeTrue();

  });

  /* ========================================
     TEST 10: REQUIRED ATTENDANCE
  ======================================== */

  it('should require an attendance selection', () => {

    expect(
      form.controls['attendance']
        .hasError('required')
    ).toBeTrue();

  });

  /* ========================================
     TEST 11: DISABLED GUEST FIELD
  ======================================== */

  it('should disable guest count before attendance is selected', () => {

    expect(
      form.controls['numberOfGuests'].disabled
    ).toBeTrue();

  });

  /* ========================================
     TEST 12: ENABLE GUEST FIELD
  ======================================== */

  it('should enable guest count when attendance is Yes', async () => {

    component.attendance = 'Yes';

    await updateForm();

    expect(
      form.controls['numberOfGuests'].enabled
    ).toBeTrue();

  });

  /* ========================================
     TEST 13: REQUIRED GUEST COUNT
  ======================================== */

  it('should require a guest count when attending', async () => {

    await fillValidForm();

    form.controls['numberOfGuests']
      .setValue(null);

    expect(
      form.controls['numberOfGuests']
        .hasError('required')
    ).toBeTrue();

  });

  /* ========================================
     TEST 14: MINIMUM GUEST COUNT
  ======================================== */

  it('should reject guest counts below 1', async () => {

    await fillValidForm();

    component.numberOfGuests = 0;

    await updateForm();

    expect(
      form.controls['numberOfGuests']
        .hasError('min')
    ).toBeTrue();

  });

  /* ========================================
     TEST 15: MAXIMUM EVENT CAPACITY
  ======================================== */

  it('should reject guest counts exceeding event capacity', async () => {

    await fillValidForm();

    component.numberOfGuests =
      mockEvent.capacity + 1;

    await updateForm();

    expect(
      form.controls['numberOfGuests']
        .hasError('max')
    ).toBeTrue();

  });

  /* ========================================
     TEST 16: VALID GUEST COUNT BOUNDARIES
  ======================================== */

  it('should accept minimum and maximum valid guest counts', async () => {

    await fillValidForm();

    component.numberOfGuests = 1;

    await updateForm();

    expect(
      form.controls['numberOfGuests'].valid
    ).toBeTrue();

    component.numberOfGuests =
      mockEvent.capacity;

    await updateForm();

    expect(
      form.controls['numberOfGuests'].valid
    ).toBeTrue();

  });

  /* ========================================
     TEST 17: OPTIONAL MESSAGE VALIDATION
  ======================================== */

  it('should allow an empty message but reject messages longer than 500 characters', async () => {

    component.message = '';

    await updateForm();

    expect(
      form.controls['message'].valid
    ).toBeTrue();

    component.message = 'A'.repeat(501);

    await updateForm();

    expect(
      form.controls['message']
        .hasError('maxlength')
    ).toBeTrue();

  });

  /* ========================================
     TEST 18: INVALID FORM SUBMISSION
  ======================================== */

  it('should prevent invalid RSVP submissions and mark fields as touched', () => {

    const submitSpy = spyOn(
      component.rsvpSubmitted,
      'emit'
    );

    component.submitRsvp(form);

    expect(component.submitted).toBeTrue();

    expect(form.control.touched).toBeTrue();

    expect(
      form.controls['guestName'].touched
    ).toBeTrue();

    expect(submitSpy)
      .not.toHaveBeenCalled();

  });

  /* ========================================
     TEST 19: MISSING ATTENDANCE GUARD
  ======================================== */

  it('should prevent submission when attendance is missing', async () => {

    await fillValidForm();

    const submitSpy = spyOn(
      component.rsvpSubmitted,
      'emit'
    );

    // Exercise the component's additional
    // attendance guard independently.
    component.attendance = '';

    component.submitRsvp(form);

    expect(submitSpy)
      .not.toHaveBeenCalled();

  });

  /* ========================================
     TEST 20: SUCCESSFUL RSVP SUBMISSION
  ======================================== */

  it('should emit a valid RSVP when attendance is Yes', async () => {

    await fillValidForm();

    const submitSpy = spyOn(
      component.rsvpSubmitted,
      'emit'
    );

    expect(form.valid).toBeTrue();

    component.submitRsvp(form);

    expect(submitSpy)
      .toHaveBeenCalledTimes(1);

    expect(submitSpy).toHaveBeenCalledWith(

      jasmine.objectContaining({

        id: jasmine.any(String),

        eventId: mockEvent.id,

        guestName: 'Alex Morgan',

        email: 'alex@example.com',

        attendance: 'Yes',

        numberOfGuests: 2,

        message: 'Looking forward to the event!',

        submittedAt: jasmine.any(String)

      })

    );

  });

  /* ========================================
     TEST 21: DECLINING AN INVITATION
  ======================================== */

  it('should emit zero guests when attendance is No', async () => {

    await fillValidForm('No');

    const submitSpy = spyOn(
      component.rsvpSubmitted,
      'emit'
    );

    expect(
      form.controls['numberOfGuests'].disabled
    ).toBeTrue();

    expect(form.valid).toBeTrue();

    component.submitRsvp(form);

    expect(submitSpy).toHaveBeenCalledWith(

      jasmine.objectContaining({

        eventId: mockEvent.id,

        attendance: 'No',

        numberOfGuests: 0

      })

    );

  });

  /* ========================================
     TEST 22: WHITESPACE TRIMMING
  ======================================== */

  it('should trim submitted guest information and messages', async () => {

    await fillValidForm();

    const submitSpy = spyOn(
      component.rsvpSubmitted,
      'emit'
    );

    // Test submission normalization separately
    // from Angular's email format validator.
    component.guestName = '  Alex Morgan  ';

    component.email = '  alex@example.com  ';

    component.message = '  Thank you!  ';

    component.submitRsvp(form);

    expect(submitSpy).toHaveBeenCalledWith(

      jasmine.objectContaining({

        guestName: 'Alex Morgan',

        email: 'alex@example.com',

        message: 'Thank you!'

      })

    );

  });

  /* ========================================
     TEST 23: SUBMIT BUTTON AND DATA PRESERVATION
  ======================================== */

  it('should submit through the button and preserve entered form data', async () => {

    await fillValidForm();

    const submitSpy = spyOn(
      component.rsvpSubmitted,
      'emit'
    );

    const submitButton: HTMLButtonElement =
      fixture.nativeElement.querySelector(
        '.submit-button'
      );

    expect(submitButton).toBeTruthy();

    expect(form.valid).toBeTrue();

    submitButton.click();

    await updateForm();

    expect(submitSpy)
      .toHaveBeenCalledTimes(1);

    const savedRsvp: Rsvp =
      submitSpy.calls.mostRecent().args[0] as Rsvp;

    expect(savedRsvp.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );

    expect(
      Number.isNaN(
        Date.parse(savedRsvp.submittedAt)
      )
    ).toBeFalse();

    // Preserve entered information so the
    // guest can retry if saving fails.
    expect(component.guestName)
      .toBe('Alex Morgan');

    expect(component.email)
      .toBe('alex@example.com');

    expect(component.attendance)
      .toBe('Yes');

    expect(component.numberOfGuests)
      .toBe(2);

    expect(component.message)
      .toBe('Looking forward to the event!');

  });

  /* ========================================
     TEST 24: CANCEL BUTTON INTERACTION
  ======================================== */

  it('should emit cancellation without submitting the RSVP', () => {

    const cancelSpy = spyOn(
      component.cancelled,
      'emit'
    );

    const submitSpy = spyOn(
      component.rsvpSubmitted,
      'emit'
    );

    const cancelButton: HTMLButtonElement =
      fixture.nativeElement.querySelector(
        '.cancel-button'
      );

    expect(cancelButton).toBeTruthy();

    cancelButton.click();

    expect(cancelSpy)
      .toHaveBeenCalledTimes(1);

    expect(submitSpy)
      .not.toHaveBeenCalled();

  });

});
