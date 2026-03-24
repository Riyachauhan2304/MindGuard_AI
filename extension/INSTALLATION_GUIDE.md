# MindGuard Chrome Extension - Installation Guide

## Step-by-Step Installation

### Prerequisites

- Google Chrome (version 90 or higher)
- Or any Chromium-based browser (Edge, Brave, Vivaldi, etc.)

### Installation Steps

#### 1. Download/Prepare Extension Files

Ensure you have all the required files:

```
extension/
├── manifest.json
├── popup.html
├── popup.js
├── popup.css
├── options.html
├── options.js
├── options.css
├── background.js
├── content.js
├── login.html
├── register.html
├── blocked.html
├── analytics.html
├── icons/
│   ├── icon-16.png
│   ├── icon-48.png
│   └── icon-128.png
└── README.md
```

#### 2. Open Extensions Management Page

**Method 1:** Direct URL
- Type `chrome://extensions/` in the address bar and press Enter

**Method 2:** Via Menu
- Click the Menu button (three dots) in the top-right
- Select **More tools**
- Click **Extensions**

#### 3. Enable Developer Mode

Look for the **Developer mode** toggle in the top-right corner of the extensions page and **turn it ON**.

![Developer Mode Toggle Location]

#### 4. Load Unpacked Extension

- Click the **Load unpacked** button (appears after enabling Developer Mode)
- Navigate to the folder containing all extension files
- Select the **extension/** folder
- Click **Select Folder**

#### 5. Confirm Installation

The MindGuard extension should now appear in your extensions list with:
- Extension icon
- Name: "MindGuard - AI Focus Firewall"
- Version: 1.0.0
- Status: Enabled

#### 6. Pin Extension (Optional but Recommended)

- Click the **Puzzle icon** in the top-right toolbar
- Find **MindGuard** in the list
- Click the **Pin icon** next to it
- The MindGuard icon will now always be visible in your toolbar

## First Time Setup

### 1. Open the Extension

Click the **MindGuard icon** in your toolbar (or find it in the extensions menu).

### 2. Choose Login Method

You'll see the login page with three options:

**Option A: Demo Login** (Recommended for Testing)
- Click **"Demo Login"** button
- Credentials auto-filled (demo@mindguard.com / demo123)
- You'll be logged in instantly

**Option B: Create New Account**
1. Click **"Create one"** link
2. Fill in your details:
   - Full Name
   - Email Address
   - Password (minimum 6 characters)
   - Confirm Password
3. Accept Terms
4. Click **"Create Account"**

**Option C: Use Existing Account**
- If you already have a MindGuard account
- Enter email and password
- Click **"Sign In"**

### 3. Grant Permissions

Chrome will ask for permissions confirmation:
- **Storage** - To save your rules and settings
- **Tabs** - To monitor blocked websites
- **Notifications** - To alert you when sites are blocked

Click **Allow** for all permissions.

## Adding Your First Rules

### Method 1: Manual Add

1. Click the MindGuard icon in the toolbar
2. Click **⚙️ Settings** button
3. Go to **Rules** tab
4. Enter a domain (e.g., `youtube.com`)
5. Select **Block** action
6. Click **Add Rule**

### Method 2: Quick Add

1. Open the Settings page
2. Go to **Rules** tab
3. Scroll to **Quick Add Popular Sites**
4. Click any site button to instantly block it

## Testing the Extension

### Test Blocking

1. Add a rule for any website (e.g., `reddit.com`)
2. Visit that website in a new tab
3. You should see the MindGuard blocking page

### Test Settings

1. Open Settings (click ⚙️)
2. Try enabling/disabling different options
3. Click **"Save Settings"**
4. Close and reopen Settings to verify changes were saved

### Test Analytics

1. Visit a few blocked sites to generate activity
2. Go to Settings → **Analytics** tab
3. You should see stats and charts updating

## Troubleshooting Installation

### Extension Not Showing in Toolbar

**Solution:**
1. Go to `chrome://extensions/`
2. Find MindGuard in the list
3. Click the **Pin icon** to add to toolbar
4. If not visible, check if Chrome is in full-screen mode

### "Failed to Load Extension" Error

**Solutions:**
1. Verify all files are in the correct folder
2. Check that `manifest.json` is in the root directory
3. Ensure file permissions are correct
4. Try reloading: `chrome://extensions/` → Click reload for MindGuard

### Login Page Shows Blank

**Solutions:**
1. Hard refresh: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
2. Clear browser cache: Settings → Privacy → Clear browsing data
3. Disable other extensions temporarily
4. Restart Chrome

### Settings/Rules Not Saving

**Solutions:**
1. Check storage permission: `chrome://extensions/` → MindGuard → Details
2. Ensure you've granted all permissions
3. Check if browser is in Incognito mode (storage doesn't persist)
4. Restart Chrome and try again

### Popup Not Opening

**Solutions:**
1. Verify extension is enabled in `chrome://extensions/`
2. Click the reload button for MindGuard
3. Restart Chrome
4. Try right-clicking the icon → "Open in a new window"

## Upgrading/Reinstalling

### To Update the Extension

1. Replace the modified files in your extension folder
2. Go to `chrome://extensions/`
3. Click the **Reload** button next to MindGuard
4. Changes should be applied immediately

### To Completely Reinstall

1. Go to `chrome://extensions/`
2. Click **Remove** on MindGuard
3. Confirm removal
4. Follow the Installation Steps above again

## Uninstalling

1. Go to `chrome://extensions/`
2. Find **MindGuard - AI Focus Firewall**
3. Click the **Remove** button
4. Confirm removal

This will delete the extension and all its data.

## Getting Help

### Check These First

- [ ] All files are in the extension folder
- [ ] Developer mode is enabled
- [ ] Extension is loaded and enabled
- [ ] Permissions are granted
- [ ] Browser is updated to latest version

### Debug Information

To help troubleshoot, check:

1. **Service Worker Console:**
   - Go to `chrome://extensions/`
   - Click "Service Worker" link for MindGuard

2. **Popup Console:**
   - Right-click MindGuard icon → Inspect
   - Check the Console tab for errors

3. **Content Script Errors:**
   - Open any website
   - Press `Ctrl+Shift+J` (or `Cmd+Option+J` on Mac)
   - Look for `[MindGuard]` messages

### Common Error Messages

| Error | Solution |
|-------|----------|
| "Cannot load extension" | Check manifest.json syntax |
| "Failed to execute script" | Ensure content.js exists |
| "Storage not available" | Browser may be in Incognito mode |
| "Rules not saving" | Check storage permissions |
| "Popup won't open" | Reload extension in chrome://extensions/ |

## Performance Tips

- The extension uses minimal RAM (typically 10-20 MB)
- Only blocks specified domains for optimal performance
- Rules are checked in real-time with no noticeable lag
- Storage data is efficiently managed

## Privacy & Security

- All data is stored locally on your computer
- No data is sent to any server
- No tracking or analytics outside the extension
- You have full control over all data
- You can clear all data anytime in Settings

## Next Steps

After installation:

1. ✅ Add rules for sites you want to block
2. ✅ Configure your focus hours
3. ✅ Enable notifications for alerts
4. ✅ Check analytics to track your progress
5. ✅ Customize settings to your preference

---

**Installation Complete!** 🎉

Your MindGuard Chrome Extension is now ready to help you stay focused and productive.

For more information, see the [README.md](README.md).
