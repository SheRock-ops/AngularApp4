# 🎉 Eventopia

### Plan it. Create it. Celebrate it!

**Eventopia** is a modern event-planning web application developed with Angular, TypeScript, and Angular Material as part of **Angular Assignment 4**.

The application helps users create, organize, manage, and celebrate events through a colourful, responsive interface.

---

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

---

## 🚀 Getting Started

### Prerequisites

Install Node.js and npm before running the application.

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/SheRock-ops/AngularApp4.git
```

**2. Navigate to the project directory**

```bash
cd AngularApp4
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the development server**

```bash
npx ng serve --port 4201
```

**5. Open the application**

Visit:

http://localhost:4201

---

## 🧪 Testing and Validation

The application supports the following test scenarios:

| Test | Expected Result |
|---|---|
| Create a valid event | Event is saved and displayed |
| Enter a duplicate event title | Validation error appears |
| Enter an invalid date range | Form prevents submission |
| Edit an event | Updated information is displayed |
| Delete an event | Event is removed after confirmation |
| Submit a valid RSVP | Success notification appears |
| Refresh the browser | Saved data remains available |
| Simulate an HTTP error | Error notification appears and RSVP form stays open |

### Simulated HTTP Error Testing

In `dashboard.component.ts`, temporarily change:

```typescript
simulateRsvpError = false;
```

to:

```typescript
simulateRsvpError = true;
```

Submit an RSVP to test the simulated server failure.

**Important:** Restore the value to `false` after testing.

---

## 📂 Project Structure

```text
src/
└── app/
    ├── components/
    │   ├── dashboard/
    │   ├── event-card/
    │   ├── event-form/
    │   ├── event-list/
    │   └── rsvp-form/
    ├── models/
    │   └── event.ts
    └── services/
        ├── event.service.ts
        └── rsvp.service.ts
```

---

## 🎓 Academic Project

**Course:** Angular Development

**Assignment:** Angular Assignment 4

**Project:** Eventopia — Event Planning Application

**Developer:** Sheila Mae Dalisay-Duremdes

---

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

