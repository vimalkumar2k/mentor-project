# Mentoring Management System (MMS)

A complete production-ready digital platform for college mentoring management, replacing physical 21-page forms with a streamlined web experience.

## Technology Stack
- **Frontend:** React.js, Material UI, Tailwind CSS, Axios, React Router.
- **Backend:** Node.js, Express.js, JWT, Multer.
- **Database:** MongoDB, Mongoose.

## Features
- **Multi-Step Form Wizard:** 21 distinct pages with auto-save functionality.
- **Role-Based Access:** Separate dashboards for Students, Mentors (Staff), HOD, and Assistant HOD.
- **Secure Auth:** JWT-based login with role protection and password hashing.
- **Analytics:** Department-wide and individual performance statistics with modern UI cards.
- **Responsive Design:** Premium look and feel optimized for all screen sizes.

---

## Installation & Setup

### 1. Database Configuration
Ensure **MongoDB** is running locally or provide a connection URI in environment variables.
Default: `mongodb://localhost:27017/mentoring_system`

### 2. Backend Setup
```bash
cd server
npm install
node index.js
```
*Port: 5000*

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
*Port: 5173*

---

## Folder Structure

### Backend (`/server`)
- `models`: Mongoose schemas (User, Student, Academic, Activity, MentoringForm).
- `controllers`: Business logic for auth, student mgmt, and form data.
- `routes`: API endpoints.
- `middleware`: JWT authentication and role-based checks.
- `config`: Multer and other configurations.

### Frontend (`/client`)
- `context`: Global Auth state management.
- `layouts`: Responsive Dashboard shell.
- `pages`: Individual role dashboards and the 21-Step Form Wizard.
- `services`: Axios API integration.
- `styles`: Tailwind and Tailwind/MUI global styles.

## Usage Instructions
1. **Register** a new account (Select your role).
2. **Login** with the registered credentials.
3. **Students:** Navigate to "Mentoring Form" to begin the 21-step process.
4. **Mentors:** Access the student list to review subordinates.
5. **HOD:** Monitor department-wide analytics and assign mentors.

---
*Developed for College Mentoring Digital Transformation.*
