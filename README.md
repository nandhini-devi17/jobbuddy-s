JobBuddy – Job Portal & Resume Builder

JobBuddy is a full-stack web application designed to connect job seekers with employers through a simple and user-friendly platform. It enables job seekers to explore job opportunities, build resumes, apply for jobs, and receive notifications, while employers can post job openings and manage applications.

##  Features

* 🔐 **User Authentication:** Secure login and registration using JSON Web Tokens (JWT).
* 👥 **Role-Based Access Control:** Separate functionality for job seekers and employers.
* 🔎 **Job Search & Filtering:** Explore job opportunities based on available filters.
* 📄 **Resume Builder:** Create resumes to showcase skills, education, and experience.
* 📩 **Job Applications:** Allow job seekers to apply for available positions.
* 🔔 **Notifications:** Keep job seekers informed about relevant application updates.
* 🏢 **Employer Dashboard:** Enable employers to post job openings and view applicant details.
* 🔑 **Protected Routes:** Restrict access to features based on authentication and user roles.

##  Tech Stack

| Technology | Purpose                                |
| ---------- | -------------------------------------- |
| React.js   | Frontend user interface                |
| Vite       | Frontend development and build tooling |
| Node.js    | Backend runtime                        |
| Express.js | REST API and server-side logic         |
| MongoDB    | Database for application data          |
| JWT        | User authentication and authorization  |
| JavaScript | Application logic                      |
| CSS        | Styling and responsive layouts         |

##  Application Architecture

```text
Job Seeker / Employer
         |
         v
 React + Vite Frontend
         |
         | HTTP Requests
         v
 Node.js + Express API
         |
         v
 Authentication & 
 Role-Based Authorization
         |
         v
      MongoDB
         |
         v
 API Response to Frontend
```

##  How It Works

1. Users register and log in to the application.
2. The backend authenticates users and issues a JWT.
3. The frontend stores the token in local storage and includes it in the Authorization header for protected API requests.
4. The backend verifies authentication and checks the user's role before allowing restricted operations.
5. Job seekers browse jobs, create resumes, submit applications, and view notifications.
6. Employers publish job openings and access relevant applicant information.
7. MongoDB stores application data and related records.

##  Getting Started

### Prerequisites

* Node.js and npm
* MongoDB instance
* Git

### Installation

**1. Clone the repository**

```bash
git clone <YOUR-JOBBUDDY-REPOSITORY-URL>
cd <YOUR-PROJECT-FOLDER>
```

Replace the placeholders with your actual repository URL and project folder name.

**2. Install dependencies**

Navigate to the frontend and backend directories and run:

```bash
npm install
```

Run this command separately in each directory containing a `package.json` file.

**3. Configure environment variables**

Create the required `.env` file in the backend directory and configure the variables expected by your application, such as:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Use the actual variable names expected by your code. Never commit real secrets or database credentials to GitHub.

**4. Start the application**

Start the backend and frontend using the scripts defined in their respective `package.json` files.

Open the local frontend URL displayed by Vite to use JobBuddy.

##  What I Learned

* Developing a full-stack application using the MERN stack.
* Implementing JWT-based authentication and protected routes.
* Managing user permissions through role-based access control.
* Designing REST APIs for job listings and applications.
* Integrating MongoDB with backend application logic.
* Building interactive user interfaces using React.
* Connecting frontend components with backend APIs.

##  Future Improvements

* Add email notifications for job application updates.
* Implement advanced job search and filtering.
* Improve resume templates and PDF export.
* Add automated testing and stronger input validation.
* Deploy the application for public access.



