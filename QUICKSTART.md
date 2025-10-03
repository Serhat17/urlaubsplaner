# ⚡ Quick Start Guide

Get the Urlaubsplanner up and running in **5 minutes**!

## 🚀 Quick Setup

### 1. Start Backend (Terminal 1)

```bash
cd backend
mvn spring-boot:run
```

Wait for: `Started UrlaubsplannerApplication in X seconds`

### 2. Start Frontend (Terminal 2)

```bash
cd frontend
npm install
npm start
```

Browser opens automatically at `http://localhost:3000`

### 3. Login & Test

**Login as Employee:**
- Username: `employee`
- Password: `password`
- You'll see Employee Dashboard

**Login as Manager:**
- Username: `manager`  
- Password: `password`
- You'll see Manager Dashboard

## 🎯 Quick Test Flow

### As Employee:
1. ✅ Click "Neue Urlaubsanfrage" (New Request)
2. ✅ Select dates (e.g., next week)
3. ✅ Add optional notes
4. ✅ Click "Anfrage erstellen" (Create Request)
5. ✅ See request appear with "Ausstehend" (Pending) status

### As Manager:
1. ✅ Logout from employee account
2. ✅ Login as manager
3. ✅ See all pending requests
4. ✅ Click "Genehmigen" (Approve) or "Ablehnen" (Reject)
5. ✅ See statistics update

## 📊 What You'll See

### Employee Dashboard
- 📈 Vacation days remaining (30 total)
- 📝 Create new requests
- 📋 View your request history
- 🎨 Progress bar showing usage

### Manager Dashboard
- 📊 Statistics overview
- 🔍 Filter by status (All/Pending/Approved/Rejected)
- ✅ Approve/Reject buttons
- 🎨 Color-coded status cards

## 🛠️ Developer Tools

### H2 Database Console
```
URL: http://localhost:8080/h2-console
JDBC URL: jdbc:h2:mem:urlaubsdb
Username: sa
Password: (empty)
```

### API Endpoints
```
Backend API: http://localhost:8080/api
- POST /auth/login
- GET  /vacations
- POST /vacations
- PUT  /vacations/{id}/approve
- PUT  /vacations/{id}/reject
```

## 🎨 UI Features to Try

- 🌙 **Toggle Dark Mode** (moon/sun icon in navbar)
- 📱 **Responsive Design** (resize browser window)
- ✨ **Hover Effects** (hover over cards and buttons)
- 🔄 **Real-time Updates** (approve request, see stats change)

## ⚠️ Troubleshooting

**Backend not starting?**
```bash
# Check Java version (need 17+)
java -version

# Clear and rebuild
mvn clean install
```

**Frontend not starting?**
```bash
# Clear node modules
rm -rf node_modules
npm install
```

**Can't login?**
- Clear browser localStorage (F12 → Application → Local Storage → Clear)
- Restart backend to reload demo users

## 📚 Next Steps

- 📖 Full documentation: [README.md](README.md)
- 🛠️ Detailed setup: [SETUP.md](SETUP.md)
- 🤝 Contributing: [CONTRIBUTING.md](CONTRIBUTING.md)

**Happy coding! 🎉**
