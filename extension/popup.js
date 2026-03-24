// Get user data from chrome storage
chrome.storage.local.get(['user', 'stats', 'activity', 'settings'], (result) => {
    if (!result.user) {
        window.location.href = 'login.html';
        return;
    }
    
    loadDashboard(result);
});

function loadDashboard(data) {
    const user = data.user || {};
    const stats = data.stats || {
        focusScore: 0,
        blockedCount: 0,
        completedCount: 0,
        timeSaved: 0
    };
    const activity = data.activity || [];

    // Update user info
    document.getElementById('userName').textContent = `Welcome, ${user.name || 'User'}!`;
    document.getElementById('userAvatar').textContent = (user.name || 'U').charAt(0).toUpperCase();
    document.getElementById('userStatus').textContent = `Session: ${new Date().toLocaleString()}`;

    // Update stats
    document.getElementById('focusScore').textContent = stats.focusScore || 0;
    document.getElementById('blockedCount').textContent = stats.blockedCount || 0;
    document.getElementById('completedCount').textContent = stats.completedCount || 0;
    document.getElementById('timeSaved').textContent = stats.timeSaved || 0;

    // Update motivation
    const motivations = [
        "Focus is the gateway to productivity.",
        "Every distraction blocked is a victory won.",
        "Your future self will thank you for staying focused today.",
        "Success is the sum of small efforts repeated day in and day out.",
        "The secret of change is to focus all your energy on building the new."
    ];
    const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)];
    document.getElementById('motivationText').textContent = `"${randomMotivation}"`;

    // Update activity
    updateActivityList(activity);

    // Set blocking toggle state
    const settings = data.settings || { blockingEnabled: true };
    document.getElementById('blockingToggle').checked = settings.blockingEnabled !== false;
    updateBlockingStatus(settings.blockingEnabled !== false);
}

function updateActivityList(activity) {
    const listContainer = document.getElementById('activityList');
    
    if (!activity || activity.length === 0) {
        listContainer.innerHTML = '<div class="empty-state">No activity yet today</div>';
        return;
    }

    const recentActivity = activity.slice(-5).reverse();
    listContainer.innerHTML = recentActivity.map(item => `
        <div class="activity-item">
            <span class="activity-site">${item.site || 'Unknown'}</span>
            <span class="activity-time">${new Date(item.timestamp).toLocaleTimeString()}</span>
        </div>
    `).join('');
}

document.getElementById('blockingToggle').addEventListener('change', (e) => {
    const enabled = e.target.checked;
    updateBlockingStatus(enabled);
    
    chrome.storage.local.get(['settings'], (result) => {
        const settings = result.settings || {};
        settings.blockingEnabled = enabled;
        chrome.storage.local.set({ settings });
    });

    chrome.runtime.sendMessage({ action: 'toggleBlocking', enabled });
});

function updateBlockingStatus(enabled) {
    const statusText = document.getElementById('statusText');
    if (enabled) {
        statusText.textContent = '✅ Actively Blocking';
        statusText.style.color = '#4ade80';
    } else {
        statusText.textContent = '⏸️ Blocking Paused';
        statusText.style.color = '#fbbf24';
    }
}

function openSettings() {
    chrome.runtime.openOptionsPage();
}

function openRules() {
    chrome.runtime.openOptionsPage();
    window.close();
}

function openAnalytics() {
    // Open analytics in a new tab
    chrome.tabs.create({ url: chrome.runtime.getURL('analytics.html') });
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        chrome.storage.local.remove(['user', 'stats', 'activity'], () => {
            chrome.tabs.create({ url: chrome.runtime.getURL('login.html') });
            window.close();
        });
    }
}
