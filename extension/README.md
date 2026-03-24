# MindGuard - Chrome Extension

A fully functional Chrome Extension that blocks distracting websites instantly. No login required - works out-of-the-box with a Guest User profile.

## Features Implemented

✅ **Complete Chrome Extension Structure (Manifest V3)**
- `manifest.json` - Extension configuration with all required permissions
- Service worker (`background.js`) for background operations
- Content script injection (`content.js`) for website blocking
- Popup dashboard for quick stats and control
- Options page for comprehensive settings

✅ **Instant Setup - No Login Required**
- Works immediately after installation
- Default Guest User profile automatically created
- All data stored locally using Chrome's storage API
- Privacy-first approach with zero backend dependencies

✅ **Core Blocking System**
- Dynamic rule management (add/remove/block rules)
- Popular sites quick-add feature
- Real-time website blocking with custom overlay
- Smart domain matching for blocking

✅ **Dashboard & Stats**
- Focus Score tracking
- Blocked sites counter
- Completed challenges counter
- Time saved calculation
- Daily activity log
- Motivation quotes rotation

✅ **Settings & Preferences**
- Focus hours configuration
- Strict mode toggle
- Weekend mode
- Notification settings
- Theme preferences
- Language selection
- Country/location settings

✅ **Analytics**
- Weekly activity trends
- Success rate visualization
- Top blocked sites ranking
- Charts using Chart.js
- Productivity insights

✅ **Challenges**
- Breathing exercises
- Quizzes
- Typing tests
- Riddles

✅ **UI Components**
- Modern gradient design
- Responsive layouts
- Smooth animations
- Toggle switches
- Form validation
- Toast notifications
- Empty states

## File Structure

```
extension/
├── manifest.json              # Extension metadata (V3)
├── popup.html                 # Quick dashboard popup
├── popup.css                  # Popup styles
├── popup.js                   # Popup functionality
├── options.html               # Full settings page
├── options.css                # Settings styles
├── options.js                 # Settings functionality
├── background.js              # Service worker
├── content.js                 # Content script for blocking
├── blocked.html               # Blocked site page
├── analytics.html             # Analytics dashboard
├── icons/                     # Icon assets
│   ├── icon-16.png
│   ├── icon-48.png
│   └── icon-128.png
├── README.md                  # This file
├── INSTALLATION_GUIDE.md      # Installation instructions
└── QUICK_START.md             # Quick start guide
```

## Installation

### Quick Install (Development/Testing)

1. **Clone or extract the extension files**
   - Ensure all files are in the `/extension/` folder

2. **Open Chrome Extensions Page**
   - Type `chrome://extensions/` in the address bar
   - Or go to Menu → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load Unpacked Extension**
   - Click "Load unpacked"
   - Select the `/extension/` folder
   - The extension should now appear in your extensions list

5. **Pin the Extension**
   - Click the puzzle icon in the toolbar
   - Find "MindGuard" and click the pin icon to add to toolbar

### First Launch

**The extension works instantly!** 

- Click the MindGuard icon in your toolbar
- You'll see your dashboard with a default "Guest User" profile
- All data is stored locally - no login or registration needed
- Start adding rules and blocking distracting sites immediately

## How to Use

### Quick Blocking

1. **Click the MindGuard icon** in your toolbar
2. **View your dashboard** with focus stats
3. **Toggle blocking on/off** with the switch
4. **View today's activity**

### Manage Rules

1. **Click ⚙️ Settings** button in the popup
2. **Go to Rules tab**
3. **Add rules manually** by entering domain names
4. **Quick-add popular sites** (YouTube, Instagram, Facebook, etc.)
5. **Delete rules** as needed

### Configure Settings

1. **Click ⚙️ Settings** in the popup
2. **Set your focus hours** (e.g., 9 AM - 5 PM)
3. **Enable/disable**:
   - Strict Mode (24/7 blocking)
   - Weekend Mode (softer rules)
   - Notifications
4. **Save settings**

### View Analytics

1. **Click the popup ⚙️ button**
2. **Go to Analytics tab**
3. **View**:
   - Focus score and stats
   - Weekly activity trends
   - Most blocked sites
   - Success rate

### Handle Blocked Sites

When you try to access a blocked site:

1. **See the blocking page** with the domain name
2. **Complete a challenge** to unlock:
   - 🧘 Breathing exercise
   - 🧠 Quiz
   - ⌨️ Typing test
   - 🔮 Riddle
3. **Get 5-minute access** after completing challenge
4. **Or manage rules** to remove the site from blocklist

