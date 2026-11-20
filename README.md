# 🎉 Eventopia

### Plan it. Create it. Celebrate it!

**Eventopia** is a modern event-planning web application developed with Angular, TypeScript, and Angular Material as part of **Angular Assignment 4**.

The application helps users create, organize, manage, and celebrate events through a colourful, responsive interface.


## ✨ Features

### 📅 Event Management
- Create events using a reactive form.
- Edit existing event information.
- Delete events with confirmation.
- Display events in organized cards.
- View total, upcoming, and completed event statistics.

### 💌 RSVP Management
- Submit guest responses using a template-driven form.
- Enter guest name, email, attendance, and number of guests.
- Include an optional message for the event organizer.
- Save RSVP submissions for individual events.

### ✅ Form Validation
- Required-field validation.
- Email format validation.
- Minimum and maximum field constraints.
- Custom validator to prevent duplicate event titles.
- Custom date-range validator to ensure the end date is not earlier than the start date.
- User-friendly validation messages.

### 🎨 Angular Material
The interface uses Angular Material components, including:

- Form fields and inputs
- Select menus
- Date pickers
- Buttons and icons
- Cards
- Snackbar notifications

### 💾 Data Persistence
Eventopia uses browser `localStorage` to save event and RSVP information.

Saved information remains available after refreshing the application in the same browser, unless the browser's site data is cleared.

### ⚠️ Error Handling
- Simulated HTTP 503 Service Unavailable error.
- Friendly snackbar notifications for successful and failed operations.
- RSVP form remains open when saving fails.
- Guest information is preserved for retrying.

**Note:** HTTP errors are simulated for demonstration. The application does not currently use a live backend API.

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Angular | Front-end application framework |
| TypeScript | Application logic and type safety |
| Angular Material | User interface components |
| HTML5 | Application structure |
| CSS3 | Styling and responsive design |
| Reactive Forms | Event creation and editing |
| Template-Driven Forms | RSVP submissions |
| localStorage | Browser-based data persistence |
| Git & GitHub | Version control and project hosting |


## 🔮 Future Enhancements

Potential improvements include:

- Backend API and database integration.
- User authentication and personalized dashboards.
- RSVP attendee lists and attendance statistics.
- Email invitations and notifications.
- Event search, sorting, and filtering.
- Calendar integration.

---

## 💜 Project Motto

*Every unforgettable moment begins with a plan.*

**Eventopia — Plan it. Create it. Celebrate it!**

---

© 2026 Eventopia. All rights reserved.

