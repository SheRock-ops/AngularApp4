/// <reference types="jasmine" />

import { Component } from '@angular/core';

import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { By } from '@angular/platform-browser';

import {
  EventHighlightDirective
} from './event-highlight.directive';

/* ========================================
   TEST HOST COMPONENT
======================================== */

@Component({
  standalone: true,
  imports: [EventHighlightDirective],
  template: `
    <div [appEventHighlight]="status">
      Sample Event
    </div>
  `
})
class TestHostComponent {

  status = 'Upcoming';

}

/* ========================================
   EVENT HIGHLIGHT DIRECTIVE TESTS
======================================== */

describe('EventHighlightDirective', () => {

  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let element: HTMLElement;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(
      TestHostComponent
    );

    component = fixture.componentInstance;

    fixture.detectChanges();

    element = fixture.debugElement.query(
      By.directive(EventHighlightDirective)
    ).nativeElement;

  });

  /* ========================================
     DIRECTIVE INITIALIZATION
  ======================================== */

  it('should create the directive', () => {

    const directive = fixture.debugElement.query(
      By.directive(EventHighlightDirective)
    );

    expect(directive).toBeTruthy();

  });

  /* ========================================
     UPCOMING EVENT
  ======================================== */

  it('should highlight upcoming events in blue', () => {

    component.status = 'Upcoming';

    fixture.detectChanges();

    expect(element.style.borderLeftColor)
      .toBe('rgb(37, 99, 235)');

  });

  /* ========================================
     ONGOING EVENT
  ======================================== */

  it('should highlight ongoing events in green', () => {

    component.status = 'Ongoing';

    fixture.detectChanges();

    expect(element.style.borderLeftColor)
      .toBe('rgb(22, 163, 74)');

  });

  /* ========================================
     COMPLETED EVENT
  ======================================== */

  it('should highlight completed events in purple', () => {

    component.status = 'Completed';

    fixture.detectChanges();

    expect(element.style.borderLeftColor)
      .toBe('rgb(147, 51, 234)');

  });

  /* ========================================
     UNKNOWN EVENT STATUS
  ======================================== */

  it('should use gray for an unknown status', () => {

    component.status = 'Unknown';

    fixture.detectChanges();

    expect(element.style.borderLeftColor)
      .toBe('rgb(148, 163, 184)');

  });

  it('should handle an empty status', () => {

    component.status = '';

    fixture.detectChanges();

    expect(element.style.borderLeftColor)
      .toBe('rgb(148, 163, 184)');

  });

  /* ========================================
     BORDER STYLING
  ======================================== */

  it('should apply a five-pixel border', () => {

    expect(element.style.borderLeftWidth)
      .toBe('5px');

  });

  it('should apply a solid border', () => {

    expect(element.style.borderLeftStyle)
      .toBe('solid');

  });

  /* ========================================
     STATUS ATTRIBUTE
  ======================================== */

  it('should expose the event status attribute', () => {

    expect(
      element.getAttribute('data-event-status')
    ).toBe('Upcoming');

  });

  it('should use Unknown when status is empty', () => {

    component.status = '';

    fixture.detectChanges();

    expect(
      element.getAttribute('data-event-status')
    ).toBe('Unknown');

  });

  /* ========================================
     DYNAMIC STATUS CHANGES
  ======================================== */

  it('should update styling when status changes', () => {

    component.status = 'Upcoming';

    fixture.detectChanges();

    expect(element.style.borderLeftColor)
      .toBe('rgb(37, 99, 235)');

    component.status = 'Completed';

    fixture.detectChanges();

    expect(element.style.borderLeftColor)
      .toBe('rgb(147, 51, 234)');

    expect(
      element.getAttribute('data-event-status')
    ).toBe('Completed');

  });

});
