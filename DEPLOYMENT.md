# 🚀 Deployment Guide

Step-by-step guide to deploy Urlaubsplanner to production.

## 🎯 Deployment Options

### Option 1: Heroku (Recommended for Quick Deploy)
### Option 2: AWS (Elastic Beanstalk + RDS)
### Option 3: Docker + Any Cloud Provider
### Option 4: Traditional VPS (DigitalOcean, Linode)

---

## 📦 Option 1: Heroku Deployment

### Prerequisites
- Heroku account (free tier available)
- Heroku CLI installed
- Git repository

### Backend Deployment

#### Step 1: Prepare Backend for Heroku

Create `backend/system.properties`:
```properties
java.runtime.version=17
```

Create `backend/Procfile`:
```
web: java -jar target/urlaubsplanner-1.0.0.jar
```

Update `backend/src/main/resources/application-prod.properties`:
```properties
server.port=${PORT:8080}
spring.datasource.url=${DATABASE_URL}
spring.jpa.hibernate.ddl-auto=update
```

#### Step 2: Deploy Backend

```bash
cd backend

# Login to Heroku
heroku login

# Create Heroku app
heroku create urlaubsplanner-backend

# Add PostgreSQL addon (replaces H2)
heroku addons:create heroku-postgresql:hobby-dev

# Deploy
git init
git add .
git commit -m "Initial backend deployment"
git push heroku main

# View logs
heroku logs --tail
```

### Frontend Deployment

#### Step 1: Update API URL

Edit `frontend/src/services/api.ts`:
```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
```

Create `frontend/.env.production`:
```
REACT_APP_API_URL=https://urlaubsplanner-backend.herokuapp.com/api
```

#### Step 2: Deploy to Vercel/Netlify

**Using Vercel:**
```bash
cd frontend

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Using Netlify:**
```bash
cd frontend

# Build
npm run build

# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=build
```

---

## 🐳 Option 2: Docker Deployment

### Create Dockerfiles

**Backend Dockerfile** (`backend/Dockerfile`):
```dockerfile
FROM maven:3.8-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/urlaubsplanner-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Frontend Dockerfile** (`frontend/Dockerfile`):
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Frontend nginx.conf** (`frontend/nginx.conf`):
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Docker Compose

Create `docker-compose.yml` in root:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: urlaubsdb
      POSTGRES_USER: urlaubsplanner
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/urlaubsdb
      SPRING_DATASOURCE_USERNAME: urlaubsplanner
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
      SPRING_JPA_HIBERNATE_DDL_AUTO: update
    depends_on:
      - postgres
    networks:
      - app-network

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - app-network

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

### Deploy with Docker

```bash
# Create .env file
echo "DB_PASSWORD=your_secure_password" > .env

# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## ☁️ Option 3: AWS Deployment

### Architecture
```
Route 53 (DNS)
     │
     ▼
CloudFront (CDN) → S3 (Frontend Static Files)
     │
     ▼
Application Load Balancer
     │
     ▼
Elastic Beanstalk (Backend)
     │
     ▼
RDS PostgreSQL (Database)
```

### Step 1: Backend on Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
cd backend
eb init -p corretto-17 urlaubsplanner-backend --region eu-central-1

# Create environment
eb create urlaubsplanner-backend-env

# Deploy
eb deploy

# Open in browser
eb open
```

### Step 2: Frontend on S3 + CloudFront

```bash
cd frontend

# Build
npm run build

# Upload to S3
aws s3 sync build/ s3://urlaubsplanner-frontend --delete

# Create CloudFront distribution (via AWS Console)
# Point to S3 bucket
# Enable HTTPS
```

### Step 3: Database on RDS

```bash
# Create PostgreSQL instance via AWS Console
# Security Group: Allow port 5432 from EB security group
# Update EB environment variables with RDS endpoint
```

---

## 🔒 Environment Variables (Production)

### Backend Variables
```bash
# Database
DATABASE_URL=jdbc:postgresql://your-db-host:5432/urlaubsdb
DATABASE_USERNAME=urlaubsplanner
DATABASE_PASSWORD=secure_password

# Server
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=prod

# CORS
ALLOWED_ORIGINS=https://yourdomain.com

# Security
JWT_SECRET=your_secret_key_here  # If using JWT
```

### Frontend Variables
```bash
REACT_APP_API_URL=https://api.yourdomain.com/api
REACT_APP_ENV=production
```

---

## 🗄️ Database Migration (H2 → PostgreSQL)

### Step 1: Update pom.xml

