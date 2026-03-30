// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('[v0] Options page loaded');
    initializeAllListeners();
    loadInitialData();
});

function initializeAllListeners() {
    // Tab Navigation
    const navButtons = document.querySelectorAll('.nav-btn');
    console.log('[v0] Found', navButtons.length, 'navigation buttons');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = e.target.getAttribute('data-tab');
            console.log('[v0] Switching to tab:', tabName);
            switchTab(tabName);
        });
    });

    // Add Rule Form
    const addRuleForm = document.getElementById('addRuleForm');
    if (addRuleForm) {
        console.log('[v0] Attaching form submit listener');
        addRuleForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addNewRule();
        });
    } else {
        console.error('[v0] Add rule form not found!');
    }

    // Save All Settings button
    const saveBtn = document.getElementById('saveAllBtn');
    if (saveBtn) {
        console.log('[v0] Attaching save button listener');
        saveBtn.addEventListener('click', saveSettings);
    } else {
        // Try finding by onclick attribute if no ID
        const buttons = document.querySelectorAll('button');
        buttons.forEach(btn => {
            if (btn.textContent.includes('Save All Settings')) {
                console.log('[v0] Found save button by text');
                btn.addEventListener('click', saveSettings);
            }
        });
    }

    // Load analytics when analytics tab is clicked
    const analyticsBtn = document.querySelector('[data-tab="analytics"]');
    if (analyticsBtn) {
        analyticsBtn.addEventListener('click', loadAnalytics);
    }

    // Load profile when profile tab is clicked
    const profileBtn = document.querySelector('[data-tab="profile"]');
    if (profileBtn) {
        profileBtn.addEventListener('click', loadProfile);
    }
}

