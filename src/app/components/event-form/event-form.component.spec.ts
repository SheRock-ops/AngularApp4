
/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventFormComponent } from './event-form.component';
import { Event } from '../../models/event';

describe('EventFormComponent', () => {

  let component: EventFormComponent;
  let fixture: ComponentFixture<EventFormComponent>;

  /* ========================================
     TEST DATE HELPERS
  ======================================== */

  // Generate future dates so tests remain valid over time.
  function futureDate(days: number): Date {

    const date = new Date();

    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + days);

    return date;

  }

  function formatDate(date: Date): string {

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1)
      .padStart(2, '0');

    const day = String(date.getDate())
      .padStart(2, '0');

    return `${year}-${month}-${day}`;

  }

  /* ========================================
     MOCK EVENT DATA
  ======================================== */

  const mockEvent: Event = {

    id: 'event-001',
    status: 'Upcoming',
    title: 'Technology Conference',
    category: 'Conference',
    location: 'Toronto Convention Centre',
    startDate: formatDate(futureDate(5)),
    endDate: formatDate(futureDate(6)),
    time: '10:00',
    description: 'An exciting technology conference.',
    capacity: 100,
    createdAt: '2026-11-27T10:00:00'

  };

  /* ========================================
     TEST SETUP
  ======================================== */

  beforeEach(async () => {

    await TestBed.configureTestingModule({

      imports: [EventFormComponent]

    }).compileComponents();

    fixture = TestBed.createComponent(EventFormComponent);

    component = fixture.componentInstance;

  });

  /* ========================================
     VALID FORM HELPER
  ======================================== */

  function fillValidForm(): void {

    component.eventForm.patchValue({

      title: 'Creative Design Event',
      category: 'Other',
      location: 'Toronto',
      startDate: futureDate(10),
      endDate: futureDate(11),
      time: '14:00',
      capacity: 50,
      description: 'A creative and inspiring event.'

    });

  }

  /* ========================================
     1. COMPONENT INITIALIZATION
  ======================================== */

  it('should create the component', () => {

    fixture.detectChanges();

    expect(component).toBeTruthy();

  });

  /* ========================================
     2. FORM INITIALIZATION
  ======================================== */

  it('should initialize the reactive form', () => {

    expect(component.eventForm).toBeTruthy();

    expect(component.eventForm.get('title')?.value)
      .toBe('');

    expect(component.eventForm.get('capacity')?.value)
      .toBe(1);

    expect(component.submitted).toBeFalse();

    expect(component.eventForm.invalid).toBeTrue();

  });

  /* ========================================
     3. REQUIRED FIELD VALIDATION
  ======================================== */

  it('should validate required fields', () => {

    const requiredFields = [

      'title',
      'category',
      'location',
      'startDate',
      'endDate',
      'time',
      'capacity'

    ];

    requiredFields.forEach(field => {

      const control = component.eventForm.get(field);

      control?.setValue(null);

      expect(control?.hasError('required'))
        .toBeTrue();

    });

  });

  /* ========================================
     4. MINIMUM TITLE LENGTH
  ======================================== */

  it('should reject titles shorter than 3 characters', () => {

    const title = component.eventForm.get('title');

    title?.setValue('AB');

    expect(title?.hasError('minlength'))
      .toBeTrue();

  });

  /* ========================================
     5. MAXIMUM TITLE LENGTH
  ======================================== */

  it('should reject titles longer than 100 characters', () => {

    const title = component.eventForm.get('title');

    title?.setValue('A'.repeat(101));

    expect(title?.hasError('maxlength'))
      .toBeTrue();

  });

  /* ========================================
     6. LOCATION LENGTH VALIDATION
  ======================================== */

  it('should reject locations longer than 150 characters', () => {

    const location = component.eventForm.get('location');

    location?.setValue('A'.repeat(151));

    expect(location?.hasError('maxlength'))
      .toBeTrue();

  });

  /* ========================================
     7. MINIMUM CAPACITY
  ======================================== */

  it('should reject capacity below 1', () => {

    const capacity = component.eventForm.get('capacity');

    capacity?.setValue(0);

    expect(capacity?.hasError('min'))
      .toBeTrue();

  });

  /* ========================================
     8. MAXIMUM CAPACITY
  ======================================== */

  it('should reject capacity above 10000', () => {

    const capacity = component.eventForm.get('capacity');

    capacity?.setValue(10001);

    expect(capacity?.hasError('max'))
      .toBeTrue();

  });

  /* ========================================
     9. VALID CAPACITY BOUNDARIES
  ======================================== */

  it('should accept valid capacity boundaries', () => {

    const capacity = component.eventForm.get('capacity');

    capacity?.setValue(1);

    expect(capacity?.valid).toBeTrue();

    capacity?.setValue(10000);

    expect(capacity?.valid).toBeTrue();

  });

  /* ========================================
     10. DESCRIPTION LENGTH VALIDATION
  ======================================== */

  it('should reject descriptions longer than 1000 characters', () => {

    const description =
      component.eventForm.get('description');

    description?.setValue('A'.repeat(1001));

    expect(description?.hasError('maxlength'))
      .toBeTrue();

  });

  /* ========================================
     11. DUPLICATE EVENT TITLE
  ======================================== */

  it('should reject duplicate event titles', () => {

    component.existingEvents = [mockEvent];

    const title = component.eventForm.get('title');

    title?.setValue(mockEvent.title);

    expect(title?.hasError('duplicateTitle'))
      .toBeTrue();

  });

  /* ========================================
     12. CASE-INSENSITIVE DUPLICATE TITLE
  ======================================== */

  it('should detect duplicate titles regardless of case and spaces', () => {

    component.existingEvents = [mockEvent];

    const title = component.eventForm.get('title');

    title?.setValue('  TECHNOLOGY CONFERENCE  ');

    expect(title?.hasError('duplicateTitle'))
      .toBeTrue();

  });

  /* ========================================
     13. UNIQUE EVENT TITLE
  ======================================== */

  it('should accept a unique event title', () => {

    component.existingEvents = [mockEvent];

    const title = component.eventForm.get('title');

    title?.setValue('Annual Celebration');

    expect(title?.hasError('duplicateTitle'))
      .toBeFalse();

    expect(title?.valid).toBeTrue();

  });

  /* ========================================
     14. INVALID DATE RANGE
  ======================================== */

  it('should reject an end date earlier than the start date', () => {

    component.eventForm.patchValue({

      startDate: futureDate(10),
      endDate: futureDate(5)

    });

    expect(
      component.eventForm.hasError('invalidDateRange')
    ).toBeTrue();

  });

  /* ========================================
     15. VALID DATE RANGE
  ======================================== */

  it('should accept an end date after the start date', () => {

    component.eventForm.patchValue({

      startDate: futureDate(5),
      endDate: futureDate(10)

    });

    expect(
      component.eventForm.hasError('invalidDateRange')
    ).toBeFalse();

  });

  /* ========================================
     16. SAME-DAY EVENT
  ======================================== */

  it('should allow events starting and ending on the same day', () => {

    const date = futureDate(5);

    component.eventForm.patchValue({

      startDate: date,
      endDate: date

    });

    expect(
      component.eventForm.hasError('invalidDateRange')
    ).toBeFalse();

  });

  /* ========================================
     17. INVALID FORM SUBMISSION
  ======================================== */

  it('should prevent submission of an invalid form', () => {

    const saveSpy = spyOn(component.eventSaved, 'emit');

    component.saveEvent();

    expect(component.submitted).toBeTrue();

    expect(component.eventForm.touched).toBeTrue();

    expect(saveSpy).not.toHaveBeenCalled();

  });

  /* ========================================
     18. VALID FORM SUBMISSION
  ======================================== */

  it('should emit a new event when the form is valid', () => {

    fillValidForm();

    const saveSpy = spyOn(component.eventSaved, 'emit');

    expect(component.eventForm.valid).toBeTrue();

    component.saveEvent();

    expect(saveSpy).toHaveBeenCalledTimes(1);

    expect(saveSpy).toHaveBeenCalledWith(

      jasmine.objectContaining({

        id: jasmine.any(String),
        title: 'Creative Design Event',
        category: 'Other',
        location: 'Toronto',
        startDate: formatDate(futureDate(10)),
        endDate: formatDate(futureDate(11)),
        time: '14:00',
        capacity: 50,
        description: 'A creative and inspiring event.',
        createdAt: jasmine.any(String)

      })

    );

  });

  /* ========================================
     19. EDIT EVENT INITIALIZATION
  ======================================== */

  it('should populate the form when editing an existing event', () => {

    component.eventToEdit = mockEvent;

    fixture.detectChanges();

    expect(component.eventForm.get('title')?.value)
      .toBe(mockEvent.title);

    expect(component.eventForm.get('location')?.value)
      .toBe(mockEvent.location);

    expect(component.eventForm.get('capacity')?.value)
      .toBe(mockEvent.capacity);

    expect(component.eventForm.get('startDate')?.value)
      .toEqual(component.parseDate(mockEvent.startDate));

    expect(component.eventForm.pristine).toBeTrue();

  });

  /* ========================================
     20. EDIT EXISTING TITLE
  ======================================== */

  it('should allow an existing event to retain its own title', () => {

    component.existingEvents = [mockEvent];

    component.eventToEdit = mockEvent;

    fixture.detectChanges();

    expect(
      component.eventForm.get('title')
        ?.hasError('duplicateTitle')
    ).toBeFalse();

  });

  /* ========================================
     21. PRESERVE EVENT ID AND CREATION DATE
  ======================================== */

  it('should preserve the original ID and creation date when editing', () => {

    component.eventToEdit = mockEvent;

    component.existingEvents = [mockEvent];

    fixture.detectChanges();

    component.eventForm.patchValue({

      title: 'Updated Technology Conference',
      capacity: 200

    });

    const saveSpy = spyOn(component.eventSaved, 'emit');

    component.saveEvent();

    expect(saveSpy).toHaveBeenCalledWith(

      jasmine.objectContaining({

        id: mockEvent.id,
        createdAt: mockEvent.createdAt,
        title: 'Updated Technology Conference',
        capacity: 200

      })

    );

  });

  /* ========================================
     22. VALIDATION ERROR VISIBILITY
  ======================================== */

  it('should display validation errors after a field is touched', () => {

    const title = component.eventForm.get('title');

    title?.setValue('');

    expect(component.hasError('title', 'required'))
      .toBeFalse();

    title?.markAsTouched();

    expect(component.hasError('title', 'required'))
      .toBeTrue();

  });

  /* ========================================
     23. CANCEL BUTTON INTERACTION
  ======================================== */

  it('should emit a cancellation event when Cancel is clicked', () => {

    fixture.detectChanges();

    const cancelSpy = spyOn(component.cancelled, 'emit');

    const cancelButton: HTMLButtonElement =
      fixture.nativeElement.querySelector('.cancel-button');

    expect(cancelButton).toBeTruthy();

    cancelButton.click();

    expect(cancelSpy).toHaveBeenCalledTimes(1);

  });

  /* ========================================
     24. SAVE BUTTON INTERACTION
  ======================================== */

  it('should submit a valid event when Create Event is clicked', () => {

    fixture.detectChanges();

    fillValidForm();

    fixture.detectChanges();

    const saveSpy = spyOn(component.eventSaved, 'emit');

    const saveButton: HTMLButtonElement =
      fixture.nativeElement.querySelector('.save-button');

    expect(saveButton).toBeTruthy();

    expect(component.eventForm.valid).toBeTrue();

    saveButton.click();

    expect(saveSpy).toHaveBeenCalledTimes(1);

  });

});
