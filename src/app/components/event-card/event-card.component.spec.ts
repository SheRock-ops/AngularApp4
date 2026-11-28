
/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EventCardComponent } from './event-card.component';
import { Event } from '../../models/event';

describe('EventCardComponent', () => {

  let component: EventCardComponent;
  let fixture: ComponentFixture<EventCardComponent>;

  /* ========================================
     MOCK EVENT DATA
  ======================================== */

  const mockEvent: Event = {
    id: 'event-001',
    title: 'Technology Conference',
    category: 'Conference',
    status: 'upcoming',
    startDate: '2099-12-10',
    endDate: '2099-12-12',
    time: '10:00',
    location: 'Toronto',
    description: 'An exciting technology conference.',
    capacity: 100,
    createdAt: '2026-11-27T10:00:00'
  };

  /* ========================================
     TEST SETUP
  ======================================== */

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [EventCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EventCardComponent);
    component = fixture.componentInstance;

    // Provide the required Event input.
    fixture.componentRef.setInput('event', { ...mockEvent });

    // Render the actual HTML template.
    fixture.detectChanges();

  });

  /* ========================================
     COMPONENT INITIALIZATION
  ======================================== */

  it('should create the event card component', () => {

    expect(component).toBeTruthy();

    expect(component.event).toEqual(mockEvent);

  });

  /* ========================================
     EVENT TITLE
  ======================================== */

  it('should display the correct event title', () => {

    const title = fixture.debugElement.query(
      By.css('h3')
    );

    expect(title.nativeElement.textContent.trim())
      .toBe(mockEvent.title);

  });

  /* ========================================
     EVENT CATEGORY
  ======================================== */

  it('should display the correct event category', () => {

    const category = fixture.debugElement.query(
      By.css('.event-category')
    );

    expect(category.nativeElement.textContent.trim())
      .toBe(mockEvent.category);

  });

  /* ========================================
     EVENT DETAILS
  ======================================== */

  it('should display the event location, time, capacity and description', () => {

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent)
      .toContain(mockEvent.location);

    expect(compiled.textContent)
      .toContain(mockEvent.time);

    expect(compiled.textContent)
      .toContain('Maximum 100 attendees');

    const description = compiled.querySelector(
      '.event-description'
    );

    expect(description?.textContent?.trim())
      .toBe(mockEvent.description);

  });

  /* ========================================
     CONDITIONAL DATE DISPLAY
  ======================================== */

  it('should display a date range for multi-day events and a single date for one-day events', () => {

    const getDateText = (): string => {

      const dateElement = fixture.debugElement.query(
        By.css('.event-detail span')
      );

      return dateElement.nativeElement.textContent.trim();

    };

    // Multi-day event.
    expect(getDateText()).toContain('–');

    // Change the event to a single-day event.
    fixture.componentRef.setInput('event', {
      ...mockEvent,
      endDate: mockEvent.startDate
    });

    fixture.detectChanges();

    expect(getDateText()).not.toContain('–');

  });

  /* ========================================
     EDIT BUTTON
  ======================================== */

  it('should emit the selected event when the Edit button is clicked', () => {

    const editSpy = spyOn(
      component.editRequested,
      'emit'
    );

    const editButton = fixture.debugElement.query(
      By.css('.edit-button')
    );

    editButton.nativeElement.click();

    expect(editSpy).toHaveBeenCalledWith(mockEvent);

    expect(editSpy).toHaveBeenCalledTimes(1);

  });

  /* ========================================
     DELETE BUTTON
  ======================================== */

  it('should emit the selected event when the Delete button is clicked', () => {

    const deleteSpy = spyOn(
      component.deleteRequested,
      'emit'
    );

    const deleteButton = fixture.debugElement.query(
      By.css('.delete-button')
    );

    deleteButton.nativeElement.click();

    expect(deleteSpy).toHaveBeenCalledWith(mockEvent);

    expect(deleteSpy).toHaveBeenCalledTimes(1);

  });

  /* ========================================
     RSVP BUTTON
  ======================================== */

  it('should emit the selected event when the RSVP button is clicked', () => {

    const rsvpSpy = spyOn(
      component.rsvpRequested,
      'emit'
    );

    const rsvpButton = fixture.debugElement.query(
      By.css('.rsvp-button')
    );

    rsvpButton.nativeElement.click();

    expect(rsvpSpy).toHaveBeenCalledWith(mockEvent);

    expect(rsvpSpy).toHaveBeenCalledTimes(1);

  });

});
