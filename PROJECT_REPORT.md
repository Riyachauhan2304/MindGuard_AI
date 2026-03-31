# MindGuard - Chrome Extension & Web Platform
## Project Report & Documentation

---

## Executive Summary

MindGuard is a productivity-focused web application with a lightweight Chrome Extension companion. The platform helps users combat digital distractions by allowing them to block websites and track their focus metrics. The architecture follows a separation of concerns model where the website handles complex features (rules management, analytics, user settings) while the extension focuses solely on enforcement (blocking websites based on synced rules).

**Project Type:** Web Application + Chrome Extension (Manifest V3)
**Target Users:** Students, professionals, content creators
**Primary Function:** Website blocking and focus tracking

---

## Project Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    MindGuard Web Platform                        │
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐│
│  │  User Dashboard  │  │  Rules Manager   │  │    Analytics     ││
│  │  - Registration  │  │  - Add Rules     │  │  - Charts        ││
│  │  - Login         │  │  - Edit Rules    │  │  - Statistics    ││
│  │  - Profile       │  │  - Delete Rules  │  │  - Insights      ││
│  └──────────────────┘  └──────────────────┘  └──────────────────┘│
│                                                                   │
│                        Backend API                               │
│                  (User, Rules, Settings)                        │
└─────────────────────────────────────────────────────────────────┘
                              ↕ (API Calls)
┌─────────────────────────────────────────────────────────────────┐
│                  MindGuard Chrome Extension                       │
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐│
│  │   Login/Sync     │  │   Blocking       │  │   Toggle         ││
│  │  - Email/Pass    │  │  - Check Rules   │  │  - Enable/Off    ││
│  │  - Sync Rules    │  │  - Block Sites   │  │  - Control       ││
│  │  - Store User    │  │  - Show Message  │  │  - Status        ││
│  └──────────────────┘  └──────────────────┘  └──────────────────┘│
│                                                                   │
│              Lightweight & Fast (No DB, No Complex UI)          │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                      User's Browser                              │
│                    (Website Blocking)                            │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend (Website):**
- HTML5, CSS3, JavaScript (or Next.js/React)
- Responsive design
- RESTful API integration

**Backend (API Server):**
- Node.js/Express, Python/FastAPI, or similar
- User authentication (JWT/Sessions)
- Database (PostgreSQL, MongoDB, etc.)
- Rule management system

**Chrome Extension:**
- Manifest V3 (latest Chrome extension standard)
- Chrome Storage API (local data persistence)
- Content Scripts (website blocking)
- Service Worker (background processing)

---

## Core Features

### 1. User Authentication
- Email and password login system
- Secure credential transmission to backend
- Session management via tokens
- User profile management

### 2. Website Blocking
- Domain-based blocking rules
- Real-time enforcement via content scripts
- Blocking message overlay on restricted sites
- Quick access to challenge completion

### 3. Rules Management (Website)
- Create/edit/delete blocking rules
- Domain-based rule system
- Rule categorization (optional)
- Bulk import/export of rules

### 4. Analytics & Statistics (Website)
- Track blocked sites
- Focus score calculation
- Time saved metrics
- Activity charts and graphs
- Weekly/monthly reports

### 5. Extension Controls
- Simple on/off toggle for blocking
- User login/logout
- Rules sync from website
- Minimal, lightweight interface

---

## File Structure

### Website Files
```
project-root/
├── public/                    # Static assets
│   ├── index.html            # Main landing page
│   ├── dashboard.html        # User dashboard
│   ├── rules.html            # Rules management
│   ├── analytics.html        # Analytics page
│   └── settings.html         # User settings
├── api/                      # Backend API endpoints
│   ├── auth/                 # Authentication routes
│   ├── users/                # User management
│   ├── rules/                # Rules CRUD
│   └── analytics/            # Analytics endpoints
├── styles/                   # Global CSS
├── scripts/                  # JavaScript utilities
└── db/                       # Database schema & migrations
```

### Chrome Extension Files
```
extension/
├── manifest.json             # Extension configuration (Manifest V3)
├── popup.html                # Extension popup interface
├── popup.js                  # Popup logic (login, toggle)
├── popup.css                 # Popup styling
├── background.js             # Service worker (Manifest V3)
├── content.js                # Content script (website blocking)
├── icons/                    # Extension icons
│   ├── icon-16.png          # Toolbar icon
│   ├── icon-48.png          # Menu icon
│   └── icon-128.png         # Store listing icon
└── README.md                 # Extension documentation
```

---

## How It Works

### User Journey

#### 1. Installation
1. User downloads Chrome Extension
2. Extension installed in Chrome
3. Shows lightweight popup with login screen

#### 2. Login & Sync
1. User enters email and password
2. Extension sends credentials to MindGuard API
3. API validates and returns user data + rules
4. Rules stored in Chrome's local storage
5. Extension shows dashboard with blocking toggle

#### 3. Blocking
1. User navigates to blocked website
2. Content script checks domain against rules
3. If blocked + blocking enabled:
   - Shows overlay message
   - Blocks page content
   - Asks user to complete challenge
4. User can toggle blocking on/off from popup

#### 4. Management
1. User visits MindGuard website
2. Logs in to dashboard
3. Manages rules (add, edit, delete)
4. Views analytics and statistics
5. Extension automatically syncs when user logs in

---

## Data Storage

