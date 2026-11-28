/// <reference types="jasmine" />

import { EventStatusPipe } from './event-status.pipe';

describe('EventStatusPipe', () => {

  let pipe: EventStatusPipe;

  // Fixed date ensures consistent test results.
  const today = new Date(2026, 10, 27);

  beforeEach(() => {

    pipe = new EventStatusPipe();

  });

  /* ========================================
     PIPE INITIALIZATION
  ======================================== */

  it('should create the pipe', () => {

    expect(pipe).toBeTruthy();

  });

  /* ========================================
     UPCOMING EVENTS
  ======================================== */

  it('should return Upcoming for a future event', () => {

    expect(
      pipe.transform(
        '2026-12-01',
        '2026-12-05',
        today
      )
    ).toBe('Upcoming');

  });

  /* ========================================
     ONGOING EVENTS
  ======================================== */

  it('should return Ongoing for an active event', () => {

    expect(
      pipe.transform(
        '2026-11-25',
        '2026-11-30',
        today
      )
    ).toBe('Ongoing');

  });

  it('should return Ongoing on the start date', () => {

    expect(
      pipe.transform(
        '2026-11-27',
        '2026-11-30',
        today
      )
    ).toBe('Ongoing');

  });

  it('should return Ongoing on the end date', () => {

    expect(
      pipe.transform(
        '2026-11-20',
        '2026-11-27',
        today
      )
    ).toBe('Ongoing');

  });

  it('should support single-day events', () => {

    expect(
      pipe.transform(
        '2026-11-27',
        '2026-11-27',
        today
      )
    ).toBe('Ongoing');

  });

  /* ========================================
     COMPLETED EVENTS
  ======================================== */

  it('should return Completed for a past event', () => {

    expect(
      pipe.transform(
        '2026-11-01',
        '2026-11-20',
        today
      )
    ).toBe('Completed');

  });

  /* ========================================
     INVALID DATE HANDLING
  ======================================== */

  it('should handle a missing start date', () => {

    expect(
      pipe.transform(
        '',
        '2026-11-30',
        today
      )
    ).toBe('Unknown');

  });

  it('should handle a missing end date', () => {

    expect(
      pipe.transform(
        '2026-11-25',
        '',
        today
      )
    ).toBe('Unknown');

  });

  it('should handle invalid date strings', () => {

    expect(
      pipe.transform(
        'invalid-date',
        '2026-11-30',
        today
      )
    ).toBe('Unknown');

  });

  it('should reject impossible calendar dates', () => {

    expect(
      pipe.transform(
        '2026-02-30',
        '2026-03-05',
        today
      )
    ).toBe('Unknown');

  });

  it('should reject an invalid date range', () => {

    expect(
      pipe.transform(
        '2026-12-10',
        '2026-12-01',
        today
      )
    ).toBe('Unknown');

  });

});
