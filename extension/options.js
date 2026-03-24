// Tab Navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const tabName = e.target.getAttribute('data-tab');
        switchTab(tabName);
    });
});

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');

    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        }
    });

    // Load tab-specific data
    if (tabName === 'analytics') {
        loadAnalytics();
    } else if (tabName === 'profile') {
        loadProfile();
    }
}

// Load initial data (auto-initialize with Guest User if needed)
chrome.storage.local.get(['user', 'rules', 'stats'], (result) => {
    // Ensure user profile exists, create Guest User if not
    if (!result.user) {
        const defaultUser = {
            id: 'guest-user',
            name: 'Guest User',
            email: 'guest@mindguard.local',
            role: 'user',
            joinDate: new Date().toISOString()
        };
        chrome.storage.local.set({ user: defaultUser }, () => {
            loadRules(result.rules || []);
            loadSettings();
            renderQuickAdd(result.rules || []);
        });
    } else {
        loadRules(result.rules || []);
        loadSettings();
        renderQuickAdd(result.rules || []);
    }
});

// Rules Management
const popularSites = [
    'youtube.com', 'instagram.com', 'facebook.com', 'twitter.com',
    'reddit.com', 'tiktok.com', 'netflix.com', 'twitch.tv',
    'pinterest.com', 'linkedin.com', 'snapchat.com', 'discord.com'
];

document.getElementById('addRuleForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const domain = document.getElementById('domain').value.trim();
    const action = document.getElementById('action').value;

    chrome.storage.local.get(['rules'], (result) => {
        const rules = result.rules || [];

        if (rules.some(r => r.domain === domain)) {
            showToast('Rule already exists!');
            return;
        }

        const newRule = {
            id: Date.now().toString(),
            domain,
            action,
            createdAt: new Date().toISOString()
        };

        rules.push(newRule);
        chrome.storage.local.set({ rules }, () => {
            loadRules(rules);
            renderQuickAdd(rules);
            document.getElementById('addRuleForm').reset();
            showToast('Rule added successfully!');
            
            // Notify background script
            chrome.runtime.sendMessage({ action: 'updateRules', rules });
        });
    });
});

function loadRules(rules) {
    const container = document.getElementById('rulesList');
    document.getElementById('rulesCount').textContent = rules.length;

    if (rules.length === 0) {
        container.innerHTML = '<div class="empty-state">No rules added yet</div>';
        return;
    }

    container.innerHTML = rules.map(rule => `
        <div class="rule-item">
            <div>
                <span class="rule-domain">${rule.domain}</span>
                <span class="rule-badge badge-${rule.action}">
                    ${rule.action === 'block' ? '🚫 Block' : '✅ Allow'}
                </span>
            </div>
            <button class="btn-delete" onclick="deleteRule('${rule.id}')">🗑️ Delete</button>
        </div>
    `).join('');
}

function deleteRule(ruleId) {
    if (!confirm('Delete this rule?')) return;

    chrome.storage.local.get(['rules'], (result) => {
        const rules = (result.rules || []).filter(r => r.id !== ruleId);
        chrome.storage.local.set({ rules }, () => {
            loadRules(rules);
            renderQuickAdd(rules);
            showToast('Rule deleted!');
            chrome.runtime.sendMessage({ action: 'updateRules', rules });
        });
    });
}

function renderQuickAdd(rules) {
    const container = document.getElementById('quickAddGrid');
    container.innerHTML = popularSites.map(site => {
        const exists = rules.some(r => r.domain === site);
        return `
            <button 
                class="quick-add-btn ${exists ? 'added' : ''}" 
                onclick="quickAddSite('${site}')"
                ${exists ? 'disabled' : ''}
            >
                ${exists ? '✓ ' : ''}${site}
            </button>
        `;
    }).join('');
}

function quickAddSite(domain) {
    chrome.storage.local.get(['rules'], (result) => {
        const rules = result.rules || [];

        if (rules.some(r => r.domain === domain)) {
            showToast('Rule already exists!');
            return;
        }

        const newRule = {
            id: Date.now().toString(),
            domain,
            action: 'block',
            createdAt: new Date().toISOString()
        };

        rules.push(newRule);
        chrome.storage.local.set({ rules }, () => {
            loadRules(rules);
            renderQuickAdd(rules);
            showToast(`${domain} added to blocked list!`);
            chrome.runtime.sendMessage({ action: 'updateRules', rules });
        });
    });
}

