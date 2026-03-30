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

        // Show notification if enabled (optional feature)
        // chrome.storage.local.get(['settings'], (result) => {
        //     const settings = result.settings || {};
        //     if (settings.notifications) {
        //         showBlockedNotification(domain);
        //     }
        // });
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

        // Show success notification (optional feature)
        // showSuccessNotification(site);
    });
}

// Show notification when site is blocked
function showBlockedNotification(domain) {
    try {
        const notificationId = 'blocked-' + Date.now();
        if (chrome && chrome.notifications && chrome.notifications.create) {
            chrome.notifications.create(notificationId, {
                type: 'basic',
                iconUrl: chrome.runtime.getURL('icons/icon-128.png'),
                title: 'Site Blocked',
                message: domain + ' is blocked. Complete a challenge to unlock it!',
                priority: 2
            }, (id) => {
                if (chrome.runtime.lastError) {
                    console.log('[v0] Notification error:', chrome.runtime.lastError);
                }
            });
        }
    } catch (error) {
        console.log('[v0] Notification error:', error.message);
    }
}

// Show notification for challenge completion
function showSuccessNotification(site) {
    try {
        const notificationId = 'success-' + Date.now();
        if (chrome && chrome.notifications && chrome.notifications.create) {
            chrome.notifications.create(notificationId, {
                type: 'basic',
                iconUrl: chrome.runtime.getURL('icons/icon-128.png'),
                title: 'Challenge Completed!',
                message: 'Great job! You can now access ' + site + '.',
                priority: 2
            }, (id) => {
                if (chrome.runtime.lastError) {
                    console.log('[v0] Notification error:', chrome.runtime.lastError);
                }
            });
        }
    } catch (error) {
        console.log('[v0] Notification error:', error.message);
    }
}

// Note: Website blocking is handled by content.js (Manifest V3 compatible)
// The content script checks rules and shows the blocking overlay on matching sites

// Activity cleanup is optional - can be added with proper Manifest V3 patterns if needed
// For now, activity logs persist until user manually resets data
