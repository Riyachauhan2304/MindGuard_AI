# MindGuard Extension - Lightweight Architecture

## Overview

This is a **lightweight, minimal extension** that works in tandem with the main MindGuard website. The extension handles ONLY:

- User login (syncs with website account)
- Blocking toggle (turns blocking on/off)
- Website blocking enforcement

All complex features are kept on the **main website**:
- Rules management
- Analytics & statistics
- Settings & preferences
- User dashboard

---

## Architecture

### Extension Components

```
popup.html      → Login screen + Blocking toggle UI
popup.js        → Login, logout, toggle logic
background.js   → Message handling, rules sync
content.js      → Website blocking enforcement
manifest.json   → Extension configuration
```

### Data Flow

```
Website (Primary System)
    ↓
User logs in, creates rules
    ↓
Extension fetches rules after login
    ↓
content.js blocks sites based on rules
    ↓
Toggle controls blocking on/off
```

---

## File Structure

```
extension/
├── manifest.json              # Manifest V3 config
├── popup.html                 # Simple login + toggle UI
├── popup.js                   # Login, logout, toggle logic
├── background.js              # Service worker
├── content.js                 # Website blocking
├── icons/                     # Extension icons
│   ├── icon-16.png
│   ├── icon-48.png
│   └── icon-128.png
└── LIGHTWEIGHT_ARCHITECTURE.md
```

---

## Features Removed

The following were **deleted** because they belong on the website:

- ❌ `options.html` - Settings page (use website)
- ❌ `analytics.html` - Analytics (use website)
- ❌ `blocked.html` - Blocking page (now shows minimal overlay)
- ❌ Dashboard with stats
- ❌ Rule management UI
- ❌ Settings management UI
- ❌ Analytics dashboard

---

## Features Remaining

The extension now only includes:

- ✅ **Login Screen** - Email/password login (syncs with website)
- ✅ **Blocking Toggle** - Simple ON/OFF switch
- ✅ **User Info** - Shows logged-in user
- ✅ **Logout** - Clear session from extension
- ✅ **Website Blocking** - Blocks sites based on synced rules

---

## How It Works

### 1. Installation

1. User installs extension
2. Popup shows login screen by default

### 2. Login

1. User enters email/password
2. Extension sends to MindGuard API (mock endpoint shown)
3. On success:
   - User object stored in `chrome.storage.local`
   - Rules fetched and cached
   - Dashboard replaces login screen

### 3. Blocking

1. User visits a blocked site
2. `content.js` checks `chrome.storage.local` for rules
3. If site matches and blocking is enabled:
   - Shows blocking overlay
   - Prevents page load
4. User can toggle blocking from popup

### 4. Rule Updates

Rules are synced from the website:
- **Auto-sync**: Every hour (if user is logged in)
- **Manual**: User logs out and back in
- User should manage rules on the **website**, not extension

---

## API Integration Points

Replace these with your actual MindGuard backend:

### 1. Login Endpoint
```javascript
// In popup.js - handleLogin()
POST https://your-mindguard-api.com/api/auth/login
{
  email: "user@example.com",
  password: "password"
}

Response:
{
  userId: "123",
  name: "John Doe",
  email: "user@example.com",
  rules: [...]
}
```

### 2. Rules Sync Endpoint
```javascript
// In background.js - syncRulesFromWebsite()
GET https://your-mindguard-api.com/api/rules
Headers: Authorization: Bearer {token}

Response:
{
  rules: [
    { domain: "youtube.com", action: "block" },
    { domain: "reddit.com", action: "block" }
  ]
}
```

---

## Storage Structure

All data stored in `chrome.storage.local`:

```javascript
{
  user: {
    id: "123",
    name: "John Doe",
    email: "user@example.com"
    // Note: DO NOT store passwords in local storage!
  },
  rules: [
    { domain: "youtube.com", action: "block" },
    { domain: "instagram.com", action: "block" }
  ],
  blockingEnabled: true,
  activity: [
    // Optional: track blocked attempts
  ]
}
```

---

## Development Checklist

### Before Release

- [ ] Replace mock API endpoints with real ones
- [ ] Add proper error handling
- [ ] Add loading states
- [ ] Test login flow
- [ ] Test blocking on multiple sites
- [ ] Test toggle functionality
- [ ] Verify no data leaks
- [ ] Test logout

### Optional Enhancements

- Add token refresh logic
- Add notification when blocking a site
- Add sync status indicator
- Add "open website" button
- Add keyboard shortcut to toggle
- Add site-specific allow/block quick actions

---

## Testing

### Manual Testing

1. **Login Test**
   - Open extension popup
   - Enter email/password
   - Should see dashboard with user info

2. **Blocking Test**
   - Add rule on website: `youtube.com`
   - Visit youtube.com
   - Should see blocking overlay

3. **Toggle Test**
   - Click blocking toggle to turn OFF
   - Visit blocked site - should load normally
   - Toggle back ON
   - Visit blocked site - should block

4. **Logout Test**
   - Click logout
   - Should return to login screen

---

## Key Differences from Original

| Feature | Original | New (Lightweight) |
|---------|----------|-------------------|
| Rules Management | Built-in | Website only |
| Analytics | Built-in | Website only |
| Settings | Built-in | Website only |
| Login | Yes | Yes |
| Blocking | Yes | Yes |
| Size | ~500KB | ~50KB |
| Complexity | High | Low |
| Load Time | Slow | Fast |

---

## Troubleshooting

### Extension icon not showing
- Reload extension from `chrome://extensions/`
- Check if icons folder exists with 3 PNG files

### Blocking not working
- Check rules are synced (look in DevTools Storage)
- Verify blocking is toggled ON
- Hard refresh site: `Ctrl+Shift+R`

### Login fails
- Check API endpoint is correct
- Verify credentials
- Check DevTools console for errors

### Rules not updating
- Manual way: logout and login again
- Check API response has rules
- Verify rules have `domain` and `action` fields

---

## Security Notes

1. **Never store passwords** - Use session tokens instead
2. **Use HTTPS** - Always encrypt API calls
3. **Store tokens securely** - Use `chrome.storage.sync` for sensitive data
4. **Validate rules** - Check rule format before blocking
5. **Escape user input** - In blocking overlay messages

---

## Next Steps

1. **Integrate with website backend** - Replace mock API calls
2. **Add token management** - Handle auth tokens properly
3. **Test thoroughly** - Especially blocking logic
4. **Deploy extension** - Submit to Chrome Web Store
5. **Monitor usage** - Track extension performance

---

## FAQ

**Q: Can I manage rules in the extension?**
A: No, rules are managed on the website. The extension only enforces them.

**Q: Does this work offline?**
A: Rules must be synced first, then it works offline until you sync again.

**Q: Where is my data stored?**
A: Locally in `chrome.storage.local`. Not sent to any server except during login.

**Q: Can I use this without the website?**
A: No, you must register and manage rules on the website first.

**Q: How often are rules updated?**
A: Every 60 minutes automatically, or when you logout/login.

---

Generated: 2026-03-30
Version: 2.0 (Lightweight)