### Extension Local Storage (Chrome)
```javascript
{
  user: {
    id: "user-123",
    name: "John Doe",
    email: "john@example.com",
    token: "jwt-token-here"
  },
  rules: [
    {
      id: "rule-1",
      domain: "youtube.com",
      action: "block"
    }
  ],
  blockingEnabled: true
}
```

### Website Database
- User accounts with hashed passwords
- User rules and preferences
- Activity logs and analytics
- Settings and configurations

---

## API Integration Points

### Login Endpoint
```
POST /api/auth/login
Body: { email, password }
Response: { userId, name, email, token, rules }
```

### Sync Rules Endpoint
```
GET /api/rules
Headers: { Authorization: Bearer <token> }
Response: { rules: [...] }
```

### Analytics Endpoint
```
GET /api/analytics
Headers: { Authorization: Bearer <token> }
Response: { stats, charts, insights }
```

---

## Key Design Decisions

### 1. Lightweight Extension
**Why:** Extensions that are lightweight perform better and have less overhead.
- Only handles login and blocking
- No complex UI in extension
- All management on website
- Minimal storage usage

### 2. Manifest V3
**Why:** Latest Chrome extension standard with better security and performance.
- Service workers instead of background pages
- Cleaner permission model
- Better performance
- Future-proof

### 3. Separation of Concerns
**Why:** Website and extension have distinct responsibilities.
- Website: Complex features, analytics, user management
- Extension: Simple blocking enforcement
- Easier to maintain and scale
- Clear API boundaries

### 4. Chrome Storage API
**Why:** Provides fast, local data persistence without backend dependency.
- Rules cached locally
- No network calls for blocking
- User data persisted offline
- Privacy-first approach

---

## Security Considerations

### Authentication
- Passwords transmitted over HTTPS only
- JWT tokens for session management
- Token expiration and refresh mechanisms
- Secure password hashing (bcrypt/argon2)

### Extension Security
- No sensitive data stored in local storage
- Only JWT tokens and non-sensitive rule data
- Content Security Policy compliance
- No eval() or dynamic script execution

### API Security
- HTTPS required for all API calls
- CORS headers properly configured
- Input validation on all endpoints
- Rate limiting on authentication

---

## Installation & Setup

### For End Users
1. Install extension from Chrome Web Store
2. Click MindGuard icon in toolbar
3. Login with email and password
4. Rules automatically synced from website
5. Toggle blocking on/off as needed

### For Developers

**Setup Extension (Development)**
```bash
1. Clone project repository
2. Open chrome://extensions/
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select extension/ folder
6. Extension installed and ready to test
```

**Setup Website (Development)**
```bash
1. Clone project repository
2. npm install (or pip install for Python)
3. Configure environment variables
4. npm run dev (or python app.py)
5. Visit http://localhost:3000
6. Create account and test
```

---

## Testing Checklist

### Extension Testing
- [ ] Login with valid credentials
- [ ] Login with invalid credentials shows error
- [ ] Rules appear after login
- [ ] Blocking toggle works
- [ ] Block/unblock toggles website visibility
- [ ] Logout clears stored data
- [ ] Extension works after browser restart

### Website Testing
- [ ] User registration works
- [ ] Login/logout functions
- [ ] Add rule saves to database
- [ ] Delete rule removes from database
- [ ] Edit rule updates correctly
- [ ] Analytics page loads data
- [ ] Rules sync to extension on login

### Integration Testing
- [ ] Login on website, rules appear in extension
- [ ] Add rule on website, extension blocks immediately
- [ ] Delete rule on website, extension stops blocking
- [ ] Toggle in extension, blocking status changes
- [ ] Multiple devices maintain separate rule sets

---

## Future Enhancements

### Short Term (v2.0)
- Challenge system (breathing, quiz, typing exercises)
- Focus time scheduling
- Whitelist functionality (allow specific sites)
- Export/import rules

### Medium Term (v3.0)
- AI-powered focus recommendations
- Team/family blocking management
- Custom blocking messages
- Mobile app integration

### Long Term (v4.0)
- Browser sync across devices
- Collaborative focus sessions
- Advanced analytics with AI insights
- Integration with productivity tools

---

## Metrics & Performance

### Extension Performance
- Popup load time: <100ms
- Blocking detection: <50ms
- Memory usage: <5MB
- Storage usage: <1MB

### Website Performance
- Dashboard load: <2s
- API response: <500ms
- Database query: <100ms

---

## Support & Documentation

### User Documentation
- [Website Help Center](#)
- [Extension Quick Start Guide](#)
- [FAQ](#)

### Developer Documentation
- [API Reference](#)
- [Extension Development Guide](#)
- [Architecture Documentation](#)

---

## Conclusion

MindGuard is a well-architected productivity tool that combines a powerful web platform with a lightweight, efficient Chrome Extension. The clear separation between website (complex features) and extension (simple enforcement) makes the system maintainable, scalable, and performant.

The project demonstrates best practices in:
- Chrome Extension development (Manifest V3)
- API design and integration
- User authentication and security
- Database design for productivity apps
- Cross-platform synchronization

With proper API integration and deployment, MindGuard can help thousands of users stay focused and productive while maintaining clean, maintainable code architecture.

---

**Project Status:** Development Ready
**Last Updated:** 2026-03-31
**Version:** 2.0 (Lightweight Architecture)
