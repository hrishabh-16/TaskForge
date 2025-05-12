# TaskForge Frontend

## 📝 Project Overview

The **TaskForge Frontend** is a modern Angular application that serves as the user interface for the full-stack task management system. This responsive and intuitive frontend provides a seamless experience for managing tasks, categories, profiles, and notifications with a clean and user-friendly design.

## 🚀 Features

### 👤 User Management

- Secure login and registration
- Password reset functionality
- Profile management
- User settings customization

### ✅ Task Management

- Create, read, update, and delete tasks
- Task categorization and organization in lists
- Status tracking (Pending, In Progress, Completed, etc.)
- Priority levels assignment (Low, Medium, High, Urgent)
- Due date management with calendar integration
- Task filtering and searching

### ✨ Additional Task Features

- Task commenting system
- File attachment uploads
- Task sharing with other users

### 🗓️ Calendar Integration

- Visual calendar view of tasks
- Deadline tracking
- Event scheduling

### 🔔 Notifications

- Real-time notifications using WebSockets
- Task reminders
- Status update notifications
- Assignment notifications

### 📱 Responsive Design

- Mobile-friendly interface
- Responsive layouts for all screen sizes
- Touch-optimized interactions

## ⚙️ Technologies & Dependencies

### Core

- **Angular 19.2.x**
- **TypeScript 5.7.x**
- **RxJS 7.8.x**
- **TailwindCSS 4.1.x**

### UI Components

- **Angular Material 19.2.x**
- **NgX-Toastr 19.0.0**
- **Angular Calendar 0.31.1**

### Real-time Communication

- **SockJS 1.6.1**
- **StompJS 2.3.3**

### Development Tools

- **Angular CLI 19.2.x**

## 📁 Project Structure

```
todo-frontend/
├── .angular/
├── .vscode/
├── node_modules/
├── public/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── auth/
│   │   │   │   ├── guards/
│   │   │   │   ├── interceptors/
│   │   │   │   ├── models/
│   │   │   │   ├── services/
│   │   │   ├── material/
│   │   │   ├── models/
│   │   │   ├── services/
│   │   ├── features/
│   │   │   ├── attachments/
│   │   │   ├── auth/
│   │   │   ├── calendar/
│   │   │   ├── categories/
│   │   │   ├── comments/
│   │   │   ├── dashboard/
│   │   │   ├── notifications/
│   │   │   ├── profile/
│   │   │   ├── settings/
│   │   │   ├── task-lists/
│   │   │   ├── tasks/
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   ├── footer/
│   │   │   │   ├── header/
│   │   │   │   ├── sidebar/
│   │   │   ├── directives/
│   │   │   ├── pipes/
│   │   ├── app-routing.module.ts
│   │   ├── app.component.css
│   │   ├── app.component.html
│   │   ├── app.component.spec.ts
│   │   ├── app.component.ts
│   │   ├── app.module.ts
│   ├── assets/
│   ├── environments/
│   ├── index.html
│   ├── main.ts
│   ├── styles.css
│   ├── typings.d.ts
├── .editorconfig
├── .gitignore
├── .postcssrc.json
├── angular.json
├── Dockerfile
├── package-lock.json
├── package.json
├── proxy.conf.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.spec.json
```

## 🛠️ Getting Started

### ✅ Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Angular CLI 19.2.x

### ⚙️ Configuration

Update your `proxy.conf.json` to connect to your backend:

```json
{
  "/api": {
    "target": "http://localhost:4000",
    "secure": false,
    "changeOrigin": true
  }
}
```

## ▶️ Installation & Running

### Method 1: Traditional Setup

```bash
# Clone the repository
git clone https://github.com/hrishabh-16/TaskForge.git
cd TaskForge/todo-frontend

# Install dependencies
npm install

# Run the application in development mode
npm start

# The application will be available at:
# http://localhost:4200
```

### Method 2: Docker Setup

```bash
# Clone the repository
git clone https://github.com/hrishabh-16/TaskForge.git
cd TaskForge/todo-frontend

# Build Docker image
docker build -t hrishabh20/todo-frontend:latest .

# Run Docker container
docker run -p 4200:80 hrishabh20/todo-frontend:latest
```

## 🔧 Building for Production

```bash
# Generate production build
npm run build

# The build artifacts will be stored in the dist/ directory
```

## 🔒 Security Features

- JWT-based authentication
- HTTP interceptors for request/response handling
- Route guards for protected content
- Secure storage of user information

## 🔮 Future Enhancements

- Offline mode with local storage
- Dark/light theme toggle
- Task templates
- Advanced analytics dashboard
- Drag and drop task management

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact

Project Link: [https://github.com/hrishabh-16/TaskForge](https://github.com/hrishabh-16/TaskForge)
