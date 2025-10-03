# 📸 Screenshots & Visual Guide

Visual overview of the Urlaubsplanner application for your GitHub README and portfolio.

## 🎨 UI Screenshots

### 1. Login Page
**Location:** `http://localhost:3000/login`

**Features to capture:**
- ✅ Clean, centered login form
- ✅ Gradient background (primary blue)
- ✅ Calendar icon in white circle
- ✅ Username and password inputs with icons
- ✅ Demo credentials display at bottom
- ✅ "Urlaubsplanner" branding

**Screenshot tips:**
- Capture at 1920x1080 resolution
- Show both light and dark mode versions
- Highlight the modern, professional design

---

### 2. Employee Dashboard - Overview
**Location:** `http://localhost:3000/employee` (login as employee)

**Features to capture:**
- ✅ Navigation bar with user info and dark mode toggle
- ✅ Three statistics cards:
  - Available vacation days (primary gradient)
  - Used days (white card)
  - Total days (white card)
- ✅ Progress bar showing vacation usage
- ✅ "Neue Urlaubsanfrage" button

**Screenshot tips:**
- Show the complete dashboard with statistics
- Capture the gradient effect on the first card
- Include the navigation bar

---

### 3. Employee Dashboard - Create Request
**Features to capture:**
- ✅ Expanded form with date pickers
- ✅ Start date and end date inputs
- ✅ Optional notes textarea
- ✅ "Anfrage erstellen" and "Abbrechen" buttons

**Screenshot tips:**
- Show the form filled with sample data
- Capture the clean input design

---

### 4. Employee Dashboard - Request Cards
**Features to capture:**
- ✅ Grid layout of vacation request cards
- ✅ Color-coded status badges:
  - Yellow = Pending
  - Green = Approved
  - Red = Rejected
- ✅ Date ranges with calendar icons
- ✅ Days requested counter
- ✅ Optional notes display

**Screenshot tips:**
- Create requests with all three status types
- Show at least 3-6 cards in grid
- Highlight the hover effects

---

### 5. Manager Dashboard - Statistics
**Location:** `http://localhost:3000/manager` (login as manager)

**Features to capture:**
- ✅ Four gradient statistics cards:
  - Total (primary blue)
  - Pending (yellow)
  - Approved (green)
  - Rejected (red)
- ✅ Each card with icon and count
- ✅ Manager-specific navigation bar

**Screenshot tips:**
- Show meaningful statistics (not all zeros)
- Capture the gradient effects
- Include the complete header

---

### 6. Manager Dashboard - Filter & Actions
**Features to capture:**
- ✅ Filter buttons (All, Pending, Approved, Rejected)
- ✅ Active filter highlighted
- ✅ Vacation cards with action buttons
- ✅ "Genehmigen" (green) and "Ablehnen" (red) buttons
- ✅ Buttons only on PENDING requests

**Screenshot tips:**
- Show the Pending filter active
- Display cards with action buttons
- Capture the button hover states

---

### 7. Dark Mode
**Features to capture:**
- ✅ Dark mode toggle in navbar (moon/sun icon)
- ✅ Dark background (gray-900)
- ✅ Cards with dark styling (gray-800)
- ✅ Proper contrast for text
- ✅ Gradient colors adjusted for dark mode

**Screenshot tips:**
- Capture both Employee and Manager dashboards
- Show the smooth transition
- Highlight the professional dark theme

---

### 8. Responsive Design - Mobile View
**Features to capture:**
- ✅ Mobile login screen (375px width)
- ✅ Stacked statistics cards
- ✅ Single-column vacation cards
- ✅ Responsive navigation
- ✅ Touch-friendly buttons

**Screenshot tips:**
- Use Chrome DevTools (Device Toolbar)
- Capture iPhone 12 Pro or similar
- Show both portrait and landscape

---

## 🎬 Video Demo Script

Create a 2-3 minute demo video covering:

### Minute 1: Employee Flow
1. **Login** as employee (0:00-0:10)
   - Show login page
   - Enter credentials
   - Redirect to dashboard

2. **View Statistics** (0:10-0:20)
   - Highlight vacation days remaining
   - Show progress bar

3. **Create Request** (0:20-0:50)
   - Click "Neue Urlaubsanfrage"
   - Fill in dates (e.g., next week)
   - Add notes
   - Submit request
   - Show success & card appears

4. **View Request** (0:50-1:00)
   - Scroll through request list
   - Highlight status badge

### Minute 2: Manager Flow
5. **Logout & Switch** (1:00-1:10)
   - Logout from employee
   - Login as manager

