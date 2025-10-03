# 🏢 Enterprise Employee Absence Management System

A **production-ready** full-stack web application for managing employee absences with **multi-region support**, **role-based access control**, and **comprehensive audit logging**. Built with **Java Spring Boot** backend and **React + TypeScript** frontend.

![Java](https://img.shields.io/badge/Java-17+-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen.svg)
![React](https://img.shields.io/badge/React-18.2.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.6-38B2AC.svg)
![Swagger](https://img.shields.io/badge/Swagger-3.0-85EA2D.svg)

> **🎯 Perfect for:** Werkstudent/Junior Developer Portfolio | HR Tech Showcase | Spring Boot + React Learning

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Demo Credentials](#-demo-credentials)
- [User Roles](#-user-roles)
- [Project Structure](#-project-structure)
- [Future Enhancements](#-future-enhancements)
- [License](#-license)

---

## ✨ Features

### 👨‍💼 Employee Features
- ✅ **Multi-Type Absence Requests**: Vacation, Sick Leave, Home Office, Business Trip, Training
- ✅ **Smart Request Creation**: Start/end dates with automatic day calculation
- ✅ **Representative Assignment**: Select colleague to cover during absence
- ✅ **Personal Dashboard**: Track remaining vacation days with visual progress
- ✅ **Request History**: View all past requests with status tracking
- ✅ **Optional Notes**: Add context to each request

### 👩‍💼 Manager Features (Region-Based)
- ✅ **Team Overview**: View only employees from assigned region
- ✅ **Request Management**: Approve/reject with optional reason/comment
- ✅ **Team Calendar**: Color-coded monthly view of all team absences
- ✅ **Team Statistics**: Detailed breakdown per employee (vacation, sick days, home office, etc.)
- ✅ **Overload Warnings**: Automatic alerts when >50% of team is absent
- ✅ **Representative Overview**: See who's covering for whom
- ✅ **Region Isolation**: Cannot see/manage other regions' employees

### 🔐 Super Manager (Admin) Features
- ✅ **Global Calendar**: View absences across all regions
- ✅ **User Management**: Create, edit, deactivate users; assign regions
- ✅ **Vacation Quota Management**: Set individual quotas per employee
- ✅ **System Settings**: Manage absence types, vacation year config, regions
- ✅ **Enhanced Audit Log**: Filter by employee, action, date range with CSV export
- ✅ **Reports & Statistics**: Global vacation usage reports
- ✅ **Region Administration**: View and manage all company locations

### 🌍 Multi-Region Support
- ✅ **Region Entities**: Dortmund, München, Hamburg (demo regions)
- ✅ **Region-Based Access Control**: Managers limited to their region
- ✅ **Super Manager Global Access**: See and manage all regions
- ✅ **Cross-Region Security**: 403 Forbidden for unauthorized access

### 🔒 Security & Audit
- ✅ **3-Tier Role System**: EMPLOYEE, MANAGER, SUPER_MANAGER
- ✅ **Spring Security** with BCrypt password encoding
- ✅ **Region-Based Authorization**: Multi-layer validation
- ✅ **Comprehensive Audit Logging**: All CRUD operations tracked
- ✅ **Audit Filters**: Search by user, action, date range
- ✅ **CSV Export**: Download audit logs for compliance

### 🎨 Modern UI/UX
- ✅ **Dark Mode Support**: Full dark theme
- ✅ **Responsive Design**: Mobile, tablet, desktop optimized
- ✅ **TailwindCSS**: Modern utility-first styling
- ✅ **Lucide Icons**: Professional icon library
- ✅ **Color-Coded Status**: Visual feedback for all states
- ✅ **Loading States**: Smooth async operation indicators

---

## 🛠️ Tech Stack

### Backend
- **Java 17+**
- **Spring Boot 3.2.0**
  - Spring Web (RESTful APIs)
  - Spring Security (Authentication & Authorization)
  - Spring Data JPA (ORM)
  - Spring Validation (Input validation)
- **SpringDoc OpenAPI 3.0** (Swagger UI)
- **H2 Database** (in-memory for demo)
- **Maven** (dependency management)
- **Lombok** (code reduction)

### Frontend
- **React 18.2.0**
- **TypeScript 5.3.3**
- **TailwindCSS 3.3.6** (modern styling)
- **Axios** (HTTP client)
- **React Router v6** (SPA routing)
- **Lucide React** (icon library)
- **Context API** (state management)

### Development Tools
- **Swagger UI**: Interactive API documentation
- **H2 Console**: Database admin interface
- **Hot Reload**: Fast development cycle
- **ESLint & Prettier**: Code quality

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                  Frontend (React)                │
│  - Login Page                                    │
│  - Employee Dashboard                            │
│  - Manager Dashboard                             │
│  - Protected Routes                              │
└─────────────────┬───────────────────────────────┘
                  │ HTTP Requests (Axios)
                  ▼
┌─────────────────────────────────────────────────┐
│              Backend (Spring Boot)               │
│  ┌─────────────────────────────────────────┐    │
│  │ REST Controllers                        │    │
│  │  - AuthController                       │    │
│  │  - VacationController                   │    │
│  └──────────────┬──────────────────────────┘    │
│                 ▼                                │
│  ┌─────────────────────────────────────────┐    │
│  │ Security Layer                          │    │
│  │  - Spring Security                      │    │
│  │  - BCrypt Password Encoder              │    │
│  │  - Role-based Access Control            │    │
│  └──────────────┬──────────────────────────┘    │
│                 ▼                                │
│  ┌─────────────────────────────────────────┐    │
│  │ Service Layer                           │    │
│  │  - AuthService                          │    │
│  │  - VacationService                      │    │
│  └──────────────┬──────────────────────────┘    │
│                 ▼                                │
│  ┌─────────────────────────────────────────┐    │
│  │ Data Layer                              │    │
│  │  - JPA Repositories                     │    │
│  │  - Entities (User, VacationRequest)     │    │
│  └──────────────┬──────────────────────────┘    │
│                 ▼                                │
│  ┌─────────────────────────────────────────┐    │
│  │ H2 Database (In-Memory)                 │    │
│  └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- **Java 17+** installed
- **Node.js 16+** and **npm** installed
- **Maven** installed (or use Maven wrapper)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/urlaubsplanner.git
cd urlaubsplanner
```

### 2️⃣ Start the Backend

```bash
cd backend

# Build the project
mvn clean install

# Run the Spring Boot application
mvn spring-boot:run
```

The backend will start on **http://localhost:8080**

**🔍 API Documentation (Swagger UI):** http://localhost:8080/swagger-ui.html
- Interactive API documentation
- Test endpoints directly in browser
- View request/response schemas

**🗄️ H2 Console:** http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:urlaubsdb`
- Username: `sa`
- Password: *(leave empty)*

### 3️⃣ Start the Frontend

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

The frontend will start on **http://localhost:3000**

### 4️⃣ Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 📡 API Documentation

### Authentication Endpoints

#### Login
```http
POST /api/auth/login
Content-Type: application/json
Authorization: Basic <credentials>

{
  "username": "employee",
  "password": "password"
}

Response: 200 OK
{
  "username": "employee",
  "fullName": "Max Mustermann",
  "role": "EMPLOYEE",
  "totalVacationDays": 30,
  "usedVacationDays": 0,
  "remainingVacationDays": 30,
  "message": "Login successful"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Basic <credentials>

Response: 200 OK
```

### Vacation Request Endpoints

#### Create Vacation Request (EMPLOYEE)
```http
POST /api/vacations
Authorization: Basic <credentials>
Content-Type: application/json

{
  "employeeName": "employee",
  "startDate": "2025-10-01",
  "endDate": "2025-10-10",
  "notes": "Family vacation"
}

Response: 201 Created
```

#### Get All Requests (MANAGER)
```http
GET /api/vacations
Authorization: Basic <credentials>

Response: 200 OK
[
  {
    "id": 1,
    "employeeName": "employee",
    "startDate": "2025-10-01",
    "endDate": "2025-10-10",
    "status": "PENDING",
    "notes": "Family vacation",
    "createdAt": "2025-10-03",
    "daysRequested": 10
  }
]
```

#### Get Requests by Employee
```http
GET /api/vacations/employee/{name}
Authorization: Basic <credentials>

Response: 200 OK
```

#### Approve Request (MANAGER)
```http
PUT /api/vacations/{id}/approve
Authorization: Basic <credentials>

Response: 200 OK
```

#### Reject Request (MANAGER)
```http
PUT /api/vacations/{id}/reject
Authorization: Basic <credentials>

Response: 200 OK
```

---

## 🔑 Demo Credentials

> **All demo accounts use password:** `password`

### 🏢 Dortmund Region

**Employees:**
- **Username:** `max.mustermann` | **Name:** Max Mustermann | **Vacation:** 30 days, 0 used
- **Username:** `sarah.mueller` | **Name:** Sarah Müller | **Vacation:** 30 days, 5 used

**Manager:**
- **Username:** `anna.wagner` | **Name:** Anna Wagner | **Region:** Dortmund

### 🏢 München Region

**Employees:**
- **Username:** `thomas.schmidt` | **Name:** Thomas Schmidt | **Vacation:** 30 days, 10 used
- **Username:** `lisa.weber` | **Name:** Lisa Weber | **Vacation:** 30 days, 8 used

**Manager:**
- **Username:** `michael.klein` | **Name:** Michael Klein | **Region:** München

### 🏢 Hamburg Region

**Employees:**
- **Username:** `peter.schneider` | **Name:** Peter Schneider | **Vacation:** 30 days, 12 used

*(No manager assigned - requests need Super Manager approval)*

### 🔐 Super Manager (Global Access)

- **Username:** `admin`
- **Name:** System Administrator
- **Access:** All regions, all features
- **Permissions:** User management, quota management, system settings, global calendar, audit logs

### 📝 Legacy Test Accounts (Backward Compatibility)

- **Username:** `employee` | **Role:** EMPLOYEE | **Region:** Dortmund
- **Username:** `manager` | **Role:** MANAGER | **Region:** Dortmund

---

## 📸 Screenshots

### Login Page
Clean, modern login interface with demo credentials displayed.

### Employee Dashboard
- Personal vacation statistics
- Progress bar showing vacation usage
- Form to create new requests
- List of personal requests with status

### Manager Dashboard
- Overview statistics (Total, Pending, Approved, Rejected)
- Filter requests by status
- Approve/Reject actions for pending requests
- Color-coded status indicators

### Dark Mode
Full dark mode support across all pages.

---

## 📁 Project Structure

```
urlaubsplanner/
├── backend/                          # Spring Boot Backend
│   ├── src/main/java/com/adesso/urlaubsplanner/
│   │   ├── config/                   # Configuration classes
│   │   │   ├── SecurityConfig.java
│   │   │   └── DataLoader.java
│   │   ├── controller/               # REST Controllers
│   │   │   ├── AuthController.java
│   │   │   └── VacationController.java
│   │   ├── dto/                      # Data Transfer Objects
│   │   │   ├── LoginRequest.java
│   │   │   ├── LoginResponse.java
│   │   │   └── VacationRequestDTO.java
│   │   ├── model/                    # Entities & Enums
│   │   │   ├── User.java
│   │   │   ├── VacationRequest.java
│   │   │   ├── Role.java
│   │   │   └── VacationStatus.java
│   │   ├── repository/               # JPA Repositories
│   │   │   ├── UserRepository.java
│   │   │   └── VacationRequestRepository.java
│   │   ├── service/                  # Business Logic
│   │   │   ├── AuthService.java
│   │   │   ├── VacationService.java
│   │   │   └── CustomUserDetailsService.java
│   │   └── UrlaubsplannerApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
├── frontend/                         # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/               # Reusable Components
│   │   │   ├── Navbar.tsx
│   │   │   ├── VacationCard.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── context/                  # React Context
│   │   │   └── AuthContext.tsx
│   │   ├── pages/                    # Page Components
│   │   │   ├── Login.tsx
│   │   │   ├── EmployeeDashboard.tsx
│   │   │   └── ManagerDashboard.tsx
│   │   ├── services/                 # API Services
│   │   │   └── api.ts
│   │   ├── types/                    # TypeScript Types
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md
```

---

## 🎯 Key Features Explained

### Role-Based Access Control
- **EMPLOYEE** role can only create and view their own vacation requests
- **MANAGER** role can view all requests and approve/reject them
- Spring Security enforces access control at the API level using `@PreAuthorize` annotations

### Vacation Days Management
- Each user starts with 30 vacation days per year
- When a request is approved, the days are deducted from the employee's balance
- Real-time tracking prevents over-booking

### Modern UI/UX
- **TailwindCSS** for utility-first styling
- **Lucide React** icons for visual clarity
- Hover effects and smooth transitions
- Responsive grid layouts
- Dark mode support

### Data Persistence
- H2 in-memory database (resets on restart)
- JPA/Hibernate for ORM
- Pre-loaded demo users via `DataLoader`

---

## 🧪 Testing

### Backend Testing
```bash
cd backend
mvn test
```

### Frontend Testing
```bash
cd frontend
npm test
```

---

## 🔧 Configuration

### Backend Configuration (application.properties)

```properties
# Server Configuration
server.port=8080

# H2 Database
spring.datasource.url=jdbc:h2:mem:urlaubsdb
spring.jpa.hibernate.ddl-auto=create-drop

# H2 Console
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

### Frontend Configuration

Update `API_BASE_URL` in `src/services/api.ts` if backend runs on a different port:

```typescript
const API_BASE_URL = 'http://localhost:8080/api';
```

---

## 🚢 Deployment

### Backend Deployment
```bash
cd backend
mvn clean package
java -jar target/urlaubsplanner-1.0.0.jar
```

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy the 'build' folder to your hosting service
```

---

## 👥 User Roles

### 👨‍💼 EMPLOYEE
**Can:**
- Create absence requests (all types)
- View own request history
- Track remaining vacation days
- Add representatives

**Cannot:**
- View other employees' requests
- Approve/reject requests
- Access admin features

### 👩‍💼 MANAGER
**Can:**
- All EMPLOYEE permissions for their own absences
- View team members' requests (**region-limited**)
- Approve/reject requests with reason
- Access team calendar (color-coded)
- View team statistics
- See overload warnings
- View representative assignments

**Cannot:**
- See/manage employees from other regions
- Access super manager features
- Modify system settings
- Change vacation quotas

### 🔐 SUPER_MANAGER (Admin)
**Can:**
- **Everything a Manager can do** (all regions)
- Glob al calendar (all regions combined)
- User management (create, edit, deactivate, assign regions)
- Vacation quota management (set individual quotas)
- System settings (absence types, vacation year config)
- Audit log access (with advanced filters + CSV export)
- Region management
- Global reports and statistics

**Has:**
- Full system access
- No region restrictions
- Complete audit trail visibility

---

## 📝 Future Enhancements

### Completed ✅
- [x] Multi-region support
- [x] Team calendar visualization
- [x] Audit logging with CSV export
- [x] Vacation quota management
- [x] System settings UI
- [x] Manager statistics dashboard
- [x] Swagger/OpenAPI documentation

### Planned 🚀
- [ ] Email notifications for approvals/rejections
- [ ] Public holidays integration (per region)
- [ ] Multi-year vacation tracking
- [ ] PDF export for vacation certificates
- [ ] Mobile app (React Native)
- [ ] JWT token-based auth (instead of Basic Auth)
- [ ] Persistent database (PostgreSQL/MySQL migration)
- [ ] Real-time notifications (WebSocket)
- [ ] Employee self-service portal
- [ ] Advanced analytics dashboards
- [ ] Integration with Google Calendar/Outlook

---

## 👨‍💻 Author

**Serhat Bilge**
- GitHub: [@Serhat17](https://github.com/Serhat17)
- LinkedIn: [Serhat Bilge](https://linkedin.com/in/serhat-bilge-653415236)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Spring Boot** - Excellent Java framework
- **React** - Amazing frontend library
- **TailwindCSS** - Beautiful utility-first CSS framework

---

## 📞 Support

If you have any questions or issues, please open an issue on GitHub or contact me directly.

---

**Made with ❤️**
