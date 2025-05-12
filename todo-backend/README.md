# TaskForge Backend

## 📝 Project Overview

The **TaskForge Backend** is a comprehensive Spring Boot application that serves as the backend for a full-stack task management system. It provides secure user authentication, task and category management, comments, attachments, and a notification system to deliver a complete task organization experience.

## 🚀 Features

### 👤 User Management

- Secure registration and authentication using JWT
- Role-based access control (User)
- Password reset with email verification
- User profile management

### ✅ Task Management

- Full CRUD operations
- Task categorization and project/task lists
- Status tracking (Pending, In Progress, Completed, etc.)
- Priority levels (Low, Medium, High, Urgent)
- Due dates with reminder notifications
- Task filtering and search

### ✨ Additional Task Features

- Commenting on tasks
- File attachments

### 🔔 Notifications

- Email reminders for upcoming deadlines
- In-app notifications:
  - Task due soon
  - Overdue tasks
  - Status changes
  - Assignments

### 🔐 Security

- JWT-based authentication
- BCrypt password hashing
- CORS configuration
- Role-based authorization
- Secure password reset flow

## 🧱 Architecture

Follows a layered architecture:

### 📂 Controller Layer

- Defines REST endpoints
- Handles input validation and response formatting

### 🧠 Service Layer

- Business logic and transaction management
- Integrates with repositories and external services

### 💾 Repository Layer

- Data access using Spring Data JPA
- Custom queries for advanced retrieval

### 🧬 Entity Layer

- JPA-based domain models
- Relationship mappings

### 📦 DTO Layer

- Request/response models
- Validation annotations

## ⚙️ Technologies & Dependencies

### Core

- **Java 21**
- **Spring Boot 3.4.5**
- **Spring Security**
- **Spring Data JPA**
- **Hibernate**
- **MySQL**

### Authentication & Security

- JSON Web Tokens (JWT)
- `jjwt-api`
- BCrypt

### Validation & Serialization

- Jakarta Validation
- Jackson
- MapStruct

### Email & Notifications

- Spring Mail
- Thymeleaf

### Documentation

- SpringDoc OpenAPI + Swagger UI

### Development Tools

- Spring Boot DevTools
- Lombok
- Apache Commons IO

## 📁 Package Structure

```
com.todo.app/
├── config/                  # App configuration
│   ├── CorsConfig.java
│   ├── EmailConfig.java
│   ├── FileStorageConfig.java
│   ├── JacksonConfig.java
│   ├── JwtConfig.java
│   ├── SecurityConfig.java
│   ├── SwaggerConfig.java
│   ├── ThymeleafConfig.java
│   ├── WebConfig.java
│   └── WebSocketConfig.java
├── controller/              # API endpoints
│   ├── AttachmentController.java
│   ├── AuthController.java
│   ├── CategoryController.java
│   ├── CommentController.java
│   ├── NotificationController.java
│   ├── PasswordResetController.java
│   ├── ProfileController.java
│   ├── SettingsController.java
│   ├── TaskController.java
│   ├── TaskListController.java
│   ├── TaskWebSocketController.java
│   ├── TestController.java
│   └── UserController.java
├── model/
│   ├── dto/                 # DTOs
│   │   ├── request/         # Request DTOs
│   │   └── response/        # Response DTOs
│   ├── entity/              # JPA entities
│   └── enums/               # Enums
├── repository/              # Data access
├── security/
│   ├── jwt/
│   └── service/
├── service/
│   ├── interfaces/
│   └── impl/
├── exception/               # Exception handlers
├── util/                    # Utility classes
├── validation/              # Custom validators
├── mapper/                  # MapStruct mappers
└── scheduler/               # Scheduled tasks
```

## 🛠️ Getting Started

### ✅ Prerequisites

- Java 21+
- Maven 3.6+
- MySQL 8+

### ⚙️ Configuration

Update your `application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/tododb?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT
app.jwt.secret=your_secure_jwt_secret_key
app.jwt.expiration=86400000

# Email
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

## ▶️ Installation & Running

### Method 1: Traditional Setup

```bash
# Clone the repository
git clone https://github.com/hrishabh20/todo-backend.git
cd todo-backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

### Method 2: Docker Setup

```bash
# Clone the repository
git clone https://github.com/hrishabh20/todo-backend.git
cd todo-backend

# Build Docker image
docker build -t hrishabh20/todo-backend:latest .

# Run Docker container
docker run -p 4000:4000 hrishabh20/todo-backend:latest
```

## 📘 API Documentation

Access Swagger UI at:
**[http://localhost:4000/swagger-ui/index.html](http://localhost:4000/swagger-ui/index.html)**

## 🔌 API Endpoints

### 🔐 Authentication

- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### 👥 Users

- `GET /api/users/me`
- `GET /api/users` (Admin only)
- `PUT /api/users/{id}`

### 🧾 Tasks

- `GET /api/tasks`
- `POST /api/tasks`
- `GET /api/tasks/{id}`
- `PUT /api/tasks/{id}`
- `DELETE /api/tasks/{id}`
- `GET /api/tasks/status/{status}`
- `GET /api/tasks/search`

### 🗂️ Categories

- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/{id}`
- `DELETE /api/categories/{id}`

### 📋 Task Lists

- `GET /api/task-lists`
- `POST /api/task-lists`
- `PUT /api/task-lists/{id}`
- `DELETE /api/task-lists/{id}`

### 💬 Comments

- `POST /api/comments/tasks/{taskId}`
- `GET /api/comments/tasks/{taskId}`
- `PUT /api/comments/{id}`
- `DELETE /api/comments/{id}`

### 📎 Attachments

- `POST /api/attachments/tasks/{taskId}`
- `GET /api/attachments/tasks/{taskId}`
- `GET /api/attachments/{id}/download`
- `DELETE /api/attachments/{id}`

### 🔔 Notifications

- `GET /api/notifications`
- `GET /api/notifications/unread`
- `PUT /api/notifications/{id}/read`
- `PUT /api/notifications/read-all`

## 🔒 Security Considerations

- JWT expires in 24 hours
- Password reset tokens are valid for 24 hours
- BCrypt used for password encryption
- All routes protected via role-based access
- Secure file upload validation
- Input validation on all endpoints

## 🔮 Future Enhancements

- OAuth2 (Google, GitHub) integration
- Analytics dashboard

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact

Project Link: [https://github.com/hrishabh-16/TaskForge](https://github.com/hrishabh-16/TaskForge)
