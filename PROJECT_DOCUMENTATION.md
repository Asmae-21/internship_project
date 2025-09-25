# Teacher Assistant Platform - Comprehensive Documentation

## Table of Contents
1. [User Role Analysis](#1-user-role-analysis)
2. [Use Case Diagrams](#2-use-case-diagrams)
3. [Class Diagrams](#3-class-diagrams)
4. [Sequence Diagrams](#4-sequence-diagrams)
5. [Cahier de Charge (Project Specification)](#5-cahier-de-charge-project-specification-document)
6. [Database Schema Analysis](#6-database-schema-analysis)

---

## 1. User Role Analysis

### Admin User Capabilities
Admins have full system access and management capabilities:

**User Management:**
- View all users (teachers and other admins)
- Create new user accounts
- Edit existing user profiles
- Deactivate/reactivate user accounts
- View user activity logs

**Content Oversight:**
- Audit all content created by teachers
- View content statistics and analytics
- Monitor content creation trends
- Review content quality and compliance

**System Administration:**
- Access comprehensive system logs
- Generate reports on user activity and content
- Manage activity types and content categories
- View dashboard with system-wide statistics

**Security & Access:**
- Full access to all API endpoints
- View authentication logs
- Monitor system security events

### Teacher User Capabilities
Teachers are the primary content creators with focused functionality:

**Content Management:**
- Create new educational content (Lessons, Quizzes, Assignments, Projects, Worksheets, Summaries)
- Edit and update their own content
- Delete their content
- Upload files and media to content
- Tag content with relevant keywords

**Dashboard & Analytics:**
- View personal dashboard with content statistics
- See recent content creation activity
- Access content shortcuts and templates

**AI-Powered Assistance:**
- Use chatbot to generate content templates
- Request specific content types via natural language
- Save generated templates directly to content library

**Profile Management:**
- Update personal profile information
- Manage account settings

### Student User Capabilities
**Note:** The current system does not include student users. All functionality is designed for teacher content creation and admin oversight.

### Permission Levels and Access Controls

**Role-Based Access Control (RBAC):**
- **Admin:** Full system access, user management, content auditing
- **Teacher:** Content creation, personal content management, chatbot access

**API Endpoint Permissions:**
- `/api/auth/*`: All authenticated users
- `/api/users/*`: Admin only
- `/api/contents/*`: Teachers for CRUD on own content, Admins for read access to all
- `/api/chatbot/*`: Teachers only
- `/api/logs/*`: Admin only
- `/api/reports/*`: Admin only

**Middleware Enforcement:**
- JWT token verification for all protected routes
- Role validation for teacher-specific endpoints
- Admin validation for administrative endpoints

---

## 2. Use Case Diagrams

### Primary Use Cases

#### Admin Use Cases:
1. **User Management**
   - Create new teacher accounts
   - Edit user profiles
   - Deactivate users
   - View user activity

2. **Content Auditing**
   - Review all teacher content
   - Monitor content quality
   - Generate content reports

3. **System Monitoring**
   - View system logs
   - Generate activity reports
   - Monitor system health

#### Teacher Use Cases:
1. **Content Creation**
   - Create educational content
   - Upload files and media
   - Tag content appropriately

2. **Content Management**
   - Edit existing content
   - Delete content
   - View content library

3. **AI Assistance**
   - Interact with chatbot
   - Generate content templates
   - Save templates to library

### Use Case Relationships

```
Admin ----(manages)----> Teachers
Admin ----(audits)----> Content
Admin ----(monitors)----> System Logs
Teacher ----(creates)----> Content
Teacher ----(uses)----> Chatbot
Chatbot ----(generates)----> Content Templates
Content ----(belongs to)----> Teacher
```

### Main Functionalities by Role

**Admin Dashboard:**
- User statistics overview
- Content creation trends
- System activity monitoring
- Quick access to management tools

**Teacher Dashboard:**
- Personal content statistics
- Recent content activity
- Chatbot access
- Content creation shortcuts

---

## 3. Class Diagrams

### Core Classes

#### User Model
```
User {
  +firstName: String
  +lastName: String
  +email: String (unique)
  +phone: String
  +classes: String
  +subjects: String
  +password: String (hashed)
  +photo: String
  +role: String (enum: ['admin', 'teacher'])
  +isActive: Boolean
  +createdAt: Date
  +updatedAt: Date
  +hashPassword(): void
}
```

#### Content Model
```
Content {
  +title: String
  +description: String
  +type: String (enum: ['Lesson', 'Quiz', 'Assignment', 'Project', 'Worksheet', 'Summary', 'Schema', 'Course Outline'])
  +tags: [String]
  +files: [String]
  +createdBy: ObjectId (ref: User)
  +createdAt: Date
  +updatedAt: Date
}
```

#### Log Model
```
Log {
  +user: ObjectId (ref: User)
  +action: String
  +content: String
  +type: String
  +metadata: Mixed
  +timestamp: Date
  +ipAddress: String
  +userAgent: String
}
```

### Class Relationships

```
User ||--o{ Content : creates
User ||--o{ Log : generates
Content }o--|| User : createdBy
Log }o--|| User : performedBy
```

### Methods and Properties

#### User Methods:
- `pre('save')`: Hash password before saving
- `findOne()`: Find user by email
- `comparePassword()`: Verify password

#### Content Methods:
- `find().populate()`: Get content with creator details
- `countDocuments()`: Count content by teacher
- `aggregate()`: Generate statistics

#### Log Methods:
- `create()`: Create new log entry
- `find()`: Query logs with filters

---

## 4. Sequence Diagrams

### Teacher Creating Content

```
Teacher -> Frontend: Click "Create Content"
Frontend -> Backend: POST /api/contents
Backend -> Database: Validate & Save Content
Database -> Backend: Content Saved
Backend -> Log: Create "Created content" log
Backend -> Frontend: Return created content
Frontend -> Teacher: Display success message
```

### Chatbot Generating Content

```
Teacher -> Chatbot UI: Type "Create a quiz"
Chatbot UI -> Backend: POST /api/chatbot
Backend -> Chatbot Logic: Match keyword "quiz"
Backend -> Database: Retrieve quiz template
Backend -> Log: Log chatbot interaction
Backend -> Frontend: Return quiz template
Frontend -> Teacher: Display template
Teacher -> Frontend: Click "Save Template"
Frontend -> Backend: POST /api/contents (with template data)
Backend -> Database: Save as new content
```

### User Authentication Flow

```
User -> Login Form: Enter credentials
Login Form -> Backend: POST /api/auth/login
Backend -> Database: Find user by email
Database -> Backend: Return user
Backend -> Password: Compare hash
Backend -> JWT: Generate token
Backend -> Log: Log login (if teacher)
Backend -> Frontend: Return token & user data
Frontend -> LocalStorage: Store token
Frontend -> User: Redirect to dashboard
```

### Content Management Sequence

```
Teacher -> Content List: View content
Content List -> Backend: GET /api/contents/teacher/:id
Backend -> Database: Query teacher's content
Database -> Backend: Return content list
Backend -> Frontend: Return JSON data
Frontend -> Teacher: Display content grid

Teacher -> Content: Click edit
Edit Form -> Backend: PUT /api/contents/:id
Backend -> Database: Update content
Backend -> Log: Log edit action
Backend -> Frontend: Return updated content
```

---

## 5. Cahier de Charge (Project Specification Document)

### Project Overview and Objectives

**Project Name:** Teacher Assistant Platform

**Objective:** Develop a comprehensive web platform that empowers teachers to create, manage, and organize educational content with AI-powered assistance, while providing administrators with oversight and analytics capabilities.

**Target Users:**
- Teachers: Content creators seeking efficient tools
- Administrators: System managers requiring oversight

### Functional Requirements

#### Core Features:
1. **User Authentication & Authorization**
   - Secure login/logout system
   - Role-based access control (Admin/Teacher)
   - JWT token-based sessions

2. **Content Management System**
   - CRUD operations for educational content
   - Multiple content types support
   - File upload capabilities
   - Tagging system

3. **AI-Powered Chatbot**
   - Keyword-based content template generation
   - Predefined templates for common content types
   - Direct save functionality

4. **Admin Dashboard**
   - User management interface
   - Content auditing tools
   - System monitoring and reporting

5. **Teacher Dashboard**
   - Personal content library
   - Content creation statistics
   - Quick access to tools

#### Non-Functional Requirements:
- Responsive web design
- Secure data handling
- Performance optimization
- Comprehensive logging

### Technical Specifications

**Frontend:**
- Framework: Next.js 14 with React
- Language: TypeScript
- UI Library: Custom components with Tailwind CSS
- State Management: React hooks

**Backend:**
- Runtime: Node.js
- Framework: Express.js
- Database: MongoDB with Mongoose ODM
- Authentication: JWT tokens
- File Storage: Local file system

**Infrastructure:**
- Containerization: Docker
- Development: Local development servers
- Production: Configurable for cloud deployment

### User Stories

#### Teacher Stories:
- As a teacher, I want to create educational content quickly so I can focus on teaching
- As a teacher, I want AI assistance to generate content templates so I can save time
- As a teacher, I want to organize my content with tags so I can find it easily
- As a teacher, I want to upload files to my content so I can include multimedia

#### Admin Stories:
- As an admin, I want to manage user accounts so I can control system access
- As an admin, I want to audit content quality so I can ensure educational standards
- As an admin, I want to view system reports so I can monitor usage patterns
- As an admin, I want to track user activity so I can identify issues

### Development Timeline

**Phase 1: Foundation (Weeks 1-2)**
- Project setup and architecture design
- Database schema implementation
- Basic authentication system

**Phase 2: Core Features (Weeks 3-6)**
- Content management system
- Teacher dashboard
- File upload functionality

**Phase 3: AI Integration (Weeks 7-8)**
- Chatbot implementation
- Template generation system
- Integration with content creation

**Phase 4: Admin Features (Weeks 9-10)**
- Admin dashboard
- User management
- Reporting and analytics

**Phase 5: Testing & Deployment (Weeks 11-12)**
- Comprehensive testing
- Performance optimization
- Production deployment

### Technology Stack

**Frontend:**
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Lucide React (icons)

**Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer (file uploads)

**Development Tools:**
- Docker & Docker Compose
- ESLint
- Git
- npm/yarn

---

## 6. Database Schema Analysis

### Tables and Relationships

#### Users Collection
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique, indexed),
  phone: String,
  classes: String,
  subjects: String,
  password: String (hashed),
  photo: String,
  role: String (enum: ['admin', 'teacher']),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Contents Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  type: String (enum: ['Lesson', 'Quiz', 'Assignment', 'Project', 'Worksheet', 'Summary', 'Schema', 'Course Outline']),
  tags: [String],
  files: [String], // File paths
  createdBy: ObjectId (ref: Users),
  createdAt: Date,
  updatedAt: Date
}
```

#### Logs Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: Users),
  action: String,
  content: String, // Content title or description
  type: String, // Content type
  metadata: Mixed, // Additional data
  timestamp: Date,
  ipAddress: String,
  userAgent: String
}
```

### Data Flow Diagrams

#### Content Creation Flow:
```
Teacher Input -> Validation -> Database Save -> File Upload -> Log Creation -> Response
```

#### Authentication Flow:
```
Login Request -> User Lookup -> Password Verify -> JWT Generate -> Log Entry -> Token Response
```

#### Chatbot Interaction Flow:
```
User Message -> Keyword Match -> Template Retrieval -> Log Interaction -> Template Response
```

### API Endpoints and Purposes

#### Authentication Endpoints:
- `POST /api/auth/login`: User authentication
- `GET /api/auth/me`: Get current user info

#### User Management:
- `GET /api/users`: List all users (Admin)
- `POST /api/users`: Create user (Admin)
- `PUT /api/users/:id`: Update user (Admin)
- `DELETE /api/users/:id`: Delete user (Admin)

#### Content Management:
- `GET /api/contents`: Get all content
- `GET /api/contents/teacher/:id/count`: Get teacher's content count
- `GET /api/contents/teacher/:id/recent`: Get recent content
- `GET /api/contents/stats/types`: Get content type statistics
- `GET /api/contents/:id`: Get specific content
- `POST /api/contents`: Create new content
- `PUT /api/contents/:id`: Update content
- `DELETE /api/contents/:id`: Delete content

#### Chatbot:
- `POST /api/chatbot`: Generate content template

#### Logging & Reporting:
- `GET /api/logs`: Get system logs (Admin)
- `GET /api/reports`: Get reports (Admin)

### Database Indexes
- Users: email (unique)
- Contents: createdBy, type, createdAt
- Logs: user, timestamp, action

### Data Relationships
- One-to-Many: User -> Contents (createdBy)
- One-to-Many: User -> Logs (user)
- Many-to-One: Contents -> User (createdBy)
- Many-to-One: Logs -> User (user)
