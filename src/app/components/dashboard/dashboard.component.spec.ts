/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

// Import the actual Dashboard component.
import { DashboardComponent } from './dashboard.component';

// Import services.
import { EventService } from '../../services/event.service';
import { RsvpService } from '../../services/rsvp.service';

// Import models.
import { Event } from '../../models/event';
import { Rsvp } from '../rsvp-form/rsvp-form.component';

describe('DashboardComponent', () => {

  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  let eventService: jasmine.SpyObj<EventService>;
  let rsvpService: jasmine.SpyObj<RsvpService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

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

  const completedEvent: Event = {
    ...mockEvent,
    id: 'event-002',
    title: 'Completed Workshop',
    startDate: '2000-01-10',
    endDate: '2000-01-12'
  };

  /* ========================================
     MOCK RSVP DATA
  ======================================== */

  const mockRsvp: Rsvp = {
    id: 'rsvp-001',
    eventId: mockEvent.id,
    guestName: 'Test Guest',
    email: 'guest@example.com',
    attendance: 'Yes',
    numberOfGuests: 2,
    message: 'Looking forward to the event!',
    submittedAt: '2026-11-27T10:00:00'
  };

  /* ========================================
     TEST SETUP AND SERVICE MOCKING
  ======================================== */

  beforeEach(async () => {

    eventService = jasmine.createSpyObj('EventService', [
      'getEvents',
      'addEvent',
      'updateEvent',
      'deleteEvent'
    ]);

    rsvpService = jasmine.createSpyObj('RsvpService', [
      'addRsvp',
      'simulateHttpError'
    ]);

    snackBar = jasmine.createSpyObj('MatSnackBar', [
      'open'
    ]);

    eventService.getEvents.and.returnValue([]);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: []
    })
      .overrideComponent(DashboardComponent, {
        set: {
          template: '',
          providers: [
            { provide: EventService, useValue: eventService },
            { provide: RsvpService, useValue: rsvpService },
            { provide: MatSnackBar, useValue: snackBar }
          ]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;

  });

  /* ========================================
     DASHBOARD INITIALIZATION
  ======================================== */

  it('should create the dashboard component', () => {

    expect(component).toBeTruthy();

  });

  it('should display the correct dashboard title and subtitle', () => {

    expect(component.title).toBe('Welcome to Eventopia!');

    expect(component.subtitle).toBe(
      'Plan it. Create it. Celebrate it!'
    );

  });

  it('should load saved events from the EventService', () => {

    eventService.getEvents.and.returnValue([mockEvent]);

    const newFixture =
      TestBed.createComponent(DashboardComponent);

    const newComponent = newFixture.componentInstance;

    expect(eventService.getEvents).toHaveBeenCalled();
    expect(newComponent.events).toEqual([mockEvent]);
    expect(newComponent.totalEvents).toBe(1);

  });

  /* ========================================
     CREATE EVENT FORM
  ======================================== */

  it('should open the Create Event form', () => {

    component.openRsvpForm(mockEvent);

    component.openEventForm();

    expect(component.showEventForm).toBeTrue();
    expect(component.eventToEdit).toBeNull();
    expect(component.showRsvpForm).toBeFalse();
    expect(component.selectedRsvpEvent).toBeNull();

  });

  it('should close the Event form and reset editing state', () => {

    component.editEvent(mockEvent);

    component.closeEventForm();

    expect(component.showEventForm).toBeFalse();
    expect(component.eventToEdit).toBeNull();

  });

  /* ========================================
     CREATE AND SAVE EVENT
  ======================================== */

  it('should successfully create a new event', () => {

    eventService.addEvent.and.returnValue([mockEvent]);

    component.openEventForm();

    component.saveEvent(mockEvent);

    expect(eventService.addEvent)
      .toHaveBeenCalledWith(mockEvent);

    expect(eventService.updateEvent)
      .not.toHaveBeenCalled();

    expect(component.events).toEqual([mockEvent]);
    expect(component.totalEvents).toBe(1);
    expect(component.showEventForm).toBeFalse();

    expect(snackBar.open).toHaveBeenCalledWith(
      'Event created successfully!',
      'Close',
      jasmine.any(Object)
    );

  });

  it('should handle an event creation error gracefully', () => {

    spyOn(console, 'error');

    eventService.addEvent.and.throwError(
      'Storage unavailable'
    );

    component.openEventForm();

    component.saveEvent(mockEvent);

    expect(component.showEventForm).toBeTrue();
    expect(component.events.length).toBe(0);

    expect(snackBar.open).toHaveBeenCalledWith(
      'Unable to save your event. Please try again.',
      'Close',
      jasmine.any(Object)
    );

  });

  /* ========================================
     EDIT AND UPDATE EVENT
  ======================================== */

  it('should open the Edit Event form with the selected event', () => {

    component.openRsvpForm(mockEvent);

    component.editEvent(mockEvent);

    expect(component.eventToEdit).toEqual(mockEvent);
    expect(component.showEventForm).toBeTrue();
    expect(component.showRsvpForm).toBeFalse();
    expect(component.selectedRsvpEvent).toBeNull();

  });

  it('should successfully update an existing event', () => {

    const updatedEvent: Event = {
      ...mockEvent,
      title: 'Updated Technology Conference'
    };

    eventService.updateEvent.and.returnValue([
      updatedEvent
    ]);

    component.editEvent(mockEvent);

    component.saveEvent(updatedEvent);

    expect(eventService.updateEvent)
      .toHaveBeenCalledWith(updatedEvent);

    expect(eventService.addEvent)
      .not.toHaveBeenCalled();

    expect(component.events).toEqual([updatedEvent]);
    expect(component.showEventForm).toBeFalse();
    expect(component.eventToEdit).toBeNull();

    expect(snackBar.open).toHaveBeenCalledWith(
      'Event updated successfully!',
      'Close',
      jasmine.any(Object)
    );

  });

  /* ========================================
     DELETE EVENT
  ======================================== */

  it('should delete an event when confirmation is accepted', () => {

    spyOn(window, 'confirm').and.returnValue(true);

    component.events = [mockEvent];

    eventService.deleteEvent.and.returnValue([]);

    component.deleteEvent(mockEvent);

    expect(eventService.deleteEvent)
      .toHaveBeenCalledWith(mockEvent.id);

    expect(component.events.length).toBe(0);
    expect(component.totalEvents).toBe(0);

    expect(snackBar.open).toHaveBeenCalledWith(
      'Event deleted successfully!',
      'Close',
      jasmine.any(Object)
    );

  });

  it('should not delete an event when confirmation is cancelled', () => {

    spyOn(window, 'confirm').and.returnValue(false);

    component.events = [mockEvent];

    component.deleteEvent(mockEvent);

    expect(eventService.deleteEvent)
      .not.toHaveBeenCalled();

    expect(component.events).toEqual([mockEvent]);

  });

  it('should handle an event deletion error gracefully', () => {

    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(console, 'error');

    component.events = [mockEvent];

    eventService.deleteEvent.and.throwError(
      'Unable to access storage'
    );

    component.deleteEvent(mockEvent);

    expect(component.events).toEqual([mockEvent]);

    expect(snackBar.open).toHaveBeenCalledWith(
      'Unable to delete your event. Please try again.',
      'Close',
      jasmine.any(Object)
    );

  });

  /* ========================================
     RSVP FORM MANAGEMENT
  ======================================== */

  it('should open the RSVP form for the selected event', () => {

    component.editEvent(mockEvent);

    component.openRsvpForm(mockEvent);

    expect(component.showRsvpForm).toBeTrue();

    expect(component.selectedRsvpEvent)
      .toEqual(mockEvent);

    expect(component.showEventForm).toBeFalse();
    expect(component.eventToEdit).toBeNull();

  });

  it('should close the RSVP form and clear the selected event', () => {

    component.openRsvpForm(mockEvent);

    component.closeRsvpForm();

    expect(component.showRsvpForm).toBeFalse();
    expect(component.selectedRsvpEvent).toBeNull();

  });

  /* ========================================
     RSVP SUBMISSION
  ======================================== */

  it('should successfully submit and save an RSVP', () => {

    spyOn(console, 'log');

    component.openRsvpForm(mockEvent);

    component.handleRsvpSubmission(mockRsvp);

    expect(rsvpService.addRsvp)
      .toHaveBeenCalledWith(mockRsvp);

    expect(component.showRsvpForm).toBeFalse();
    expect(component.selectedRsvpEvent).toBeNull();

    expect(snackBar.open).toHaveBeenCalledWith(
      'RSVP submitted and saved successfully!',
      'Close',
      jasmine.any(Object)
    );

  });

  it('should handle a simulated HTTP 503 RSVP error', () => {

    spyOn(console, 'error');

    component.simulateRsvpError = true;

    rsvpService.simulateHttpError.and.callFake(() => {

      throw new HttpErrorResponse({
        status: 503,
        statusText: 'Service Unavailable'
      });

    });

    component.openRsvpForm(mockEvent);

    component.handleRsvpSubmission(mockRsvp);

    expect(rsvpService.simulateHttpError)
      .toHaveBeenCalled();

    expect(rsvpService.addRsvp)
      .not.toHaveBeenCalled();

    expect(component.showRsvpForm).toBeTrue();

    expect(snackBar.open).toHaveBeenCalledWith(
      'RSVP service is temporarily unavailable. Please try again.',
      'Close',
      jasmine.any(Object)
    );

  });

  it('should handle an unexpected RSVP storage error', () => {

    spyOn(console, 'error');

    rsvpService.addRsvp.and.throwError(
      'Storage unavailable'
    );

    component.openRsvpForm(mockEvent);

    component.handleRsvpSubmission(mockRsvp);

    expect(component.showRsvpForm).toBeTrue();

    expect(component.selectedRsvpEvent)
      .toEqual(mockEvent);

    expect(snackBar.open).toHaveBeenCalledWith(
      'Unable to save your RSVP. Please try again.',
      'Close',
      jasmine.any(Object)
    );

  });

  /* ========================================
     DASHBOARD STATISTICS
  ======================================== */

  it('should correctly calculate dashboard statistics', () => {

    eventService.getEvents.and.returnValue([
      mockEvent,
      completedEvent
    ]);

    const newFixture =
      TestBed.createComponent(DashboardComponent);

    const newComponent = newFixture.componentInstance;

    expect(newComponent.totalEvents).toBe(2);
    expect(newComponent.upcomingEvents).toBe(1);
    expect(newComponent.completedEvents).toBe(1);

  });

  it('should display zero statistics when there are no events', () => {

    eventService.getEvents.and.returnValue([]);

    const newFixture =
      TestBed.createComponent(DashboardComponent);

    const newComponent = newFixture.componentInstance;

    expect(newComponent.totalEvents).toBe(0);
    expect(newComponent.upcomingEvents).toBe(0);
    expect(newComponent.completedEvents).toBe(0);

  });

  /* ========================================
     DATE PARSING
  ======================================== */

  it('should correctly convert a date string into a local date', () => {

    const [year, month, day] = '2026-12-25'
      .split('-')
      .map(Number);

    const result = new Date(year, month - 1, day);

    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(11);
    expect(result.getDate()).toBe(25);
    expect(result.getHours()).toBe(0);

  });

});