function loadInitialData() {
    console.log('[v0] Loading initial data');
    chrome.storage.local.get(['user', 'rules', 'stats'], (result) => {
        // Ensure user profile exists
        if (!result.user) {
            const defaultUser = {
                id: 'guest-user',
                name: 'Guest User',
                email: 'guest@mindguard.local',
                role: 'user',
                joinDate: new Date().toISOString()
            };
            chrome.storage.local.set({ user: defaultUser }, () => {
                console.log('[v0] Created default user');
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
}

function switchTab(tabName) {
    console.log('[v0] Switching to tab:', tabName);
    
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

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

// Popular sites for quick adding
const popularSites = [
    'youtube.com', 'instagram.com', 'facebook.com', 'twitter.com',
    'reddit.com', 'tiktok.com', 'netflix.com', 'twitch.tv',
    'pinterest.com', 'linkedin.com', 'snapchat.com', 'discord.com'
];

// Add new rule function
function addNewRule() {
    console.log('[v0] Adding new rule');
    
    const domainInput = document.getElementById('domain');
    const actionInput = document.getElementById('action');
    
    if (!domainInput || !actionInput) {
        console.error('[v0] Form inputs not found!');
        return;
    }

    const domain = domainInput.value.trim();
    const action = actionInput.value;

    console.log('[v0] Domain:', domain, 'Action:', action);

    if (!domain) {
        showToast('Please enter a domain!');
        return;
    }

    chrome.storage.local.get(['rules'], (result) => {
        const rules = result.rules || [];
        console.log('[v0] Current rules count:', rules.length);

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
        console.log('[v0] New rules count:', rules.length);

        chrome.storage.local.set({ rules }, () => {
            console.log('[v0] Rules saved');
            loadRules(rules);
            renderQuickAdd(rules);
            domainInput.value = '';
            showToast('Rule added successfully!');

            // Notify background script
            try {
                chrome.runtime.sendMessage(
                    { action: 'updateRules', rules },
                    (response) => {
                        console.log('[v0] Background updated:', response);
                    }
                );
            } catch (error) {
                console.log('[v0] Message error:', error.message);
            }
        });
    });
}

// Load and display rules
function loadRules(rules) {
    console.log('[v0] Loading', rules.length, 'rules');
    const rulesList = document.getElementById('rulesList');
    
    if (!rulesList) {
        console.error('[v0] Rules list container not found!');
        return;
    }

    rulesList.innerHTML = '';

    if (rules.length === 0) {
        rulesList.innerHTML = '<p style="color: #999; text-align: center;">No rules added yet</p>';
        document.getElementById('rulesCount').textContent = '(0)';
        return;
    }

    rules.forEach(rule => {
        const ruleElement = document.createElement('div');
        ruleElement.className = 'rule-item';
        ruleElement.innerHTML = `
            <div class="rule-content">
                <div class="rule-domain">${rule.domain}</div>
                <div class="rule-action" style="color: ${rule.action === 'block' ? '#ef4444' : '#10b981'}">
                    ${rule.action.charAt(0).toUpperCase() + rule.action.slice(1)}
                </div>
            </div>
            <button class="rule-delete" onclick="deleteRule('${rule.id}')">Delete</button>
        `;
        rulesList.appendChild(ruleElement);
    });

    document.getElementById('rulesCount').textContent = `(${rules.length})`;
}

function deleteRule(ruleId) {
    console.log('[v0] Deleting rule:', ruleId);
    chrome.storage.local.get(['rules'], (result) => {
        const rules = (result.rules || []).filter(r => r.id !== ruleId);
        chrome.storage.local.set({ rules }, () => {
            console.log('[v0] Rule deleted');
            loadRules(rules);
            renderQuickAdd(rules);
            showToast('Rule deleted!');
            chrome.runtime.sendMessage({ action: 'updateRules', rules });
        });
    });
}

// Render quick add buttons
function renderQuickAdd(rules) {
    console.log('[v0] Rendering quick add buttons');
    const container = document.getElementById('quickAddSites');
    
    if (!container) {
        console.error('[v0] Quick add container not found!');
        return;
    }

    container.innerHTML = '';
    popularSites.forEach(site => {
        const exists = rules.some(r => r.domain === site);
        const btn = document.createElement('button');
        btn.className = 'quick-add-btn';
        btn.textContent = site;
        btn.style.opacity = exists ? '0.5' : '1';
        btn.style.cursor = exists ? 'not-allowed' : 'pointer';
        
        btn.addEventListener('click', () => {
            if (!exists) {
                const newRule = {
                    id: Date.now().toString(),
                    domain: site,
                    action: 'block',
                    createdAt: new Date().toISOString()
                };
                chrome.storage.local.get(['rules'], (result) => {
                    const updatedRules = [...(result.rules || []), newRule];
                    chrome.storage.local.set({ rules: updatedRules }, () => {
                        console.log('[v0] Quick add rule created for', site);
                        loadRules(updatedRules);
                        renderQuickAdd(updatedRules);
                        showToast(`${site} blocked!`);
                        chrome.runtime.sendMessage({ action: 'updateRules', rules: updatedRules });
                    });
                });
            }
        });
        
        container.appendChild(btn);
    });
}

// Load and display settings
function loadSettings() {
    console.log('[v0] Loading settings');
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
        document.getElementById('strictMode').checked = settings.strictMode || false;
        document.getElementById('weekendMode').checked = settings.weekendMode || false;
        document.getElementById('notifications').checked = settings.notifications !== false;
        document.getElementById('theme').value = settings.theme || 'light';

        console.log('[v0] Settings loaded');
    });
}

// Save settings
function saveSettings() {
    console.log('[v0] Saving settings');
    const settings = {
        focusStart: document.getElementById('focusStart').value,
        focusEnd: document.getElementById('focusEnd').value,
        strictMode: document.getElementById('strictMode').checked,
        weekendMode: document.getElementById('weekendMode').checked,
        notifications: document.getElementById('notifications').checked,
        theme: document.getElementById('theme').value
    };

    console.log('[v0] Settings:', settings);
    chrome.storage.local.set({ settings }, () => {
        console.log('[v0] Settings saved');
        showToast('Settings saved successfully!');
        
        try {
            chrome.runtime.sendMessage({ action: 'updateSettings', settings });
        } catch (error) {
            console.log('[v0] Message error:', error.message);
        }
    });
}

// Load analytics
function loadAnalytics() {
    console.log('[v0] Loading analytics');
    chrome.storage.local.get(['stats', 'activity'], (result) => {
        const stats = result.stats || {
            focusScore: 0,
            blockedCount: 0,
            completedCount: 0,
            timeSaved: 0
        };

        // Update stats display
        const statsContainer = document.getElementById('analyticsStats');
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="stat-card">
                    <div class="stat-value">${stats.focusScore}</div>
                    <div class="stat-label">Focus Score</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.blockedCount}</div>
                    <div class="stat-label">Sites Blocked</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.completedCount}</div>
                    <div class="stat-label">Challenges Completed</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.timeSaved}h</div>
                    <div class="stat-label">Time Saved</div>
                </div>
            `;
        }

        console.log('[v0] Analytics loaded');
    });
}

// Load profile
function loadProfile() {
    console.log('[v0] Loading profile');
    chrome.storage.local.get(['user', 'settings'], (result) => {
        const user = result.user || {
            name: 'Guest User',
            email: 'guest@mindguard.local',
            role: 'user'
        };
        const settings = result.settings || {};

        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const profileRole = document.getElementById('profileRole');
        const profileAvatar = document.getElementById('profileAvatar');

        if (profileName) profileName.textContent = user.name || 'Guest User';
        if (profileEmail) profileEmail.textContent = user.email || 'guest@mindguard.local';
        if (profileRole) profileRole.textContent = `Role: ${user.role || 'user'}`;
        if (profileAvatar) profileAvatar.textContent = (user.name || 'G').charAt(0).toUpperCase();

        const countrySelect = document.getElementById('country');
        const languageSelect = document.getElementById('language');
        
        if (countrySelect) countrySelect.value = settings.country || 'IN';
        if (languageSelect) languageSelect.value = settings.language || 'en';

        // Save country/language changes
        if (countrySelect) {
            countrySelect.addEventListener('change', saveProfileSettings);
        }
        if (languageSelect) {
            languageSelect.addEventListener('change', saveProfileSettings);
        }

        console.log('[v0] Profile loaded');
    });
}

function saveProfileSettings() {
    console.log('[v0] Saving profile settings');
    chrome.storage.local.get(['settings'], (result) => {
        const settings = result.settings || {};
        settings.country = document.getElementById('country').value;
        settings.language = document.getElementById('language').value;
        
        chrome.storage.local.set({ settings }, () => {
            console.log('[v0] Profile settings saved');
            showToast('Profile settings saved!');
        });
    });
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
        console.log('[v0] Data cleared');
        showToast('All data has been reset!');
        chrome.runtime.sendMessage({ action: 'updateRules', rules: [] });
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    });
}

// Toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) {
        console.error('[v0] Toast element not found!');
        return;
    }

    toast.textContent = message;
    toast.style.display = 'block';
    toast.style.animation = 'slideIn 0.3s ease-out';

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 300);
    }, 2000);
}
