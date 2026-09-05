# Jira Board

A client-side Jira-style Kanban Board built with Angular, TypeScript, and the native HTML5 Drag and Drop API.

## Prerequisites

- Node.js 22.22.3 or newer
- npm

No backend, database, or external API is required.

## Installation

Clone the repository and navigate to the project directory:

```bash
git clone <repository-url>
cd angular-jira-board
```

Install the project dependencies:

```bash
npm install
```

## Run the Application

Start the Angular development server:

```bash
npm start
```

Open the application in your browser:

```text
http://localhost:4200/
```

## Run Tests

Run the complete unit test suite in single-run mode:

```bash
npm test -- --watch=false
```

The project uses Vitest for unit testing.

## Build for Production

Create an optimized production build:

```bash
npm run build
```

The production build will be generated in the `dist/` directory.

## Technologies Used

- Angular 22
- TypeScript
- HTML5 & CSS
- Native HTML5 Drag and Drop API
- Browser localStorage API
- Angular Signals
- Vitest

## Project Structure

```text
src/app/
├── models/
│   ├── card.model.ts
│   ├── card-list.model.ts
│   └── board.model.ts
│
├── services/
│   ├── storage.service.ts
│   └── board.service.ts
│
├── components/
│   ├── board/
│   ├── board-list/
│   ├── card/
│   ├── add-list/
│   └── add-card/
│
├── app.component.*
└── styles.css
```

### Structure Overview

- **Models:** Define the board, lists, and cards.
- **Services:** Handle board state management and localStorage persistence.
- **Components:** Handle the board UI, lists, cards, and add-item dialogs.