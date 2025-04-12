# REQUIREMENTS DOCUMENT

## High level Requirements
I want to build a simple and straightward relationship timeline web app, where I can login with my username and password and create a timeline for my relationship with my ex, upload fotos, documents, dates, comments and more. I also want my lawyer to be able to log in this app and be able to view, edit and ask questions regarding any point in time on my timeline

I want a polished, professional and user friendly UI with advanced and polished visuals. I also want to keep the app simple and straightforward without over complicating things

The Core Features: 
  - Be able to log in using my username and password (including my lawyer)
  - Be able to view my relationship timeline
  - Be able to add, update and delete a node within a timeline
  - Be able to update dates in any given node within a timeline
  - Be able to update a node with photos, comments etc.
  - Be able to export the timeline in word or a pdf document

## High level Solution Design
The solution will be a simple yet secure web application focused on timeline management with these core features:

1. **Authentication System**
   - Secure login for client and lawyer
   - Role-based access (client vs lawyer)
   - Password protection
   - Session management

2. **Timeline Management**
   - Interactive timeline view
   - Event node creation, editing, and deletion
   - Date management for each event
   - Filtering and searching capabilities

3. **Media Handling**
   - Photo and document uploads
   - Media preview and organization
   - Storage and retrieval

4. **Collaboration**
   - Comments on timeline events
   - Q&A between client and lawyer

5. **Export Functionality**
   - PDF and Word document exports
   - Printable timeline format

## Solution Design Diagram

```
+-------------------------------------------------------+
|                   USER INTERFACES                     |
|                                                       |
|   +-----------------+        +-----------------+      |
|   |                 |        |                 |      |
|   |   CLIENT VIEW   |<------>|   LAWYER VIEW   |      |
|   |                 |        |                 |      |
|   +-----------------+        +-----------------+      |
|             |                        |                |
+-------------|------------------------|----------------+
              |                        |
              v                        v
+-------------------------------------------------------+
|                 APPLICATION SERVICES                  |
|                                                       |
|   +-----------------+        +-----------------+      |
|   |    TIMELINE     |        |      USER       |      |
|   |   MANAGEMENT    |<------>|    MANAGEMENT   |      |
|   +-----------------+        +-----------------+      |
|             |                        |                |
|             v                        v                |
|   +-----------------+        +-----------------+      |
|   |      MEDIA      |        |     EXPORT      |      |
|   |    HANDLING     |<------>|     SERVICE     |      |
|   +-----------------+        +-----------------+      |
|             |                        |                |
+-------------|------------------------|----------------+
              |                        |
              v                        v
+-------------------------------------------------------+
|                     DATA STORAGE                      |
|                                                       |
|   +-----------------+        +-----------------+      |
|   |    DATABASE     |        |      MEDIA      |      |
|   |    (MongoDB)    |<------>|     STORAGE     |      |
|   +-----------------+        +-----------------+      |
|                                                       |
+-------------------------------------------------------+
```

## Detailed Architecture

```
+----------------------------------------------------------------+
|                       CLIENT LAYER                             |
|                                                                |
|  +------------------+    +------------------+                  |
|  |   AUTH MODULE    |    |  TIMELINE MODULE |                  |
|  | • Login/Logout   |    | • View Timeline  |                  |
|  | • User Profiles  |    | • Manage Events  |                  |
|  +------------------+    +------------------+                  |
|                                                                |
|  +------------------+    +------------------+                  |
|  |   MEDIA MODULE   |    |   EXPORT MODULE  |                  |
|  | • Upload Files   |    | • Generate PDF   |                  |
|  | • View/Organize  |    | • Generate Word  |                  |
|  +------------------+    +------------------+                  |
|                                                                |
+-----------------------------|-------------------------------+
                              |
                              v
+----------------------------------------------------------------+
|                         API LAYER                              |
|                                                                |
|  +------------------+    +------------------+                  |
|  |   AUTH API       |    |   TIMELINE API   |                  |
|  | • Login/Register |    | • CRUD Events    |                  |
|  | • Session Mgmt   |    | • Timeline Data  |                  |
|  +------------------+    +------------------+                  |
|                                                                |
|  +------------------+    +------------------+                  |
|  |   MEDIA API      |    |   EXPORT API     |                  |
|  | • Upload/Retrieve|    | • Generate Docs  |                  |
|  | • Media CRUD     |    | • Format Data    |                  |
|  +------------------+    +------------------+                  |
|                                                                |
+-----------------------------|-------------------------------+
                              |
                              v
+----------------------------------------------------------------+
|                        DATA LAYER                              |
|                                                                |
|  +------------------+    +------------------+                  |
|  |   USER MODEL     |    |   EVENT MODEL    |                  |
|  | • Auth Data      |    | • Timeline Data  |                  |
|  | • Roles & Access |    | • Event Details  |                  |
|  +------------------+    +------------------+                  |
|                                                                |
|  +------------------+    +------------------+                  |
|  |   MEDIA MODEL    |    |  COMMENT MODEL   |                  |
|  | • Media Storage  |    | • Comments       |                  |
|  | • File Metadata  |    | • Q&A Data       |                  |
|  +------------------+    +------------------+                  |
|                                                                |
+----------------------------------------------------------------+
```

