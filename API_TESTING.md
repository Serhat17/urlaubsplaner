# 🧪 API Testing Guide

Test all API endpoints using cURL, Postman, or HTTPie.

## Authentication

All endpoints (except login) require HTTP Basic Authentication.

### Base64 Encoding for Auth

```bash
# Employee credentials
echo -n "employee:password" | base64
# Output: ZW1wbG95ZWU6cGFzc3dvcmQ=

# Manager credentials  
echo -n "manager:password" | base64
# Output: bWFuYWdlcjpwYXNzd29yZA==
```

## 🔐 Authentication Endpoints

### 1. Login (Employee)

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -u employee:password \
  -d '{
    "username": "employee",
    "password": "password"
  }'
```

**Response:**
```json
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

### 2. Login (Manager)

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -u manager:password \
  -d '{
    "username": "manager",
    "password": "password"
  }'
```

### 3. Logout

```bash
curl -X POST http://localhost:8080/api/auth/logout \
  -u employee:password
```

## 📝 Vacation Request Endpoints

### 4. Create Vacation Request (Employee Only)

```bash
curl -X POST http://localhost:8080/api/vacations \
  -H "Content-Type: application/json" \
  -u employee:password \
  -d '{
    "employeeName": "employee",
    "startDate": "2025-10-15",
    "endDate": "2025-10-20",
    "notes": "Family vacation in Berlin"
  }'
```

**Response:**
```json
{
  "id": 1,
  "employeeName": "employee",
  "startDate": "2025-10-15",
  "endDate": "2025-10-20",
  "status": "PENDING",
  "notes": "Family vacation in Berlin",
  "createdAt": "2025-10-03",
  "daysRequested": 6
}
```

### 5. Get All Vacation Requests (Manager Only)

```bash
curl -X GET http://localhost:8080/api/vacations \
  -u manager:password
```

**Response:**
```json
[
  {
    "id": 1,
    "employeeName": "employee",
    "startDate": "2025-10-15",
    "endDate": "2025-10-20",
    "status": "PENDING",
    "notes": "Family vacation in Berlin",
    "createdAt": "2025-10-03",
    "daysRequested": 6
  }
]
```

### 6. Get Requests by Employee Name

```bash
curl -X GET http://localhost:8080/api/vacations/employee/employee \
  -u employee:password
```

### 7. Approve Vacation Request (Manager Only)

```bash
curl -X PUT http://localhost:8080/api/vacations/1/approve \
  -u manager:password
```

**Response:**
```json
{
  "id": 1,
  "employeeName": "employee",
  "startDate": "2025-10-15",
  "endDate": "2025-10-20",
  "status": "APPROVED",
  "notes": "Family vacation in Berlin",
  "createdAt": "2025-10-03",
  "daysRequested": 6
}
```

### 8. Reject Vacation Request (Manager Only)

```bash
curl -X PUT http://localhost:8080/api/vacations/1/reject \
  -u manager:password
```

## 🧪 Test Scenarios

### Scenario 1: Employee Workflow

```bash
# Step 1: Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -u employee:password \
  -d '{"username": "employee", "password": "password"}'

# Step 2: Create vacation request
curl -X POST http://localhost:8080/api/vacations \
  -H "Content-Type: application/json" \
  -u employee:password \
  -d '{
    "employeeName": "employee",
    "startDate": "2025-11-01",
    "endDate": "2025-11-05",
    "notes": "Thanksgiving break"
  }'

# Step 3: Check my requests
curl -X GET http://localhost:8080/api/vacations/employee/employee \
  -u employee:password
```

### Scenario 2: Manager Workflow

```bash
# Step 1: Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -u manager:password \
  -d '{"username": "manager", "password": "password"}'

# Step 2: Get all pending requests
curl -X GET http://localhost:8080/api/vacations \
  -u manager:password

# Step 3: Approve request (replace 1 with actual ID)
curl -X PUT http://localhost:8080/api/vacations/1/approve \
  -u manager:password
