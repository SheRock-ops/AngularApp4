
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

// Import the RSVP interface from the template-driven form.
import { Rsvp } from '../components/rsvp-form/rsvp-form.component';

@Injectable({
  providedIn: 'root'
})
export class RsvpService {

  /* ========================================
     LOCAL STORAGE CONFIGURATION
  ======================================== */

  // Unique localStorage key for Eventopia RSVP responses.
  private readonly storageKey = 'eventopiaRsvps';

  constructor() {}

  /* ========================================
     GET SAVED RSVP RESPONSES
  ======================================== */

  getRsvps(): Rsvp[] {

    const savedRsvps = localStorage.getItem(this.storageKey);

    if (!savedRsvps) {
      return [];
    }

    try {

      const rsvps: unknown = JSON.parse(savedRsvps);

      return Array.isArray(rsvps) ? rsvps as Rsvp[] : [];

    } catch (error) {

      console.error('Unable to load saved RSVPs:', error);

      return [];

    }

  }

  /* ========================================
     SAVE RSVP RESPONSES
  ======================================== */

  saveRsvps(rsvps: Rsvp[]): void {

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(rsvps)
    );

  }

  /* ========================================
     ADD A NEW RSVP
  ======================================== */

  addRsvp(rsvp: Rsvp): Rsvp[] {

    // Load existing guest responses.
    const rsvps = this.getRsvps();

    // Add the new RSVP.
    rsvps.push(rsvp);

    // Save the updated list.
    this.saveRsvps(rsvps);

    return rsvps;

  }

  /* ========================================
     GET RSVPS FOR A SPECIFIC EVENT
  ======================================== */

  getRsvpsByEvent(eventId: string): Rsvp[] {

    return this.getRsvps().filter(
      rsvp => rsvp.eventId === eventId
    );

  }

  /* ========================================
     DELETE AN RSVP
  ======================================== */

  deleteRsvp(rsvpId: string): Rsvp[] {

    const rsvps = this.getRsvps().filter(
      rsvp => rsvp.id !== rsvpId
    );

    this.saveRsvps(rsvps);

    return rsvps;

  }

  /* ========================================
     SIMULATE HTTP SERVER ERROR
  ======================================== */

  simulateHttpError(): never {

    // Simulate an HTTP 503 Service Unavailable response.
    // No actual network request is made.
    throw new HttpErrorResponse({
      status: 503,
      statusText: 'Service Unavailable',
      url: '/api/rsvps',
      error: {
        message: 'The RSVP service is temporarily unavailable.'
      }
    });

  }

}
