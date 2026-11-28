
/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';
import { EventService } from './event.service';
import { Event } from '../models/event';

describe('EventService', () => {

  let service: EventService;
  let getItemSpy: jasmine.Spy;
  let setItemSpy: jasmine.Spy;

  const storageKey = 'eventopiaEvents';

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

  const secondEvent: Event = {
    ...mockEvent,
    id: 'event-002',
    title: 'Creative Design Workshop',
    category: 'Other',
    capacity: 50
  };

  /* ========================================
     TEST SETUP AND STORAGE MOCKING
  ======================================== */

  beforeEach(() => {

    getItemSpy = spyOn(
      Storage.prototype,
      'getItem'
    ).and.returnValue(null);

    setItemSpy = spyOn(
      Storage.prototype,
      'setItem'
    ).and.stub();

    TestBed.configureTestingModule({});

    service = TestBed.inject(EventService);

  });

  /* ========================================
     TEST 1: SERVICE INITIALIZATION
  ======================================== */

  it('should create the EventService', () => {

    expect(service).toBeTruthy();

  });

  /* ========================================
     TEST 2: RETRIEVE SAVED EVENTS
  ======================================== */

  it('should retrieve saved events from localStorage', () => {

    getItemSpy.and.returnValue(
      JSON.stringify([mockEvent, secondEvent])
    );

    const events = service.getEvents();

    expect(getItemSpy)
      .toHaveBeenCalledWith(storageKey);

    expect(events).toEqual([
      mockEvent,
      secondEvent
    ]);

    expect(events.length).toBe(2);

  });

  /* ========================================
     TEST 3: EMPTY STORAGE
  ======================================== */

  it('should return an empty array when no events are saved', () => {

    getItemSpy.and.returnValue(null);

    const events = service.getEvents();

    expect(events).toEqual([]);
    expect(events.length).toBe(0);

  });

  /* ========================================
     TEST 4: INVALID JSON
  ======================================== */

  it('should handle invalid JSON without crashing', () => {

    const errorSpy = spyOn(console, 'error');

    getItemSpy.and.returnValue(
      'invalid-json-data'
    );

    const events = service.getEvents();

    expect(events).toEqual([]);

    expect(errorSpy).toHaveBeenCalledWith(
      'Unable to load saved events:',
      jasmine.any(Error)
    );

  });

  /* ========================================
     TEST 5: INVALID STORAGE FORMAT
  ======================================== */

  it('should return an empty array when stored JSON is not an array', () => {

    getItemSpy.and.returnValue(
      JSON.stringify({
        title: 'Invalid event collection'
      })
    );

    expect(service.getEvents()).toEqual([]);

  });

  /* ========================================
     TEST 6: SAVE EVENTS
  ======================================== */

  it('should save events to localStorage as JSON', () => {

    const events = [
      mockEvent,
      secondEvent
    ];

    service.saveEvents(events);

    expect(setItemSpy).toHaveBeenCalledWith(
      storageKey,
      JSON.stringify(events)
    );

    expect(setItemSpy)
      .toHaveBeenCalledTimes(1);

  });

  /* ========================================
     TEST 7: CREATE EVENT
  ======================================== */

  it('should add a new event while preserving existing events', () => {

    getItemSpy.and.returnValue(
      JSON.stringify([mockEvent])
    );

    const result = service.addEvent(secondEvent);

    expect(result).toEqual([
      mockEvent,
      secondEvent
    ]);

    expect(result.length).toBe(2);

    expect(setItemSpy).toHaveBeenCalledWith(
      storageKey,
      JSON.stringify([
        mockEvent,
        secondEvent
      ])
    );

  });

  /* ========================================
     TEST 8: UPDATE EVENT
  ======================================== */

  it('should update only the event matching the selected ID', () => {

    getItemSpy.and.returnValue(
      JSON.stringify([
        mockEvent,
        secondEvent
      ])
    );

    const updatedEvent: Event = {
      ...mockEvent,
      title: 'Updated Technology Conference',
      capacity: 150
    };

    const result = service.updateEvent(updatedEvent);

    expect(result.length).toBe(2);

    expect(result[0]).toEqual(updatedEvent);

    expect(result[1]).toEqual(secondEvent);

    expect(setItemSpy).toHaveBeenCalledWith(
      storageKey,
      JSON.stringify([
        updatedEvent,
        secondEvent
      ])
    );

  });

  /* ========================================
     TEST 9: DELETE EVENT
  ======================================== */

  it('should delete only the event matching the selected ID', () => {

    getItemSpy.and.returnValue(
      JSON.stringify([
        mockEvent,
        secondEvent
      ])
    );

    const result = service.deleteEvent(
      mockEvent.id
    );

    expect(result.length).toBe(1);

    expect(result).toEqual([secondEvent]);

    expect(setItemSpy).toHaveBeenCalledWith(
      storageKey,
      JSON.stringify([secondEvent])
    );

  });

  /* ========================================
     TEST 10: STORAGE ERROR HANDLING
  ======================================== */

  it('should propagate storage errors to the calling component', () => {

    setItemSpy.and.throwError(
      'Storage unavailable'
    );

    expect(() => {
      service.addEvent(mockEvent);
    }).toThrowError('Storage unavailable');

    expect(setItemSpy)
      .toHaveBeenCalledTimes(1);

  });

});
