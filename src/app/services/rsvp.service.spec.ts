
/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';

import { RsvpService } from './rsvp.service';
import { Rsvp } from '../components/rsvp-form/rsvp-form.component';

describe('RsvpService', () => {

  let service: RsvpService;

  let getItemSpy: jasmine.Spy;
  let setItemSpy: jasmine.Spy;

  const storageKey = 'eventopiaRsvps';

  /* ========================================
     MOCK RSVP DATA
  ======================================== */

  const mockRsvp: Rsvp = {
    id: 'rsvp-001',
    eventId: 'event-001',
    guestName: 'Test Guest',
    email: 'guest@example.com',
    attendance: 'Yes',
    numberOfGuests: 2,
    message: 'Looking forward to the event!',
    submittedAt: '2026-11-27T10:00:00'
  };

  const secondRsvp: Rsvp = {
    ...mockRsvp,
    id: 'rsvp-002',
    guestName: 'Second Guest',
    email: 'second@example.com',
    numberOfGuests: 3
  };

  const thirdRsvp: Rsvp = {
    ...mockRsvp,
    id: 'rsvp-003',
    eventId: 'event-002',
    guestName: 'Third Guest',
    email: 'third@example.com',
    numberOfGuests: 1
  };

  /* ========================================
     TEST SETUP AND STORAGE MOCKING
  ======================================== */

  beforeEach(() => {

    // Mock localStorage without modifying actual data.
    getItemSpy = spyOn(
      Storage.prototype,
      'getItem'
    ).and.returnValue(null);

    setItemSpy = spyOn(
      Storage.prototype,
      'setItem'
    ).and.stub();

    TestBed.configureTestingModule({});

    service = TestBed.inject(RsvpService);

  });

  /* ========================================
     SERVICE INITIALIZATION
  ======================================== */

  it('should create the RsvpService', () => {

    expect(service).toBeTruthy();

  });

  /* ========================================
     RETRIEVE SAVED RSVPS
  ======================================== */

  it('should retrieve saved RSVPs from localStorage', () => {

    getItemSpy.and.returnValue(
      JSON.stringify([
        mockRsvp,
        secondRsvp
      ])
    );

    const result = service.getRsvps();

    expect(getItemSpy)
      .toHaveBeenCalledWith(storageKey);

    expect(result).toEqual([
      mockRsvp,
      secondRsvp
    ]);

    expect(result.length).toBe(2);

  });

  /* ========================================
     EMPTY STORAGE
  ======================================== */

  it('should return an empty array when no RSVPs are saved', () => {

    getItemSpy.and.returnValue(null);

    const result = service.getRsvps();

    expect(result).toEqual([]);

    expect(result.length).toBe(0);

  });

  /* ========================================
     INVALID JSON ERROR HANDLING
  ======================================== */

  it('should handle invalid JSON without crashing', () => {

    const errorSpy = spyOn(console, 'error');

    getItemSpy.and.returnValue(
      'invalid-rsvp-json'
    );

    const result = service.getRsvps();

    expect(result).toEqual([]);

    expect(errorSpy).toHaveBeenCalledWith(
      'Unable to load saved RSVPs:',
      jasmine.any(Error)
    );

  });

  /* ========================================
     INVALID STORAGE FORMAT
  ======================================== */

  it('should return an empty array when stored JSON is not an array', () => {

    getItemSpy.and.returnValue(
      JSON.stringify({
        guestName: 'Invalid RSVP collection'
      })
    );

    const result = service.getRsvps();

    expect(result).toEqual([]);

  });

  /* ========================================
     SAVE RSVP RESPONSES
  ======================================== */

  it('should save RSVP responses to localStorage as JSON', () => {

    const rsvps = [
      mockRsvp,
      secondRsvp
    ];

    service.saveRsvps(rsvps);

    expect(setItemSpy).toHaveBeenCalledWith(
      storageKey,
      JSON.stringify(rsvps)
    );

    expect(setItemSpy)
      .toHaveBeenCalledTimes(1);

  });

  /* ========================================
     ADD NEW RSVP
  ======================================== */

  it('should add a new RSVP while preserving existing responses', () => {

    getItemSpy.and.returnValue(
      JSON.stringify([mockRsvp])
    );

    const result = service.addRsvp(
      secondRsvp
    );

    expect(result).toEqual([
      mockRsvp,
      secondRsvp
    ]);

    expect(result.length).toBe(2);

    expect(setItemSpy).toHaveBeenCalledWith(
      storageKey,
      JSON.stringify([
        mockRsvp,
        secondRsvp
      ])
    );

  });

  /* ========================================
     FILTER RSVPS BY EVENT
  ======================================== */

  it('should return only RSVPs belonging to the selected event', () => {

    getItemSpy.and.returnValue(
      JSON.stringify([
        mockRsvp,
        secondRsvp,
        thirdRsvp
      ])
    );

    const result = service.getRsvpsByEvent(
      'event-001'
    );

    expect(result.length).toBe(2);

    expect(result).toEqual([
      mockRsvp,
      secondRsvp
    ]);

    expect(result.every(
      rsvp => rsvp.eventId === 'event-001'
    )).toBeTrue();

  });

  it('should return an empty array when an event has no RSVPs', () => {

    getItemSpy.and.returnValue(
      JSON.stringify([
        mockRsvp,
        secondRsvp
      ])
    );

    const result = service.getRsvpsByEvent(
      'unknown-event'
    );

    expect(result).toEqual([]);

  });

  /* ========================================
     DELETE RSVP
  ======================================== */

  it('should delete only the RSVP matching the selected ID', () => {

    getItemSpy.and.returnValue(
      JSON.stringify([
        mockRsvp,
        secondRsvp,
        thirdRsvp
      ])
    );

    const result = service.deleteRsvp(
      mockRsvp.id
    );

    expect(result.length).toBe(2);

    expect(result).toEqual([
      secondRsvp,
      thirdRsvp
    ]);

    expect(setItemSpy).toHaveBeenCalledWith(
      storageKey,
      JSON.stringify([
        secondRsvp,
        thirdRsvp
      ])
    );

  });

  /* ========================================
     STORAGE ERROR HANDLING
  ======================================== */

  it('should propagate storage errors to the calling component', () => {

    setItemSpy.and.throwError(
      'Storage unavailable'
    );

    expect(() => {
      service.addRsvp(mockRsvp);
    }).toThrowError('Storage unavailable');

    expect(setItemSpy)
      .toHaveBeenCalledTimes(1);

  });

  /* ========================================
     SIMULATED HTTP 503 ERROR
  ======================================== */

  it('should throw an HTTP 503 Service Unavailable error', () => {

    let capturedError: unknown;

    try {

      service.simulateHttpError();

    } catch (error) {

      capturedError = error;

    }

    expect(capturedError)
      .toBeInstanceOf(HttpErrorResponse);

    const httpError =
      capturedError as HttpErrorResponse;

    expect(httpError.status).toBe(503);

    expect(httpError.statusText)
      .toBe('Service Unavailable');

    expect(httpError.url)
      .toBe('/api/rsvps');

    expect(httpError.error.message).toBe(
      'The RSVP service is temporarily unavailable.'
    );

    expect(setItemSpy)
      .not.toHaveBeenCalled();

  });

});
