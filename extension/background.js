// Lightweight Service Worker - MindGuard Extension
// Handles blocking logic using rules synced from the website

// Initialize on install
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        blockingEnabled: true,
        rules: [],
        user: null
    });
});

// Listen for messages from popup and content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('[v0] Background message:', request.action);
    
    if (request.action === 'blockingToggled') {
        // Update blocking state in all content scripts
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach((tab) => {
                chrome.tabs.sendMessage(tab.id, {
                    action: 'updateBlockingState',
                    enabled: request.enabled
                }).catch(() => {
                    // Tab might not have content script loaded
                });
            });
        });
        sendResponse({ success: true });
        return true;
    }
    
    if (request.action === 'getRules') {
        chrome.storage.local.get(['rules', 'blockingEnabled'], (result) => {
            sendResponse({
                rules: result.rules || [],
                enabled: result.blockingEnabled !== false
            });
        });
        return true;
    }
    
    if (request.action === 'recordBlockedSite') {
        // Track that a site was blocked (for future analytics)
        chrome.storage.local.get(['activity'], (result) => {
            const activity = result.activity || [];
            activity.push({
                domain: request.domain,
                timestamp: new Date().toISOString(),
                action: 'blocked'
            });
            // Keep only last 100 entries
            if (activity.length > 100) {
                activity.shift();
            }
            chrome.storage.local.set({ activity });
        });
        sendResponse({ success: true });
        return true;
    }
});

// Optional: Sync rules from website when user logs in (popup.js will trigger)
// Rules sync is initiated from popup.js when user logs in via API
// No need for periodic sync - happens on demand from popup

// Function to check if URL matches any blocking rule
function shouldBlockUrl(url, rules) {
    try {
        const domain = new URL(url).hostname;
        return rules.some(rule => {
            // Match domain, including subdomains
            if (rule.domain === domain || domain.endsWith('.' + rule.domain)) {
                return rule.action === 'block';
            }
            return false;
        });
    } catch (e) {
        return false;
    }
}