## Storage Architecture

The extension uses Chrome's `chrome.storage.local` API to persist all data locally on your device:

```javascript
{
  user: {
    id: "guest-user",
    name: "Guest User",
    email: "guest@mindguard.local",
    role: "user",
    joinDate: "ISO timestamp"
  },
  rules: [
    { id, domain, action: "block"|"allow", createdAt }
  ],
  stats: {
    focusScore: number,
    blockedCount: number,
    completedCount: number,
    timeSaved: number
  },
  activity: [
    { site, action, timestamp }
  ],
  settings: {
    blockingEnabled: boolean,
    strictMode: boolean,
    weekendMode: boolean,
    notifications: boolean,
    focusStart: "HH:MM",
    focusEnd: "HH:MM",
    theme: "light"
  }
}
```

**Privacy Note:** All data stays on your device. No data is sent to any server or cloud service.

## Permissions Explained

- **`storage`** - Save user data, rules, and settings
- **`tabs`** - Monitor and control browser tabs
- **`activeTab`** - Access current tab information
- **`scripting`** - Inject content scripts
- **`declarativeNetRequest`** - Block/redirect websites
- **`notifications`** - Show system notifications
- **`<all_urls>`** - Access all websites for blocking

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with gradients and animations
- **Vanilla JavaScript** - No frameworks, pure ES6+
- **Chrome APIs** - Storage, runtime, tabs, notifications
- **Chart.js** - Data visualization
- **Local Storage** - Persisting user data

## Browser Compatibility

- **Chrome**: 90+
- **Edge**: 90+ (Chromium-based)
- **Brave**: All versions
- **Other Chromium browsers**: May work

## Customization

### Change Colors

Edit the `:root` variables in CSS files:

```css
:root {
    --primary: #667eea;
    --secondary: #764ba2;
    --success: #4ade80;
    --danger: #f87171;
}
```

### Add More Challenge Types

Edit `background.js` and `blocked.html` to add new challenge types in the arrays.

### Modify Popular Sites List

In `options.js`, edit the `popularSites` array:

```javascript
const popularSites = [
    'youtube.com', 'instagram.com', 'facebook.com',
    // Add more sites here
];
```

### Change Block Duration

In `blocked.html`, modify the timer duration:

```javascript
let timeRemaining = 300; // 5 minutes in seconds
```

## Known Limitations

1. **No cloud sync** - Data stays local to this device (by design for privacy)
2. **No multi-device sync** - Each device maintains its own separate blocklist
3. **Simple blocking** - Uses content script (not declarativeNetRequest API yet)
4. **No AI features** - Microtasks are static (can integrate AI APIs)
5. **Manual data backup** - No automatic backup system (can export/import later)

## Future Enhancements

- [ ] Integration with AI APIs for smart site detection
- [ ] Real-time productivity analytics dashboard
- [ ] Team/family management
- [ ] Cloud backup and sync
- [ ] Advanced challenge types
- [ ] Custom challenge creation
- [ ] Pomodoro timer integration
- [ ] Browser sync across devices
- [ ] Advanced reporting and insights
- [ ] Integration with calendar for focus hours

## Troubleshooting

### Extension not blocking sites?

1. Check that blocking is enabled in the popup
2. Verify the rule is added correctly
3. Hard refresh the page (`Ctrl+Shift+R`)
4. Check browser console for errors (`Ctrl+Shift+J`)

### Settings not saving?

1. Check Chrome's storage permissions in Settings
2. Clear browser cache and try again
3. Check if storage quota is exceeded

### Popup not opening?

1. Verify extension is enabled in `chrome://extensions/`
2. Try unpinning and repinning the extension
3. Reload the extension (click refresh icon in extensions page)

### Need to generate icons?

Replace the placeholder `icons/icon-16.png`, `icon-48.png`, and `icon-128.png` with actual images. You can use any image editor or icon generator.

## Development Notes

### To modify the extension:

1. Edit the files you need to change
2. Go to `chrome://extensions/`
3. Click the "Reload" button for MindGuard
4. Test the changes in your browser

### To debug:

1. **Popup errors:** Right-click popup → "Inspect"
2. **Service worker errors:** Click "Service Worker" link in extensions page
3. **Content script errors:** Open page → `Ctrl+Shift+J` → Check console

## License

This extension is provided as-is for educational and personal use.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Verify all files are present in the extension folder
3. Check the browser console for error messages
4. Ensure you're using a Chromium-based browser (Chrome, Edge, Brave, etc.)

---

**MindGuard** - Stay focused, stay productive! 🛡️
