# 🛠️ Detailed Setup Guide

This guide provides step-by-step instructions for setting up the Urlaubsplanner project.

## Prerequisites Checklist

Before you begin, ensure you have the following installed:

- [ ] **Java Development Kit (JDK) 17 or higher**
  ```bash
  java -version
  # Should show: java version "17.x.x" or higher
  ```

- [ ] **Maven 3.6+**
  ```bash
  mvn -version
  # Should show: Apache Maven 3.x.x
  ```

- [ ] **Node.js 16+ and npm**
  ```bash
  node -v
  # Should show: v16.x.x or higher
  
  npm -v
  # Should show: 8.x.x or higher
  ```

- [ ] **Git**
  ```bash
  git --version
  # Should show: git version 2.x.x
  ```

## Installation Steps

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/urlaubsplanner.git
cd urlaubsplanner
```

### Step 2: Backend Setup

```bash
cd backend

# Install dependencies and build
mvn clean install

# This will:
# - Download all Maven dependencies
# - Compile the Java code
# - Run tests
# - Create a JAR file in target/
```

**Verify H2 Database:**
- The H2 database will be created automatically when you start the application
- Access H2 Console at: http://localhost:8080/h2-console
- Use these credentials:
  - JDBC URL: `jdbc:h2:mem:urlaubsdb`
  - Username: `sa`
  - Password: (leave empty)

### Step 3: Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# This will:
# - Download all npm packages
# - Set up React, TypeScript, and TailwindCSS
```

### Step 4: Run the Application

#### Option A: Using Scripts (Recommended)

**On macOS/Linux:**
```bash
# Make scripts executable
chmod +x start-backend.sh start-frontend.sh

# Terminal 1 - Start Backend
./start-backend.sh

# Terminal 2 - Start Frontend (in a new terminal)
./start-frontend.sh
```

**On Windows:**
```bash
# Terminal 1 - Start Backend
cd backend
mvn spring-boot:run

# Terminal 2 - Start Frontend
cd frontend
npm start
```

#### Option B: Manual Start

**Backend:**
```bash
cd backend
mvn spring-boot:run

# Or run the JAR directly:
# java -jar target/urlaubsplanner-1.0.0.jar
```

**Frontend:**
```bash
cd frontend
npm start
```

### Step 5: Access the Application

1. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

2. **Login with demo credentials:**
   
   **Employee:**
   - Username: `employee`
   - Password: `password`
   
   **Manager:**
   - Username: `manager`
   - Password: `password`

## Troubleshooting

### Backend Issues

**Problem:** Port 8080 already in use
```bash
# Solution: Stop the process using port 8080
# On macOS/Linux:
lsof -ti:8080 | xargs kill -9

# On Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

**Problem:** Maven build fails
```bash
# Clear Maven cache and rebuild
mvn clean
rm -rf ~/.m2/repository
mvn install
```

**Problem:** Database connection error
- Ensure H2 configuration in `application.properties` is correct
- Check if the application is using the correct database URL

### Frontend Issues

**Problem:** Port 3000 already in use
- React will automatically ask to use another port (e.g., 3001)
- Or kill the process: `lsof -ti:3000 | xargs kill -9`

**Problem:** npm install fails
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Problem:** CORS errors
- Ensure backend is running on port 8080
- Check CORS configuration in `SecurityConfig.java`
- Verify API_BASE_URL in `frontend/src/services/api.ts`

### Common Issues

**Problem:** Authentication fails
- Clear browser localStorage: Open DevTools → Application → Local Storage → Clear
- Restart both backend and frontend
- Verify demo users are loaded (check backend console logs)

**Problem:** Requests not appearing
- Check browser console for errors
- Verify API endpoints are accessible
- Check network tab in browser DevTools

## Development Workflow

### Backend Development

1. **Make changes** to Java files
2. **Restart** the Spring Boot application
   ```bash
   # Press Ctrl+C to stop, then:
   mvn spring-boot:run
   ```

3. **Test API endpoints** using:
   - Browser: http://localhost:8080/h2-console
   - Postman or similar tools
   - cURL commands

### Frontend Development

1. **Make changes** to React/TypeScript files
2. **Hot reload** is automatic - just save the file
3. **Test in browser** - changes appear immediately

### Database Management

**View data in H2 Console:**
1. Navigate to http://localhost:8080/h2-console
2. Login with credentials
3. Run SQL queries:
   ```sql
   SELECT * FROM USERS;
   SELECT * FROM VACATION_REQUESTS;
   ```

**Reset database:**
- Simply restart the Spring Boot application
- H2 in-memory DB resets automatically

## IDE Setup

### IntelliJ IDEA

1. **Import Project:** File → Open → Select `backend/pom.xml`
2. **Enable Lombok:** Install Lombok plugin, enable annotation processing
3. **Run Configuration:** 
   - Main class: `com.adesso.urlaubsplanner.UrlaubsplannerApplication`
   - Working directory: `backend/`

### VS Code

1. **Open workspace:** File → Open Folder → Select `urlaubsplanner/`
2. **Install extensions:**
   - Extension Pack for Java
   - Spring Boot Extension Pack
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense

3. **Configure launch.json** for debugging

### Eclipse

1. **Import:** File → Import → Maven → Existing Maven Projects
2. **Select:** `backend/pom.xml`
3. **Run:** Right-click on main class → Run As → Spring Boot App

## Environment Variables

### Backend
Create `backend/src/main/resources/application-dev.properties`:
```properties
# Custom development settings
server.port=8080
spring.h2.console.enabled=true
logging.level.com.adesso.urlaubsplanner=DEBUG
```

### Frontend
Create `frontend/.env.local`:
```
REACT_APP_API_URL=http://localhost:8080/api
```

## Testing

### Backend Tests
```bash
cd backend
mvn test

# Run specific test
mvn test -Dtest=VacationServiceTest

# Generate test coverage report
mvn jacoco:report
```

### Frontend Tests
```bash
cd frontend
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

## Production Build

### Backend
```bash
cd backend
mvn clean package -DskipTests

# JAR file created at:
# backend/target/urlaubsplanner-1.0.0.jar

# Run production JAR:
java -jar target/urlaubsplanner-1.0.0.jar
```

### Frontend
```bash
cd frontend
npm run build

# Build folder created at:
# frontend/build/

# Serve static files:
npx serve -s build
```

## Next Steps

- ✅ Application is running successfully
- 📖 Read the [README.md](README.md) for feature overview
- 🔧 Check [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines
- 🚀 Start developing your features!

## Support

If you encounter any issues not covered here:
1. Check the main [README.md](README.md)
2. Search existing GitHub issues
3. Create a new issue with details

Happy coding! 🎉
