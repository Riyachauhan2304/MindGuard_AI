// Content script for MindGuard Extension
// Lightweight blocking - only blocks sites based on synced rules from website

console.log('[v0] Content script loaded');

// Get current domain
const currentDomain = new URL(window.location.href).hostname;
let isBlocked = false;

// Check if blocking is enabled and if current site should be blocked
chrome.storage.local.get(['blockingEnabled', 'rules'], (result) => {
    const blockingEnabled = result.blockingEnabled !== false;
    const rules = result.rules || [];

    if (!blockingEnabled || !rules.length) {
        return;
    }

    // Check if domain matches any blocking rule
    const shouldBlock = rules.some(rule => {
        if (rule.action !== 'block') return false;
        return currentDomain === rule.domain || currentDomain.endsWith('.' + rule.domain);
    });

    if (shouldBlock) {
        isBlocked = true;
        blockPage();
    }
});

function blockPage() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'mindguard-blocked';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: white;
    `;

    // Create content box
    const box = document.createElement('div');
    box.style.cssText = `
        background: white;
        border-radius: 20px;
        padding: 40px;
        max-width: 400px;
        text-align: center;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        color: #1f2937;
    `;

    const title = document.createElement('h2');
    title.textContent = '🛡️ This Site is Blocked';
    title.style.cssText = 'margin: 0 0 10px 0; font-size: 24px; color: #667eea;';

    const message = document.createElement('p');
    message.textContent = currentDomain + ' is blocked. Manage rules on the MindGuard website.';
    message.style.cssText = 'margin: 0 0 20px 0; color: #6b7280; font-size: 16px;';

    const challenge = document.createElement('div');
    challenge.style.cssText = `
        background: #f3f4f6;
        padding: 15px;
        border-radius: 12px;
        margin-bottom: 20px;
    `;

    const challengeTitle = document.createElement('p');
    challengeTitle.textContent = 'Complete a challenge in the extension:';
    challengeTitle.style.cssText = 'margin: 0 0 10px 0; font-size: 14px; color: #667eea; font-weight: 600;';

    const challenges = document.createElement('div');
    challenges.style.cssText = 'display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;';
    
    const challengeOptions = ['🧘 Breathing', '🧠 Quiz', '⌨️ Typing', '🔮 Riddle'];
    challengeOptions.forEach(opt => {
        const btn = document.createElement('div');
        btn.textContent = opt;
        btn.style.cssText = `
            background: white;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 12px;
            border: 2px solid #667eea;
            color: #667eea;
            font-weight: 600;
        `;
        challenges.appendChild(btn);
    });

    challenge.appendChild(challengeTitle);
    challenge.appendChild(challenges);

    const openExtension = document.createElement('button');
    openExtension.textContent = 'Click MindGuard Icon to Continue';
    openExtension.style.cssText = `
        width: 100%;
        padding: 12px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.3s;
    `;
    
    openExtension.addEventListener('mouseover', () => {
        openExtension.style.transform = 'translateY(-2px)';
        openExtension.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
    });
    
    openExtension.addEventListener('mouseout', () => {
        openExtension.style.transform = 'translateY(0)';
        openExtension.style.boxShadow = 'none';
    });

    const timer = document.createElement('p');
    timer.style.cssText = `
        margin-top: 15px;
        font-size: 12px;
        color: #9ca3af;
    `;

    const now = new Date();
    timer.textContent = `Blocked at ${now.toLocaleTimeString()}`;

    box.appendChild(title);
    box.appendChild(message);
    box.appendChild(challenge);
    box.appendChild(openExtension);
    box.appendChild(timer);

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    // Prevent scrolling
    document.body.style.overflow = 'hidden';

    // Record blocked site
    chrome.runtime.sendMessage({
        action: 'recordBlockedSite',
        site: window.location.href,
        domain: currentDomain
    });
}

// Listen for messages from extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'isBlocked') {
        const isBlocked = document.getElementById('mindguard-blocked') !== null;
        sendResponse({ isBlocked });
    }
});
