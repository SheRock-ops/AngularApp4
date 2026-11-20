
import { Injectable } from '@angular/core';

// Import the Event model.
import { Event } from '../models/event';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  /* ========================================
     EVENT STORAGE
  ======================================== */

  // Browser storage key for Eventopia events.
  private readonly storageKey = 'eventopiaEvents';

  constructor() { }

  /* ========================================
     GET ALL EVENTS
  ======================================== */

  getEvents(): Event[] {

    // Retrieve saved events from localStorage.
    const savedEvents = localStorage.getItem(this.storageKey);

    if (!savedEvents) {
      return [];
    }

    try {

      // Convert stored JSON back into an array of events.
      const events: unknown = JSON.parse(savedEvents);

      return Array.isArray(events) ? events as Event[] : [];

    } catch (error) {

      // Handle invalid stored data gracefully.
      console.error('Unable to load saved events:', error);

      return [];

    }

  }

  /* ========================================
     SAVE ALL EVENTS
  ======================================== */

  saveEvents(events: Event[]): void {

    // Store the event list as JSON.
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(events)
    );

  }

  /* ========================================
     CREATE EVENT
  ======================================== */

  addEvent(event: Event): Event[] {

    // Retrieve existing events.
    const events = this.getEvents();

    // Add the new event.
    events.push(event);

    // Save the updated event list.
    this.saveEvents(events);

    return events;

  }

  /* ========================================
     UPDATE EVENT
  ======================================== */

  updateEvent(updatedEvent: Event): Event[] {

    // Replace the event matching the selected ID.
    const events = this.getEvents().map(event =>
      event.id === updatedEvent.id
        ? updatedEvent
        : event
    );

    // Save the updated event list.
    this.saveEvents(events);

    return events;

  }

  /* ========================================
     DELETE EVENT
  ======================================== */

  deleteEvent(eventId: string): Event[] {

    // Remove the selected event.
    const events = this.getEvents().filter(
      event => event.id !== eventId
    );

    // Save the remaining events.
    this.saveEvents(events);

    return events;

  }

}

