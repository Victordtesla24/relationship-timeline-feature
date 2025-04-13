# Relationship Timeline App

A web application for documenting, organizing, and sharing relationship timelines. This application allows users to create relationship timelines with events and media attachments.

## Features

- Create and manage multiple relationships
- Add events with dates, descriptions, and media attachments
- Upload photos and documents to support each event
- Export timelines as PDF or Word documents
- Simple and intuitive user interface
- No login or authentication required
- No database setup necessary - uses localStorage

## Technical Overview

This application is built with:

- Next.js for the React framework
- Tailwind CSS for styling
- LocalStorage for data persistence (no database required)
- Client-side rendering for most components

## Data Storage

The application uses browser localStorage for data persistence, making it simple to run without any database setup or authentication requirements. All data is stored locally in the user's browser.

**Note:** Data will be lost if browser storage is cleared or when using a different browser or device.

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/relationship-timeline-app.git
cd relationship-timeline-app
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Dashboard**: View a summary of your relationships and recent activity
2. **Relationships**: Create and manage your relationships
3. **Timeline**: View events in chronological order
4. **Export**: Generate PDF or Word documents of your timelines

## No Authentication or Database Required

This application doesn't require login or authentication. Users can start using the application immediately without creating an account. All data is stored in the browser's localStorage.

The application is designed to be simple and self-contained:
- No MongoDB or other database setup required
- No user accounts or authentication needed
- All data persists in the browser's localStorage
- No server-side data storage 