// Settings Management
function loadSettings() {
    chrome.storage.local.get(['settings'], (result) => {
        const settings = result.settings || {
            focusStart: '09:00',
            focusEnd: '17:00',
            strictMode: true,
            weekendMode: false,
            notifications: true,
            theme: 'light'
        };

        document.getElementById('focusStart').value = settings.focusStart || '09:00';
        document.getElementById('focusEnd').value = settings.focusEnd || '17:00';
        document.getElementById('strictMode').checked = settings.strictMode !== false;
        document.getElementById('weekendMode').checked = settings.weekendMode === true;
        document.getElementById('notifications').checked = settings.notifications !== false;
        document.getElementById('theme').value = settings.theme || 'light';
    });
}

function saveSettings() {
    const settings = {
        focusStart: document.getElementById('focusStart').value,
        focusEnd: document.getElementById('focusEnd').value,
        strictMode: document.getElementById('strictMode').checked,
        weekendMode: document.getElementById('weekendMode').checked,
        notifications: document.getElementById('notifications').checked,
        theme: document.getElementById('theme').value
    };

    chrome.storage.local.set({ settings }, () => {
        showToast('Settings saved successfully!');
        chrome.runtime.sendMessage({ action: 'updateSettings', settings });
    });
}

// Analytics
function loadAnalytics() {
    chrome.storage.local.get(['stats', 'activity'], (result) => {
        const stats = result.stats || {
            blockedCount: 0,
            completedCount: 0,
            focusScore: 0,
            timeSaved: 0
        };

        document.getElementById('statBlocked').textContent = stats.blockedCount || 0;
        document.getElementById('statCompleted').textContent = stats.completedCount || 0;
        document.getElementById('statScore').textContent = stats.focusScore || 0;
        document.getElementById('statTime').textContent = stats.timeSaved || 0;

        // Get most blocked sites
        const activity = result.activity || [];
        const blockedSites = {};
        
        activity.forEach(item => {
            if (item.site) {
                blockedSites[item.site] = (blockedSites[item.site] || 0) + 1;
            }
        });

        const sorted = Object.entries(blockedSites)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        const container = document.getElementById('blockedSites');
        if (sorted.length === 0) {
            container.innerHTML = '<div class="empty-state">No blocked sites yet</div>';
        } else {
            container.innerHTML = sorted.map(([site, count]) => `
                <div class="blocked-site-item">
                    <span class="site-name">${site}</span>
                    <span class="site-count">${count} times</span>
                </div>
            `).join('');
        }
    });
}

// Profile
function loadProfile() {
    chrome.storage.local.get(['user', 'settings'], (result) => {
        const user = result.user || {
            name: 'Guest User',
            email: 'guest@mindguard.local',
            role: 'user'
        };
        const settings = result.settings || {};

        document.getElementById('profileName').textContent = user.name || 'Guest User';
        document.getElementById('profileEmail').textContent = user.email || 'guest@mindguard.local';
        document.getElementById('profileRole').textContent = `Role: ${user.role || 'user'}`;
        document.getElementById('profileAvatar').textContent = (user.name || 'G').charAt(0).toUpperCase();

        document.getElementById('country').value = settings.country || 'IN';
        document.getElementById('language').value = settings.language || 'en';
    });

    // Save profile changes
    document.getElementById('country').addEventListener('change', saveProfileSettings);
    document.getElementById('language').addEventListener('change', saveProfileSettings);
}

function saveProfileSettings() {
    chrome.storage.local.get(['settings'], (result) => {
        const settings = result.settings || {};
        settings.country = document.getElementById('country').value;
        settings.language = document.getElementById('language').value;

        chrome.storage.local.set({ settings }, () => {
            showToast('Profile updated!');
        });
    });
}

// Utility Functions
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function clearData() {
    if (!confirm('Reset all extension data? This will clear activity logs, stats, and rules.')) {
        return;
    }

    if (!confirm('This action cannot be undone. Are you absolutely sure?')) {
        return;
    }

    chrome.storage.local.set({
        stats: { blockedCount: 0, completedCount: 0, focusScore: 0, timeSaved: 0 },
        activity: [],
        rules: []
    }, () => {
        showToast('All data has been reset!');
        chrome.runtime.sendMessage({ action: 'updateRules', rules: [] });
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    });
}

// Data management is handled by the extension, no logout needed
