# Relationship Timeline App

A secure web application that allows users to create and manage a timeline of their relationship history, upload photos, documents, and collaborate with their legal counsel.

## Features

- **User Authentication**: Secure login for both clients and lawyers
- **Timeline Management**: Create, update, and delete events in your relationship timeline
- **Media Upload**: Attach photos and documents to timeline events
- **Collaboration**: Allow your lawyer to view, edit, and comment on your timeline
- **Export Functionality**: Export your timeline to PDF or Word documents

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB
- **Authentication**: NextAuth.js
- **File Storage**: Cloudinary
- **Export**: react-pdf, docx.js

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB database (local or Atlas)
- Cloudinary account for media storage

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/relationship-timeline-app.git
   cd relationship-timeline-app
   ```

2. Install dependencies:
   ```
   npm install
   ```
   
3. Create a `.env.local` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/src/app`: Next.js app router pages and API routes
- `/src/components`: React components
- `/src/lib`: Utility functions and configurations
- `/src/models`: MongoDB models
- `/src/styles`: Global styles and Tailwind configuration

## Deployment

This application can be deployed to platforms like Vercel, Netlify, or any Node.js hosting provider:

1. Push your code to a Git repository
2. Connect your repository to Vercel or your preferred hosting service
3. Configure the environment variables
4. Deploy!

## License

MIT 