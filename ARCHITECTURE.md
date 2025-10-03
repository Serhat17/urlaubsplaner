# 🏛️ System Architecture

Detailed architecture documentation for the Urlaubsplanner system.

## 📐 System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌────────────────────────────────────────────────────┐     │
│  │  React Application (Port 3000)                     │     │
│  │  - React Router (SPA Navigation)                   │     │
│  │  - TailwindCSS (Styling)                          │     │
│  │  - Axios (HTTP Client)                            │     │
│  │  - Context API (State Management)                 │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST + Basic Auth
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│  ┌────────────────────────────────────────────────────┐     │
│  │  Spring Boot Application (Port 8080)               │     │
│  │                                                     │     │
│  │  ┌──────────────────────────────────────────┐     │     │
│  │  │  Security Filter Chain                   │     │     │
│  │  │  - CORS Configuration                    │     │     │
│  │  │  - HTTP Basic Authentication             │     │     │
│  │  │  - Role-based Authorization              │     │     │
│  │  └──────────────────────────────────────────┘     │     │
│  │                                                     │     │
│  │  ┌──────────────────────────────────────────┐     │     │
│  │  │  REST Controllers                        │     │     │
│  │  │  - AuthController (/api/auth/*)          │     │     │
│  │  │  - VacationController (/api/vacations/*) │     │     │
│  │  └──────────────────────────────────────────┘     │     │
│  │                                                     │     │
│  │  ┌──────────────────────────────────────────┐     │     │
│  │  │  Service Layer (Business Logic)          │     │     │
│  │  │  - AuthService                           │     │     │
│  │  │  - VacationService                       │     │     │
│  │  │  - CustomUserDetailsService              │     │     │
│  │  └──────────────────────────────────────────┘     │     │
│  │                                                     │     │
│  │  ┌──────────────────────────────────────────┐     │     │
│  │  │  Repository Layer (Data Access)          │     │     │
│  │  │  - UserRepository (JPA)                  │     │     │
│  │  │  - VacationRequestRepository (JPA)       │     │     │
│  │  └──────────────────────────────────────────┘     │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ JDBC
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │  H2 In-Memory Database                             │     │
│  │  - users table                                     │     │
│  │  - vacation_requests table                         │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Component Details

### Frontend Architecture

#### Components Structure
```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx      # Navigation bar with user info & dark mode
│   ├── VacationCard.tsx # Vacation request card component
│   └── ProtectedRoute.tsx # Route guard for authentication
│
├── pages/              # Page-level components
│   ├── Login.tsx       # Authentication page
│   ├── EmployeeDashboard.tsx # Employee vacation management
│   └── ManagerDashboard.tsx  # Manager approval interface
│
├── context/            # Global state management
│   └── AuthContext.tsx # Authentication state & methods
│
├── services/           # API communication
│   └── api.ts         # Axios instance & API methods
│
├── types/              # TypeScript definitions
│   └── index.ts       # Interfaces & enums
│
└── App.tsx            # Root component with routing
```

#### State Management Flow
```
┌──────────────┐
│  AuthContext │ ← Provides authentication state globally
└──────┬───────┘
       │
       ├─→ Login Component (updates auth state)
       ├─→ ProtectedRoute (checks auth state)
       ├─→ Navbar (displays user info)
       └─→ Dashboard Components (use current user)
```

### Backend Architecture

#### Layered Architecture
```
┌─────────────────────────────────────────────┐
│  Presentation Layer (Controllers)           │
│  - Handle HTTP requests/responses           │
│  - Input validation                         │
│  - DTO transformation                       │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│  Service Layer (Business Logic)             │
│  - Authentication logic                     │
│  - Vacation request processing              │
│  - Business rules enforcement               │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│  Data Access Layer (Repositories)           │
│  - CRUD operations                          │
│  - Custom queries                           │
│  - JPA/Hibernate integration                │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│  Database Layer (H2)                        │
│  - Data persistence                         │
│  - Transaction management                   │
└─────────────────────────────────────────────┘
```

#### Security Architecture
```
HTTP Request
     │
     ▼
┌─────────────────────────────────────┐
│  CORS Filter                        │
│  - Allow localhost:3000             │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  Authentication Filter              │
│  - Extract Basic Auth credentials   │
│  - Validate with UserDetailsService │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  Authorization Filter               │
│  - Check @PreAuthorize annotations  │
│  - Verify user roles                │
└─────────────────┬───────────────────┘
                  │
                  ▼
            Controller Method
```

## 🗃️ Data Model

### Entity Relationship Diagram
```
┌─────────────────────────────┐
│          User               │
├─────────────────────────────┤
│ id: Long (PK)              │
│ username: String (UNIQUE)   │
│ password: String            │
│ fullName: String            │
│ role: Role (ENUM)           │
│ totalVacationDays: Integer  │
│ usedVacationDays: Integer   │
└─────────────────────────────┘
              │
              │ 1
              │
              │ N
              ▼
┌─────────────────────────────┐
│    VacationRequest          │
├─────────────────────────────┤
│ id: Long (PK)              │
│ employeeName: String (FK)   │
│ startDate: LocalDate        │
│ endDate: LocalDate          │
│ status: VacationStatus      │
│ notes: String               │
│ createdAt: LocalDate        │
└─────────────────────────────┘
```

### Enums
```java
enum Role {
    EMPLOYEE,  // Can create and view own requests
    MANAGER    // Can view all and approve/reject
}

enum VacationStatus {
    PENDING,   // Initial state
    APPROVED,  // Manager approved
    REJECTED   // Manager rejected
}
```

## 🔐 Security Flow

### Authentication Flow
```
1. User enters credentials
        ├─→ Frontend sends login request
        │   with Basic Auth header
        │
        ▼
2. Backend receives request
        ├─→ Spring Security intercepts
        ├─→ Extracts credentials
        ├─→ Calls CustomUserDetailsService
        │
        ▼
3. UserDetailsService validates
        ├─→ Queries UserRepository
        ├─→ Compares BCrypt hashed password
        ├─→ Loads user roles
        │
        ▼
4. Authentication successful
        ├─→ Returns user details
        ├─→ Frontend stores in localStorage
        ├─→ Future requests include credentials
```

### Authorization Flow
```
Request to protected endpoint
        │
        ▼
@PreAuthorize("hasRole('MANAGER')")
        │
        ├─→ Extract authenticated user
        ├─→ Check if user has ROLE_MANAGER
        │
        ├─→ YES: Execute method
        │
        └─→ NO: Return 403 Forbidden
```

## 🔄 Request Flow Examples

### Example 1: Create Vacation Request

```
1. Employee clicks "Create Request" button
        │
        ▼
2. Frontend (EmployeeDashboard.tsx)
        ├─→ Validates form input
        ├─→ Calls vacationAPI.createRequest()
        │
        ▼
3. API Service (api.ts)
        ├─→ Adds Basic Auth header
        ├─→ POST to /api/vacations
        │
        ▼
4. Backend Controller (VacationController.java)
        ├─→ @PreAuthorize checks EMPLOYEE role
        ├─→ Validates DTO with @Valid
        ├─→ Calls VacationService.createVacationRequest()
        │
        ▼
5. Service Layer (VacationService.java)
        ├─→ Validates date range
        ├─→ Checks available vacation days
        ├─→ Creates VacationRequest entity
        ├─→ Saves via repository
        │
        ▼
6. Repository Layer
        ├─→ JPA saves to H2 database
        ├─→ Returns saved entity
        │
        ▼
7. Response flows back
        ├─→ Service → Controller → Frontend
        ├─→ Frontend updates UI
        └─→ Shows success message
```

### Example 2: Manager Approves Request

```
1. Manager clicks "Approve" button
        │
        ▼
2. Frontend (ManagerDashboard.tsx)
        ├─→ Calls vacationAPI.approveRequest(id)
        │
        ▼
3. Backend (VacationController.java)
        ├─→ @PreAuthorize checks MANAGER role
        ├─→ Calls VacationService.approveVacationRequest()
        │
        ▼
4. Service (VacationService.java)
        ├─→ Finds VacationRequest by ID
        ├─→ Checks status is PENDING
        ├─→ Updates status to APPROVED
        ├─→ Finds employee User
        ├─→ Increments usedVacationDays
        ├─→ Saves both entities
        │
        ▼
5. Frontend receives updated request
        ├─→ Reloads all requests
        ├─→ Updates statistics
        └─→ UI reflects changes
```

## 📊 API Design Principles

### RESTful Conventions
- **POST** - Create resources (`/api/vacations`)
- **GET** - Read resources (`/api/vacations`, `/api/vacations/employee/{name}`)
- **PUT** - Update resources (`/api/vacations/{id}/approve`)
- **DELETE** - Not implemented (requests can't be deleted)

### Response Codes
- **200 OK** - Successful GET/PUT
- **201 Created** - Successful POST
- **400 Bad Request** - Validation error
- **401 Unauthorized** - Authentication failed
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found

### Error Handling
```java
try {
    // Business logic
    return ResponseEntity.ok(result);
} catch (IllegalArgumentException e) {
    // Client error
    return ResponseEntity.badRequest().body(e.getMessage());
} catch (Exception e) {
    // Server error
    return ResponseEntity.internalServerError().body("Internal error");
}
```

## 🎨 Frontend Design Patterns

### Component Patterns
- **Container/Presentational** - Pages (containers) use components (presentational)
- **Protected Routes** - HOC pattern for authentication
- **Context Provider** - Global state without prop drilling

### State Management
```typescript
// Global auth state
AuthContext
  ├─→ user: User | null
  ├─→ login(credentials): Promise<void>
  ├─→ logout(): void
  └─→ isAuthenticated: boolean

// Local component state (useState)
EmployeeDashboard
  ├─→ requests: VacationRequest[]
  ├─→ loading: boolean
  ├─→ showForm: boolean
  └─→ formData: FormState
```

### API Integration
```typescript
// Axios interceptor adds auth automatically
api.interceptors.request.use((config) => {
  const auth = localStorage.getItem('auth');
  if (auth) {
    const { username, password } = JSON.parse(auth);
    config.auth = { username, password };
  }
  return config;
});
```

## 🔌 Technology Integration

### Backend Stack Integration
```
Spring Boot
  ├─→ Spring Web (REST API)
  ├─→ Spring Security (Authentication/Authorization)
  ├─→ Spring Data JPA (Data Access)
  ├─→ Spring Validation (Input Validation)
  └─→ H2 Database (Data Storage)
```

### Frontend Stack Integration
```
React
  ├─→ React Router (SPA Routing)
  ├─→ TypeScript (Type Safety)
  ├─→ TailwindCSS (Styling)
  ├─→ Axios (HTTP Client)
  └─→ Lucide React (Icons)
```

## 📈 Scalability Considerations

### Current Limitations (In-Memory DB)
- Data lost on restart
- Single server instance
- No data backup

### Future Improvements
1. **Database Migration**
   - Switch to PostgreSQL/MySQL
   - Add connection pooling
   - Implement migrations (Flyway/Liquibase)

2. **Authentication Enhancement**
   - JWT tokens instead of Basic Auth
   - Session management
   - Refresh token mechanism

3. **Caching Layer**
   - Redis for session storage
   - Cache vacation statistics
   - Reduce database queries

4. **Horizontal Scaling**
   - Load balancer
   - Multiple backend instances
   - Distributed session storage

5. **Monitoring & Logging**
   - Structured logging (JSON)
   - Application metrics (Prometheus)
   - Distributed tracing (Zipkin)

## 🏗️ Deployment Architecture (Future)

```
                    Internet
                       │
                       ▼
              ┌────────────────┐
              │  Load Balancer │
              └────────┬───────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
   ┌────────┐     ┌────────┐     ┌────────┐
   │ Backend│     │ Backend│     │ Backend│
   │Instance│     │Instance│     │Instance│
   └────┬───┘     └────┬───┘     └────┬───┘
        │              │              │
        └──────────────┼──────────────┘
                       ▼
              ┌────────────────┐
              │   PostgreSQL   │
              │    Database    │
              └────────────────┘
```

---

**This architecture provides a solid foundation for a production-ready vacation management system.** 🏛️
