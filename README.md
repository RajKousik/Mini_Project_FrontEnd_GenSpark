# Student Management System

## Project Overview

The Student Management System is a web application designed to manage various aspects of a school or university, including student information, faculty details, course management, attendance tracking, and grading. This project aims to streamline administrative tasks and provide a user-friendly interface for students, faculty, and administrators.

## Features

- **Admin Module**

  - Manage students
  - Manage faculty
  - Manage courses
  - Manage grades
  - Manage exams

- **Faculty Module**

  - View and update attendance
  - Manage grades
  - View profile

- **Student Module**
  - View and update profile
  - Register for courses
  - View attendance
  - View grades
  - View exam schedules
  - Access e-wallet

## Project Structure

The project is organized into the following directories:

- **admin**: Contains HTML files for the admin module.
- **faculty**: Contains HTML files for the faculty module.
- **student**: Contains HTML files for the student module.
- **assets**: CSS, JavaScript, and image resources.

### Project Tree

```
Mini_Project_FrontEnd_GenSpark
├─ assets
│  ├─ css
│  │  ├─ attendance
│  │  │  ├─ admin-attendance.css
│  │  │  ├─ attendance.css
│  │  │  ├─ faculty-attendance.css
│  │  │  └─ try.css
│  │  ├─ auth
│  │  │  └─ auth-style.css
│  │  ├─ course
│  │  │  ├─ admin-course.css
│  │  │  └─ course.css
│  │  ├─ courseRegistration
│  │  │  ├─ admin-courseRegistration.css
│  │  │  └─ courseRegistration.css
│  │  ├─ department
│  │  │  ├─ admin-department.css
│  │  │  └─ department.css
│  │  ├─ EWallet
│  │  │  └─ EWallet.css
│  │  ├─ exam
│  │  │  ├─ admin-exam.css
│  │  │  └─ exam.css
│  │  ├─ faculty
│  │  │  └─ faculty.css
│  │  ├─ grade
│  │  │  ├─ admin-grade.css
│  │  │  ├─ faculty-grade.css
│  │  │  └─ grade.css
│  │  ├─ index
│  │  │  └─ index.css
│  │  ├─ profile
│  │  │  └─ profile.css
│  │  └─ student
│  │     └─ student.css
│  ├─ images
│  │  ├─ dummy-profile.jpg
│  │  └─ students_bg.png
│  ├─ js
│  │  ├─ attendance
│  │  │  ├─ admin-attendance.js
│  │  │  ├─ attendance.js
│  │  │  ├─ faculty-attendance.js
│  │  │  └─ try.js
│  │  ├─ auth
│  │  │  └─ auth-script.js
│  │  ├─ configurations
│  │  │  └─ config.js
│  │  ├─ course
│  │  │  ├─ admin-course.js
│  │  │  └─ course.js
│  │  ├─ courseRegistration
│  │  │  ├─ admin-courseRegistration.js
│  │  │  └─ courseRegistration.js
│  │  ├─ department
│  │  │  ├─ admin-department.js
│  │  │  └─ department.js
│  │  ├─ EWallet
│  │  │  └─ EWallet.js
│  │  ├─ exam
│  │  │  ├─ admin-exam.js
│  │  │  └─ exam.js
│  │  ├─ faculty
│  │  │  └─ faculty.js
│  │  ├─ grade
│  │  │  ├─ admin-grade.js
│  │  │  ├─ faculty-grade.js
│  │  │  └─ grade.js
│  │  ├─ index
│  │  │  └─ index.js
│  │  ├─ profile
│  │  │  ├─ faculty-profile.js
│  │  │  └─ student-profile.js
│  │  ├─ student
│  │  │  └─ student.js
│  │  ├─ token
│  │  │  └─ token.js
│  │  └─ validations
│  │     └─ validation.js
│  └─ svg
│     ├─ favicon.ico
│     ├─ login.svg
│     ├─ profile-user.svg
│     └─ register.svg
├─ README.md
└─ src
   ├─ auth
   │  ├─ error.html
   │  └─ user-auth.html
   └─ pages
      ├─ admin
      │  ├─ admin-attendance.html
      │  ├─ admin-course.html
      │  ├─ admin-courseRegistration.html
      │  ├─ admin-department.html
      │  ├─ admin-exam.html
      │  ├─ admin-faculty.html
      │  ├─ admin-grade.html
      │  ├─ admin-students.html
      │  ├─ index.html
      │  └─ try.html
      ├─ faculty
      │  ├─ faculty-attendance.html
      │  ├─ faculty-grade.html
      │  ├─ faculty-profile.html
      │  └─ index.html
      └─ student
         ├─ attendance.html
         ├─ course.html
         ├─ courseRegistration.html
         ├─ department.html
         ├─ EWallet.html
         ├─ exam.html
         ├─ grade.html
         ├─ index.html
         └─ profile.html

```

### Backend

The backend of this project is implemented using dot net web API with C#, MS SQL SERVER for database management, and JWT tokens for authentication and authorization. It provides RESTful APIs to handle CRUD operations for various entities such as students, faculty, courses, grades, and exams.

### GitHub Repository for Backend

For backend implementation details and setup instructions, please refer to the [Student Management System Backend Repository](https://github.com/RajKousik/Mini_Project_Backend_GenSpark).

## Getting Started

To get a local copy of the project up and running, follow these steps.

### Prerequisites

- Web browser (Google Chrome, Mozilla Firefox, etc.)
- Code editor (VS Code, Sublime Text, etc.)

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/RajKousik/Mini_Project_FrontEnd_GenSpark.git
   ```

2. **Navigate to the project directory:**

   ```sh
   cd Mini_Project_FrontEnd_GenSpark
   ```

3. **Open the `src/auth/user-auth.html` file in your web browser:**
   ```sh
   open src/auth/user-auth.html
   ```

## Usage

- **Admin Login:**

  - URL: `src/pages/admin/index.html`
  - Features: Manage students, faculty, courses, grades, and exams.

- **Faculty Login:**

  - URL: `src/pages/faculty/index.html`
  - Features: View and update attendance, manage grades, view profile.

- **Student Login:**
  - URL: `src/pages/student/index.html`
  - Features: View and update profile, register for courses, view attendance, view grades, view exam schedules, access e-wallet.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact

Your Name - [Raj Kousik](mailto:rajkousik20@gmail.com)

Project Link: [Student Management System](https://github.com/RajKousik/Mini_Project_FrontEnd_GenSpark)

---
