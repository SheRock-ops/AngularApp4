import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'eventStatus',
  standalone: true
})
export class EventStatusPipe implements PipeTransform {

  /* ========================================
     EVENTOPIA - EVENT STATUS PIPE
  ======================================== */

  transform(
    startDate: string,
    endDate: string,
    referenceDate: Date = new Date()
  ): string {

    // Handle missing or invalid dates.
    if (!startDate || !endDate) {
      return 'Unknown';
    }

    const start = this.parseDate(startDate);
    const end = this.parseDate(endDate);

    if (!start || !end || end < start) {
      return 'Unknown';
    }

    // Compare dates without time.
    const today = new Date(referenceDate);
    today.setHours(0, 0, 0, 0);

    // Event has not started.
    if (today < start) {
      return 'Upcoming';
    }

    // Event has already ended.
    if (today > end) {
      return 'Completed';
    }

    // Event is currently happening.
    return 'Ongoing';

  }

  /* ========================================
     DATE CONVERSION HELPER
  ======================================== */

  private parseDate(value: string): Date | null {

    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return null;
    }

    const [year, month, day] = value
      .split('-')
      .map(Number);

    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return date;

  }

}