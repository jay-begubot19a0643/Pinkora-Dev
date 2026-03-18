# Pinkora Portfolio - Complete File Structure

## HTML Pages

### mainpage.html
- **Purpose**: Home/landing page
- **Contains**: Welcome message, selected projects showcase, hero section
- **Key Features**: Project cards with working anchor links, navigation menu with "My Account" link
- **Updated**: Added navigation link to account.html

### projects.html
- **Purpose**: Full projects portfolio with detailed descriptions
- **Contains**: Project cards (Smart Monitoring System, Ready-to-Wear Store, etc.), descriptions, links
- **Key Features**: Anchor link navigation (projects.html#smart-monitoring), responsive grid layout
- **Updated**: Added "My Account" link, improved card click handlers

### services.html
- **Purpose**: Professional services offered
- **Contains**: 6 service cards with descriptions
- **Services Listed**:
  1. Web Development
  2. Mobile App Development
  3. Custom Business Solutions
  4. CCTV Integration & Security
  5. POS & Inventory Management
  6. Analytics & Dashboards
- **Key Features**: Hover animations, responsive grid, icons for each service
- **Updated**: Added "My Account" link

### clients.html
- **Purpose**: Client showcase and testimonials
- **Contains**: Ready-to-Wear Orly Store client card with project details
- **Key Features**: Client information, services provided, status badge, location
- **Updated**: Added "My Account" link

### contact.html
- **Purpose**: Contact form and communication channel
- **Contains**: 
  - Contact form (name, email, phone, subject, message)
  - Profile section with image and title
  - 4 social media buttons (Facebook, TikTok, Raket.ph, YouTube)
- **Key Features**: Form validation, FormSubmit integration (sends to jaybe.gubot01@gmail.com)
- **Updated**: Added "My Account" link

### account.html ⭐ NEW
- **Purpose**: User account dashboard and authentication hub
- **Contains**:
  - Email/password login form
  - Email/password sign-up modal
  - User profile display (when logged in)
  - 6 dashboard cards: Projects, Purchases, Subscriptions, Feedback, Settings, Security
  - Feedback submission modal
- **Key Features**: 
  - Conditional rendering (unauthenticated vs authenticated views)
  - User profile name, email display
  - Modals for sign-up and feedback
  - Dashboard cards with icons and descriptions
- **Dependencies**: auth.js, styles.css

---

## JavaScript Files

### script.js
- **Purpose**: Main application logic and utilities
- **Key Functions**:
  - `initProjects()`: Load project cards with anchor link support
  - `initContactForm()`: Contact form validation and FormSubmit integration
  - `showFormSuccess()`: Display success message with 5-second auto-dismiss
  - `showFormError()`: Display error message with retry option
  - `toggleTheme()`: Switch between dark/light mode (uses localStorage)
  - `initTheme()`: Load saved theme preference on page load
  - `handleNavigation()`: Smooth page scrolling
- **Updated**: Added contact form handler with FormSubmit integration

### auth.js ⭐ NEW
- **Purpose**: PHP API authentication and session management
- **Key Functions**:
  - `checkAuthStatus()`: Checks user session status via auth-check.php
  - `setupSignUpForm()`: Email/password registration via register.php
  - `setupLoginForm()`: User login via login.php
  - `setupFeedbackForm()`: Feedback submission via submit-feedback.php
  - `updateUIBasedOnAuth()`: Toggle authenticated/unauthenticated UI
  - `loadUserData()`: Display user profile information
  - `setupSignOut()`: User logout via logout.php
  - Modal handlers: `openSignUpModal()`, `closeFeedbackModal()`, etc.
- **Key Features**:
  - PHP API endpoints for all authentication
  - Email/password signup with server-side validation
  - Session persistence using cookies
  - Server database storage (users, feedback tables)
  - API-based architecture
- **Dependencies**: styles.css
- **API Endpoints**: /api/auth-check.php, /api/register.php, /api/login.php, /api/logout.php, /api/submit-feedback.php

---

## CSS Files

### styles.css
- **Purpose**: All styling and responsive design
- **Key Sections**:
  - General styles (typography, spacing, colors)
  - Navigation styles (.navbar, menu items)
  - Hero section (.hero)
  - Project cards (.project-card, .projects-grid)
  - Service cards (.service-card, .services-grid) ✅ NEW
  - Client cards (.client-card, .clients-grid) ✅ NEW
  - Contact form (.contact-form-wrapper, .form-group, .social-btn) ✅ NEW
  - Authentication (.auth-section, .auth-box, .btn-google) ✅ NEW
  - User dashboard (.user-dashboard, .dashboard-grid, .dashboard-card) ✅ NEW
  - Modals (.modal, .modal-content, .modal-close) ✅ NEW
  - Theme toggle (.theme-toggle, .dark-mode)
  - Responsive breakpoints (480px, 768px, 1024px)
- **Updated**: Added 1000+ lines for authentication UI, contact forms, service cards, client cards

### images/
- **Purpose**: Image assets folder
- **Contains**: Project screenshots, client logos, service icons
- **Usage**: Referenced in HTML pages for visual content

---

## Configuration Files

### IMPLEMENTATION_GUIDE.md ⭐ NEW
- **Purpose**: Step-by-step guide for implementing advanced features
- **Contains**:
  - Payment integration (Stripe/PayPal examples)
  - Subscription system setup
  - Comments & reviews implementation
  - User access control and content gating
  - Database schema examples
  - Testing checklist
  - Backend server structure example (PHP)
- **When to Use**: After authentication is setup, when adding payments, subscriptions, or comments

---

## Directory Structure

```
Pinkora Dev/
├── HTML Pages
│   ├── mainpage.html          (Home page)
│   ├── projects.html          (Portfolio)
│   ├── services.html          (Services offered)
│   ├── clients.html           (Client showcase)
│   ├── contact.html           (Contact form)
│   ├── account.html           ⭐ NEW (User dashboard)
│
├── JavaScript
│   ├── script.js              (Main logic)
│   ├── auth.js                ⭐ NEW (Firebase auth)
│
├── Styling
│   └── styles.css             (All styles)
│
├── Assets
│   └── images/                (Logos, screenshots, icons)
│
├── Documentation
│   ├── IMPLEMENTATION_GUIDE.md ⭐ NEW (Feature guide)
│   └── FILE_STRUCTURE.md      (This file)
│
└── Data
    ├── mainpage.txt           (Project data)
    └── src/                   (Additional resources)
```

---

## Feature Status

### ✅ Completed
- Navigation with anchor links
- Project showcase
- Service cards (6 services)
- Client showcase (Ready-to-Wear Orly Store)
- Contact form with email integration
- Social media links (4 platforms)
- Google Sign-In authentication
- Email/password signup
- User dashboard with profile display
- Feedback submission system
- Firestore database integration
- Theme toggle (dark/light mode)
- Responsive design (mobile, tablet, desktop)
- Email/password authentication via PHP
- User session management via cookies
- Feedback submission to database

### 🔄 Ready to Implement (Scaffolding in Place)
- Stripe/PayPal payment processing
- Subscription management
- Purchase history tracking
- Comments & reviews on projects
- Account settings page
- Security & privacy management
- Project access control

---

## Quick Start Checklist

**For Initial Setup:**
1. ✅ All HTML pages created
2. ✅ JavaScript logic implemented
3. ✅ Styling applied (responsive)
4. ✅ PHP API files created (auth.js, account.html)
5. ✅ Database setup complete (see database-setup.sql)
6. ⏳ **NEXT**: Deploy to PHP-enabled hosting (Hostinger, shared hosting, etc.)

**For Testing (Local):**
- Requires PHP server with MySQL
- Update api/config.php with database credentials
- Test authentication endpoints
- Verify session management

**For Adding Features:**
- See IMPLEMENTATION_GUIDE.md for code examples
- Follow database schema patterns provided
- Update Firestore security rules as needed

---

## File Size Reference

| File | Size | Type |
|------|------|------|
| mainpage.html | ~300 lines | HTML |
| projects.html | ~250 lines | HTML |
| services.html | ~180 lines | HTML |
| clients.html | ~150 lines | HTML |
| contact.html | ~200 lines | HTML |
| account.html | ~200 lines | HTML |
| script.js | ~350 lines | JavaScript |
| auth.js | ~300 lines | JavaScript |
| styles.css | ~1500 lines | CSS |
| FIREBASE_SETUP.md | ~300 lines | Markdown |
| IMPLEMENTATION_GUIDE.md | ~400 lines | Markdown |

---

## API & Service Integrations

### Backend Services
- **PHP API**: Authentication, user management, feedback handling
- **MySQL Database**: User data, feedback, purchases, subscriptions storage

### API Endpoints
- `POST /api/register.php`: User registration (email, password, name)
- `POST /api/login.php`: User login (email, password)
- `GET /api/auth-check.php`: Check current user session
- `POST /api/logout.php`: User logout
- `POST /api/submit-feedback.php`: Submit feedback (requires authentication)
- `POST /api/contact-form.php`: Contact form submission
- **FormSubmit**: Contact form email delivery (goes to jaybe.gubot01@gmail.com)
- **Google Sign-In SDK**: OAuth authentication popup
- **Theme Storage**: Browser localStorage for dark/light mode preference

### Planned Integrations
- **Stripe**: Payment processing
- **PayPal**: Alternative payment method
- **Email Service**: Transactional emails (welcome, password reset, receipts)

---

## Contact & Support

**Email**: jaybe.gubot01@gmail.com (contact form destination)

**Social Media**:
- Facebook
- TikTok
- Raket.ph
- YouTube

---

**Last Updated**: After Firebase authentication implementation
**Maintenance**: Review FIREBASE_SETUP.md annually for security best practices
