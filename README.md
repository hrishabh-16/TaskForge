
# 🔧 TaskForge - A Modern Task Management Solution

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-19.2.x-red.svg)](https://angular.io/)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.x-blue.svg)](https://www.typescriptlang.org/)

## 📋 Project Overview

**TaskForge** is a comprehensive full-stack task management application designed to help individuals and teams organize, track, and complete tasks efficiently. Built with Spring Boot backend and Angular frontend, TaskForge offers a robust and feature-rich solution for personal and professional task management.

![TaskForge Banner](https://via.placeholder.com/1200x300?text=TaskForge+Task+Management+Application)

## ✨ Key Features

- **📝 Comprehensive Task Management**

  - Create, organize, and track tasks with ease
  - Set priorities, due dates, and categories
  - Mark progress with customizable status options
- **👥 Collaborative Features**

  - Comment on tasks for better communication
  - Real-time notifications for updates
- **🔐 Secure Authentication**

  - JWT-based authentication system
  - Role-based access control
  - Secure password management
- **📱 Responsive Design**

  - Works seamlessly across desktop and mobile devices
  - Intuitive user interface for better productivity
- **🔔 Notification System**

  - Email notifications for important updates
  - In-app notifications via WebSockets
  - Customizable notification preferences

## 🏗️ Architecture

TaskForge follows a modern full-stack architecture:

- **Backend**: Java 21 with Spring Boot 3.4.5
- **Frontend**: Angular 19 with Angular Material
- **Database**: MySQL 8+
- **Communication**: RESTful APIs and WebSockets for real-time updates

## 🚀 Getting Started

### Prerequisites

- Java 21+
- Node.js 18+
- MySQL 8+
- Maven 3.6+
- Git

### Quick Start

```bash
# Clone the repository
git clone https://github.com/hrishabh-16/TaskForge.git
cd TaskForge

# Start Backend (Spring Boot)
cd todo-backend
mvn spring-boot:run

# Start Frontend (Angular) in a new terminal
cd ../todo-frontend
npm install
ng serve

# Access the application at http://localhost:4200
```

### Docker Setup

```bash
# Clone the repository
git clone https://github.com/hrishabh-16/TaskForge.git
cd TaskForge

# Build and run backend
cd todo-backend
docker build -t hrishabh20/todo-backend:latest .
docker run -p 4000:4000 hrishabh20/todo-backend:latest

# Build and run frontend in a new terminal
cd ../todo-frontend
docker build -t hrishabh20/todo-frontend:latest .
docker run -p 4200:80 hrishabh20/todo-frontend:latest

# Access the application at http://localhost:4200
```

## 📚 Documentation

For detailed documentation, please visit:

- [Backend Documentation](https://github.com/hrishabh-16/TaskForge/blob/main/todo-backend/README.md) - Spring Boot backend details
- [Frontend Documentation](https://github.com/hrishabh-16/TaskForge/blob/main/todo-frontend/README.md) - Angular frontend details
- API Documentation: Available at `http://localhost:4000/swagger-ui/index.html` when running the backend

## 📸 Screenshots

![Dashboard](https://via.placeholder.com/800x450?text=TaskForge+Dashboard)
*TaskForge Dashboard View*

![Task Management](https://via.placeholder.com/800x450?text=Task+Management)
*Task Management Interface*

![Calendar View](https://via.placeholder.com/800x450?text=Calendar+View)
*Calendar View for Task Planning*

## 📦 Tech Stack

### Backend

- **Spring Boot**: Core framework
- **Spring Security**: Authentication and authorization
- **Spring Data JPA**: Database access
- **JWT**: Token-based security
- **MySQL**: Database
- **Hibernate**: ORM
- **Maven**: Dependency management

### Frontend

- **Angular**: Core framework
- **Angular Material**: UI components
- **RxJS**: Reactive programming
- **TailwindCSS**: Styling
- **SockJS/STOMP**: WebSocket communication
- **NgX-Toastr**: Notifications
- **Angular Calendar**: Calendar functionality

## 🛠️ Development

### Project Structure

```
TaskForge/
├── todo-backend/      # Spring Boot Backend
├── todo-frontend/     # Angular Frontend
└── README.md          # This file
```

### Backend Structure

The backend follows a layered architecture with controllers, services, repositories, and entities. For detailed structure, refer to the [Backend README](https://github.com/hrishabh-16/TaskForge/blob/main/todo-backend/README.md).

### Frontend Structure

The frontend follows Angular best practices with core/feature/shared module organization. For detailed structure, refer to the [Frontend README](https://github.com/hrishabh-16/TaskForge/blob/main/todo-frontend/README.md).

## 👥 Contributing

We welcome contributions to TaskForge! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👏 Acknowledgements

- [Spring Boot](https://spring.io/projects/spring-boot)
- [Angular](https://angular.io/)
- [Angular Material](https://material.angular.io/)
- [TailwindCSS](https://tailwindcss.com/)
- All the open-source libraries that made this project possible

## 📞 Contact

Project Link: [https://github.com/hrishabh-16/TaskForge](https://github.com/hrishabh-16/TaskForge)

---

Made with ❤️ by [Hrishabh](https://github.com/hrishabh-16)
