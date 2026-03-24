// Service Worker for MindGuard Extension

// Initialize storage on install with default Guest User
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        user: {
            id: 'guest-user',
            name: 'Guest User',
            email: 'guest@mindguard.local',
            role: 'user',
            joinDate: new Date().toISOString()
        },
        rules: [],
        stats: {
            focusScore: 0,
            blockedCount: 0,
            completedCount: 0,
            timeSaved: 0
        },
        activity: [],
        settings: {
            blockingEnabled: true,
            strictMode: true,
            weekendMode: false,
            notifications: true,
            focusStart: '09:00',
            focusEnd: '17:00',
            theme: 'light'
        }
    });
});

// Listen for messages from popup and content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateRules') {
        chrome.storage.local.set({ rules: request.rules }, () => {
            sendResponse({ success: true });
        });
        return true;
    }

    if (request.action === 'updateSettings') {
        chrome.storage.local.set({ settings: request.settings }, () => {
            sendResponse({ success: true });
        });
        return true;
    }

    if (request.action === 'toggleBlocking') {
        chrome.storage.local.get(['settings'], (result) => {
            const settings = result.settings || {};
            settings.blockingEnabled = request.enabled;
            chrome.storage.local.set({ settings });
            sendResponse({ success: true });
        });
        return true;
    }

    if (request.action === 'recordBlockedSite') {
        recordBlockedSite(request.site, request.domain);
        sendResponse({ success: true });
        return true;
    }

    if (request.action === 'completeChallenge') {
        completeChallenge(request.site);
        sendResponse({ success: true });
        return true;
    }
});

// Record blocked site activity
function recordBlockedSite(site, domain) {
    chrome.storage.local.get(['activity', 'stats'], (result) => {
        const activity = result.activity || [];
        const stats = result.stats || {};

        // Add to activity
        activity.push({
            site: domain,
            action: 'blocked',
            timestamp: new Date().toISOString()
        });

        // Update stats
        stats.blockedCount = (stats.blockedCount || 0) + 1;
        stats.timeSaved = (stats.timeSaved || 0) + 5; // Assume 5 minutes saved per block

        chrome.storage.local.set({ activity, stats });

        // Show notification if enabled
        chrome.storage.local.get(['settings'], (result) => {
            const settings = result.settings || {};
            if (settings.notifications) {
                showBlockedNotification(domain);
            }
        });
    });
}

// Record challenge completion
function completeChallenge(site) {
    chrome.storage.local.get(['activity', 'stats'], (result) => {
        const activity = result.activity || [];
        const stats = result.stats || {};

        // Add to activity
        activity.push({
            site,
            action: 'completed',
            timestamp: new Date().toISOString()
        });

        // Update stats
        stats.completedCount = (stats.completedCount || 0) + 1;
        stats.focusScore = (stats.focusScore || 0) + 10;

        chrome.storage.local.set({ activity, stats });

        // Show success notification
        showSuccessNotification(site);
    });
}

// Show notification when site is blocked
function showBlockedNotification(domain) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: chrome.runtime.getURL('icons/icon-128.png'),
        title: '🛡️ Site Blocked',
        message: `${domain} is blocked. Complete a challenge to unlock it!`,
        priority: 2
    });
}

// Show notification for challenge completion
function showSuccessNotification(site) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: chrome.runtime.getURL('icons/icon-128.png'),
        title: '✅ Challenge Completed!',
        message: `Great job! You can now access ${site}.`,
        priority: 2
    });
}

// Handle web request blocking
chrome.webRequest?.onBeforeRequest?.addListener(
    (details) => {
        // Check if URL should be blocked
        const url = new URL(details.url);
        const domain = url.hostname;

        chrome.storage.local.get(['rules', 'settings'], (result) => {
            const rules = result.rules || [];
            const settings = result.settings || {};

            if (!settings.blockingEnabled) {
                return;
            }

            const blockedRule = rules.find(r => 
                r.domain === domain && r.action === 'block'
            );

            if (blockedRule) {
                recordBlockedSite(details.url, domain);
                // Redirect to blocked page
                return { 
                    redirectUrl: chrome.runtime.getURL('blocked.html') + '?url=' + encodeURIComponent(domain)
                };
            }
        });
    },
    { urls: ['<all_urls>'] },
    ['blocking']
);

// Clean up old activity daily
chrome.alarms.create('cleanupActivity', { periodInMinutes: 24 * 60 });

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'cleanupActivity') {
        chrome.storage.local.get(['activity'], (result) => {
            const activity = result.activity || [];
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Keep only today's activity
            const filtered = activity.filter(item => {
                const itemDate = new Date(item.timestamp);
                itemDate.setHours(0, 0, 0, 0);
                return itemDate.getTime() === today.getTime();
            });

            chrome.storage.local.set({ activity: filtered });
        });
    }
});
