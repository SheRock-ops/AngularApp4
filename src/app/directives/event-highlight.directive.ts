import {
  Directive,
  Input,
  HostBinding
} from '@angular/core';

@Directive({
  selector: '[appEventHighlight]',
  standalone: true
})
export class EventHighlightDirective {

  /* ========================================
     EVENTOPIA - EVENT HIGHLIGHT DIRECTIVE
  ======================================== */

  // Receives the event status from the Event Status Pipe.
  @Input() appEventHighlight = '';

  /* ========================================
     DYNAMIC BORDER COLOR
  ======================================== */

  @HostBinding('style.borderLeft')
  get borderLeft(): string {

    switch (this.appEventHighlight) {

      case 'Upcoming':
        return '5px solid #2563eb';

      case 'Ongoing':
        return '5px solid #16a34a';

      case 'Completed':
        return '5px solid #9333ea';

      default:
        return '5px solid #94a3b8';

    }

  }

  /* ========================================
     ACCESSIBLE STATUS ATTRIBUTE
  ======================================== */

  @HostBinding('attr.data-event-status')
  get eventStatus(): string {

    return this.appEventHighlight || 'Unknown';

  }

}