## Data Flow Diagram

```
+----------------+       Authentication      +----------------+
|                |-------------------------->|                |
|                |                           |                |
|    CLIENT      |     Timeline Data         |     SERVER     |
|     USER       |<--------------------------|                |
|                |                           |                |
+--------+-------+                           +-------+--------+
         |                                           |
         |                                           |
         |         +----------------+                |
         |         |                |                |
         +-------->|     LAWYER     |<---------------+
        Share Data |      USER      |    Data Access
                   |                |
                   +-------+--------+
                           |
                           v
                   +----------------+
                   |     EXPORT     |
                   |    DOCUMENT    |
                   +----------------+
```

### Technology Stack:
- **Frontend**: Next.js with React
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **File Storage**: Cloudinary
- **Styling**: Tailwind CSS with shadcn/ui
- **Export**: react-pdf and docx.js

### Data Models:

1. **User**
   - id, email, password (hashed), name, role
   - role: client or lawyer

2. **Event**
   - id, title, description, date
   - user reference, media references

3. **Media**
   - id, url, type, filename
   - event reference

4. **Comment**
   - id, content, timestamp
   - user reference, event reference
   - isQuestion flag

## User Flow Diagram

```
            +--------+
            |  START |
            +---+----+
                |
                v
        +---------------+         +---------------+
        |               |         |               |
        |    LOG IN     +-------->|   DASHBOARD   |
        |               |         |               |
        +---------------+         +-------+-------+
                                          |
                                          v
                                  +---------------+
                                  |     VIEW      |
                                  |   TIMELINE    |
                                  +-------+-------+
                                          |
            +------------------------+----+----+----------------+
            |                        |         |                |
            v                        v         v                v
    +---------------+      +---------------+   |        +---------------+
    |   ADD EVENT   |      |  EDIT EVENT   |   |        | DELETE EVENT  |
    +-------+-------+      +-------+-------+   |        +---------------+
            |                      |           |
            v                      v           |
    +---------------+      +---------------+   |
    |  UPLOAD MEDIA |      |  ADD COMMENTS |   |
    +---------------+      +---------------+   |
                                               |
                                               v
                                       +---------------+
                                       |    EXPORT     |
                                       |   TIMELINE    |
                                       +-------+-------+
                                               |
                                               v
                                           +-------+
                                           |  END  |
                                           +-------+
```

## Implementation Plan

### Phase 1: Setup & Authentication (Week 1)
- Project setup with Next.js
- MongoDB connection
- User authentication system
- Role-based access control

### Phase 2: Timeline Core (Week 2)
- Timeline interface
- Event CRUD operations
- Date management
- Basic filtering

### Phase 3: Media Management (Week 3)
- File upload system
- Media gallery
- Image/document preview
- Media organization

### Phase 4: Collaboration Features (Week 4)
- Comment system
- Q&A functionality
- Export functionality (PDF/Word)

### Phase 5: Testing & Refinement (Week 5)
- User testing
- Security validation
- Performance optimization
- UI polish

## Security Considerations

```
+--------------------------------------------------------+
|                  SECURITY FRAMEWORK                    |
|                                                        |
|  +-----------------+         +-----------------+       |
|  |   USER ACCESS   |         |      DATA       |       |
|  |    SECURITY     |         |    SECURITY     |       |
|  +---------+-------+         +--------+--------+       |
|            |                          |                |
|            v                          v                |
|  +-----------------+         +-----------------+       |
|  |      API        |         |     STORAGE     |       |
|  |    SECURITY     |         |     SECURITY    |       |
|  +-----------------+         +-----------------+       |
|                                                        |
+--------------------------------------------------------+
```

Key Security Features:
- HTTPS for all communications
- Secure authentication with JWT
- Proper password hashing
- Role-based permissions
- Input validation
- CSRF protection
- Secure file uploads
- XSS prevention