```

### Scenario 3: Error Handling

**Invalid credentials:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -u employee:wrongpassword \
  -d '{"username": "employee", "password": "wrongpassword"}'
```

**Employee tries to access manager endpoint:**
```bash
curl -X GET http://localhost:8080/api/vacations \
  -u employee:password
# Returns 403 Forbidden
```

**Invalid date range:**
```bash
curl -X POST http://localhost:8080/api/vacations \
  -H "Content-Type: application/json" \
  -u employee:password \
  -d '{
    "employeeName": "employee",
    "startDate": "2025-10-20",
    "endDate": "2025-10-15",
    "notes": "End before start - should fail"
  }'
```

**Insufficient vacation days:**
```bash
curl -X POST http://localhost:8080/api/vacations \
  -H "Content-Type: application/json" \
  -u employee:password \
  -d '{
    "employeeName": "employee",
    "startDate": "2025-10-01",
    "endDate": "2025-12-31",
    "notes": "90 days - should fail"
  }'
```

## 📋 Postman Collection

Import this JSON into Postman:

```json
{
  "info": {
    "name": "Urlaubsplanner API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth - Login Employee",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "auth": {
          "type": "basic",
          "basic": [
            {"key": "username", "value": "employee"},
            {"key": "password", "value": "password"}
          ]
        },
        "body": {
          "mode": "raw",
          "raw": "{\"username\":\"employee\",\"password\":\"password\"}"
        },
        "url": {"raw": "http://localhost:8080/api/auth/login"}
      }
    },
    {
      "name": "Vacation - Create Request",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "auth": {
          "type": "basic",
          "basic": [
            {"key": "username", "value": "employee"},
            {"key": "password", "value": "password"}
          ]
        },
        "body": {
          "mode": "raw",
          "raw": "{\"employeeName\":\"employee\",\"startDate\":\"2025-10-15\",\"endDate\":\"2025-10-20\",\"notes\":\"Test vacation\"}"
        },
        "url": {"raw": "http://localhost:8080/api/vacations"}
      }
    }
  ]
}
```

## 🔍 HTTPie Examples

If you prefer HTTPie over cURL:

```bash
# Login
http POST localhost:8080/api/auth/login \
  username=employee password=password \
  -a employee:password

# Create request
http POST localhost:8080/api/vacations \
  employeeName=employee \
  startDate=2025-10-15 \
  endDate=2025-10-20 \
  notes="Beach vacation" \
  -a employee:password

# Get all requests (manager)
http GET localhost:8080/api/vacations \
  -a manager:password

# Approve request
http PUT localhost:8080/api/vacations/1/approve \
  -a manager:password
```

## 🐛 Debugging Tips

### Enable detailed logging:

Edit `application.properties`:
```properties
logging.level.org.springframework.security=DEBUG
logging.level.org.springframework.web=DEBUG
```

### Check H2 Database:

```bash
# Access H2 Console
open http://localhost:8080/h2-console

# SQL Queries
SELECT * FROM USERS;
SELECT * FROM VACATION_REQUESTS;
SELECT * FROM VACATION_REQUESTS WHERE STATUS = 'PENDING';
```

### Common HTTP Status Codes:

- `200 OK` - Request successful
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Authentication failed
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## 📊 Performance Testing

### Load test with Apache Bench:

```bash
# Install Apache Bench
brew install apache-bench  # macOS
# or apt-get install apache2-utils  # Linux

# Test login endpoint (100 requests, 10 concurrent)
ab -n 100 -c 10 -u employee:password \
  -p login.json -T application/json \
  http://localhost:8080/api/auth/login
```

### Test with wrk:

```bash
# Install wrk
brew install wrk  # macOS

# Load test GET endpoint
wrk -t4 -c100 -d30s \
  --header "Authorization: Basic ZW1wbG95ZWU6cGFzc3dvcmQ=" \
  http://localhost:8080/api/vacations/employee/employee
```

---

**Happy Testing! 🧪**
