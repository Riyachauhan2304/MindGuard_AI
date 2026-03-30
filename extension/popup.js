// Lightweight popup for login and blocking toggle
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    attachEventListeners();
});

function checkLoginStatus() {
    chrome.storage.local.get(['user'], (result) => {
        if (result.user && result.user.email) {
            showDashboard(result.user);
            loadBlockingState();
        } else {
            showLoginScreen();
        }
    });
}

function showLoginScreen() {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('dashboard').classList.remove('active');
}

function showDashboard(user) {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('dashboard').classList.add('active');
    
    // Update user info
    const initials = (user.name || user.email).substring(0, 1).toUpperCase();
    document.getElementById('userAvatar').textContent = initials;
    document.getElementById('userName').textContent = user.name || user.email;
    document.getElementById('userEmail').textContent = user.email;
}

function loadBlockingState() {
    chrome.storage.local.get(['blockingEnabled'], (result) => {
        const isEnabled = result.blockingEnabled !== false;
        updateToggleUI(isEnabled);
    });
}

function updateToggleUI(enabled) {
    const toggle = document.getElementById('blockingToggle');
    const statusText = document.getElementById('statusText');
    const indicator = document.getElementById('statusIndicator');
    
    if (enabled) {
        toggle.classList.add('active');
        statusText.classList.add('active');
        statusText.textContent = '';
        statusText.innerHTML = '<span class="status-indicator active"></span>Active';
        indicator.classList.add('active');
    } else {
        toggle.classList.remove('active');
        statusText.classList.remove('active');
        statusText.textContent = '';
        statusText.innerHTML = '<span class="status-indicator"></span>Off';
        indicator.classList.remove('active');
    }
}

function attachEventListeners() {
    // Login button
    document.getElementById('loginBtn').addEventListener('click', handleLogin);
    
    // Email and password enter key
    document.getElementById('email').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
    document.getElementById('password').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
    
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Blocking toggle
    document.getElementById('blockingToggle').addEventListener('click', handleToggleBlocking);
}

async function handleLogin() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('errorMessage');
    
    if (!email || !password) {
        errorEl.textContent = 'Please enter email and password';
        errorEl.classList.add('show');
        return;
    }
    
    const loginBtn = document.getElementById('loginBtn');
    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';
    
    try {
        // TODO: Replace with actual API call to your MindGuard backend
        // This is a mock implementation - connect to your actual auth API
        const response = await fetch('https://your-mindguard-api.com/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) {
            throw new Error('Invalid credentials');
        }
        
        const data = await response.json();
        
        // Store user and rules in chrome storage
        chrome.storage.local.set({
            user: {
                id: data.userId,
                name: data.name,
                email: data.email
            },
            rules: data.rules || [],
            blockingEnabled: true
        }, () => {
            errorEl.classList.remove('show');
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
            checkLoginStatus();
        });
        
    } catch (error) {
        errorEl.textContent = 'Login failed. Check credentials and try again.';
        errorEl.classList.add('show');
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Login to Extension';
    }
}

function handleLogout() {
    if (confirm('Logout from MindGuard?')) {
        chrome.storage.local.remove(['user', 'rules', 'blockingEnabled'], () => {
            checkLoginStatus();
        });
    }
}

function handleToggleBlocking() {
    chrome.storage.local.get(['blockingEnabled'], (result) => {
        const currentState = result.blockingEnabled !== false;
        const newState = !currentState;
        
        chrome.storage.local.set({ blockingEnabled: newState }, () => {
            updateToggleUI(newState);
            
            // Notify background script and content scripts
            chrome.runtime.sendMessage({
                action: 'blockingToggled',
                enabled: newState
            }).catch(() => {
                // Background script might not be ready, that's okay
            });
        });
    });
}