```xml
<!-- Remove H2 dependency -->
<!-- Add PostgreSQL -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

### Step 2: Update application.properties

```properties
# PostgreSQL Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/urlaubsdb
spring.datasource.username=postgres
spring.datasource.password=your_password

spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
```

### Step 3: Run Migration

```bash
# Create database
createdb urlaubsdb

# Run application (will create tables)
mvn spring-boot:run

# Or use Flyway/Liquibase for versioned migrations
```

---

## 🔐 Security Hardening

### Production Checklist

#### Backend
- [ ] Change default passwords
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS only
- [ ] Implement rate limiting
- [ ] Add request validation
- [ ] Enable CORS only for your domain
- [ ] Use JWT instead of Basic Auth
- [ ] Implement refresh tokens
- [ ] Add audit logging
- [ ] Enable SQL injection protection (JPA helps)
- [ ] Configure security headers

#### Frontend
- [ ] Remove console.log statements
- [ ] Minify and obfuscate code
- [ ] Enable Content Security Policy
- [ ] Use HTTPS only
- [ ] Implement XSS protection
- [ ] Validate all user inputs
- [ ] Remove sensitive data from localStorage
- [ ] Add error boundaries

#### Infrastructure
- [ ] Use managed SSL certificates
- [ ] Configure firewall rules
- [ ] Enable DDoS protection
- [ ] Set up monitoring & alerts
- [ ] Configure automated backups
- [ ] Implement disaster recovery
- [ ] Use CDN for static assets

---

## 📊 Monitoring & Logging

### Backend Logging

Add to `application-prod.properties`:
```properties
# Logging
logging.level.root=WARN
logging.level.com.adesso.urlaubsplanner=INFO
logging.file.name=/var/log/urlaubsplanner/app.log
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} - %msg%n
```

### Application Monitoring

**Options:**
- **New Relic** - APM monitoring
- **Datadog** - Infrastructure & logs
- **Prometheus + Grafana** - Metrics & dashboards
- **Sentry** - Error tracking

### Setup Example (Prometheus)

Add to `pom.xml`:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

Enable metrics:
```properties
management.endpoints.web.exposure.include=health,metrics,prometheus
management.metrics.export.prometheus.enabled=true
```

---

## 🚦 CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'
      
      - name: Build with Maven
        run: |
          cd backend
          mvn clean package -DskipTests
      
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "urlaubsplanner-backend"
          heroku_email: "your-email@example.com"
  
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Build Frontend
        run: |
          cd frontend
          npm install
          npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID}}
          vercel-project-id: ${{ secrets.PROJECT_ID}}
          vercel-args: '--prod'
```

---

## 🧪 Pre-Deployment Testing

### Checklist
- [ ] Run all unit tests: `mvn test`
- [ ] Run all frontend tests: `npm test`
- [ ] Test all API endpoints
- [ ] Verify CORS settings
- [ ] Test authentication flow
- [ ] Verify role-based access
- [ ] Load testing (Apache Bench, k6)
- [ ] Security scan (OWASP ZAP)
- [ ] Browser compatibility
- [ ] Mobile responsiveness
- [ ] Lighthouse audit (90+ score)

---

## 📈 Performance Optimization

### Backend
```properties
# Connection pooling
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5

# JPA optimization
spring.jpa.properties.hibernate.jdbc.batch_size=20
spring.jpa.properties.hibernate.order_inserts=true
spring.jpa.properties.hibernate.order_updates=true

# Enable compression
server.compression.enabled=true
server.compression.mime-types=application/json,application/xml,text/html,text/xml,text/plain
```

### Frontend
- Enable gzip compression
- Use CDN for assets
- Lazy load components
- Code splitting
- Image optimization
- Service Worker caching

---

## 🔄 Rollback Strategy

```bash
# Heroku rollback
heroku releases
heroku rollback v123

# Docker rollback
docker-compose down
docker-compose up -d --force-recreate

# AWS EB rollback
eb deploy --version previous-version-label
```

---

## 📝 Post-Deployment Checklist

- [ ] Verify application is accessible
- [ ] Test login functionality
- [ ] Create test vacation request
- [ ] Verify manager approval flow
- [ ] Check all API endpoints
- [ ] Monitor error logs for 24h
- [ ] Verify SSL certificate
- [ ] Test mobile experience
- [ ] Check performance metrics
- [ ] Update documentation with production URLs
- [ ] Notify stakeholders

---

**Your application is now live! 🎉**

Production URL: `https://your-domain.com`  
API URL: `https://api.your-domain.com`
