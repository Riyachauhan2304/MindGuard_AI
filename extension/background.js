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

// Optional: Sync rules from website every hour (when user is logged in)
chrome.alarms.create('syncRules', { periodInMinutes: 60 });

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'syncRules') {
        syncRulesFromWebsite();
    }
});

async function syncRulesFromWebsite() {
    try {
        chrome.storage.local.get(['user'], async (result) => {
            if (!result.user || !result.user.email) {
                return; // User not logged in
            }
            
            // TODO: Fetch rules from your MindGuard backend API
            // const response = await fetch('https://your-mindguard-api.com/api/rules', {
            //     headers: { 'Authorization': `Bearer ${result.user.token}` }
            // });
            // const data = await response.json();
            // chrome.storage.local.set({ rules: data.rules });
            
            console.log('[v0] Rules sync completed (mock)');
        });
    } catch (error) {
        console.log('[v0] Error syncing rules:', error);
    }
}

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