6. **Manager Overview** (1:10-1:20)
   - Show statistics dashboard
   - Highlight pending count

7. **Filter & Approve** (1:20-1:50)
   - Click "Ausstehend" filter
   - View pending requests
   - Click "Genehmigen" on employee request
   - Show statistics update

8. **Final View** (1:50-2:00)
   - Click "Genehmigt" filter
   - Show approved request

### Minute 3: Extra Features
9. **Dark Mode** (2:00-2:15)
   - Toggle dark mode
   - Show both dashboards in dark

10. **Responsive** (2:15-2:30)
    - Resize browser window
    - Show mobile layout

---

## 📊 Screenshots for GitHub README

### Recommended structure:

```markdown
## Screenshots

### Login Page
![Login Light](./screenshots/login-light.png)
![Login Dark](./screenshots/login-dark.png)

### Employee Dashboard
![Employee Overview](./screenshots/employee-dashboard.png)
![Create Request](./screenshots/create-request.png)
![Request Cards](./screenshots/request-cards.png)

### Manager Dashboard
![Manager Overview](./screenshots/manager-dashboard.png)
![Approve/Reject](./screenshots/manager-actions.png)

### Dark Mode
![Dark Mode Employee](./screenshots/dark-employee.png)
![Dark Mode Manager](./screenshots/dark-manager.png)

### Mobile View
![Mobile Login](./screenshots/mobile-login.png)
![Mobile Dashboard](./screenshots/mobile-dashboard.png)
```

---

## 🖼️ Creating Screenshots

### Method 1: Browser Screenshots
```bash
# macOS
Cmd + Shift + 4  # Select area to capture

# Windows
Win + Shift + S  # Snipping tool

# Linux
PrtScn  # Screenshot tool
```

### Method 2: Browser DevTools
1. Open Chrome DevTools (F12)
2. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows)
3. Type "screenshot"
4. Choose:
   - "Capture screenshot" (visible area)
   - "Capture full size screenshot" (entire page)
   - "Capture node screenshot" (specific element)

### Method 3: Automated Screenshots (Puppeteer)

```bash
# Create screenshots folder
mkdir -p screenshots

# Install puppeteer
npm install -D puppeteer

# Run screenshot script
node scripts/take-screenshots.js
```

**Screenshot script example:**
```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Login page
  await page.goto('http://localhost:3000/login');
  await page.screenshot({ path: 'screenshots/login-light.png' });
  
  // Login as employee
  await page.type('input[type="text"]', 'employee');
  await page.type('input[type="password"]', 'password');
  await page.click('button[type="submit"]');
  await page.waitForNavigation();
  
  // Employee dashboard
  await page.screenshot({ path: 'screenshots/employee-dashboard.png' });
  
  await browser.close();
})();
```

---

## 🎯 Image Optimization

Before uploading to GitHub:

```bash
# Install ImageMagick or use online tools

# Resize to max 1920px width
convert screenshot.png -resize 1920x screenshot-optimized.png

# Compress PNG
pngquant screenshot.png --quality=65-80 --output screenshot-compressed.png

# Convert to WebP (smaller file size)
cwebp screenshot.png -q 80 -o screenshot.webp
```

---

## 📋 Screenshot Checklist

Before publishing on GitHub, ensure you have:

- [ ] Login page (light mode)
- [ ] Login page (dark mode)
- [ ] Employee dashboard overview
- [ ] Employee create request form
- [ ] Employee request cards with all status types
- [ ] Manager dashboard with statistics
- [ ] Manager view with approve/reject buttons
- [ ] Dark mode screenshots (at least 2)
- [ ] Mobile/responsive view (at least 2)
- [ ] H2 console view (optional, for technical docs)

---

## 🚀 Showcase Tips

### For GitHub README:
1. **Hero image first** - Eye-catching dashboard screenshot
2. **Feature highlights** - GIF showing key interactions
3. **Architecture diagram** - From ARCHITECTURE.md
4. **Mobile responsiveness** - Side-by-side comparison

### For Portfolio:
1. **Live demo link** - Deploy to Heroku/Vercel
2. **Video walkthrough** - Embed YouTube demo
3. **Technical deep-dive** - Link to ARCHITECTURE.md
4. **Code highlights** - Show key implementation details

### For adesso Application:
1. **Professional presentation** - Clean, organized screenshots
2. **Business value focus** - Show user workflow
3. **Technical excellence** - Code quality, architecture
4. **Modern UI/UX** - Highlight design skills

---

**Remember:** Quality over quantity! 3-4 excellent, well-composed screenshots are better than 10 average ones. 📸
