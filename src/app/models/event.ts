/* ========================================
   EVENTOPIA - EVENT MODEL
   Defines the structure of an event.
======================================== */

// Available event categories.
export type EventCategory =
  | 'Birthday'
  | 'Wedding'
  | 'Meeting'
  | 'Conference'
  | 'Celebration'
  | 'Travel'
  | 'Other';

// Represents one event in Eventopia.
export interface Event {
status: string;

  // Unique identifier for each event.
  id: string;

  // Basic event information.
  title: string;
  category: EventCategory;
  description: string;
  location: string;

  // Event schedule.
  startDate: string;
  endDate: string;
  time: string;

  // Maximum number of attendees.
  capacity: number;

  // Date the event was created.
  createdAt: string;

}