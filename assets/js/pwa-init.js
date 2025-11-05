// =====================
// Progressive Web App Initialization
// =====================

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered successfully:', registration.scope);

            // Check for updates periodically
            setInterval(() => {
                registration.update();
            }, 60000); // Check every minute

            // Handle service worker updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        showUpdateNotification();
                    }
                });
            });
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    });
}

// Show update notification
function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
        <div class="update-content">
            <i class="fas fa-download"></i>
            <div>
                <strong>Update Available</strong>
                <p>A new version of DermAI is ready</p>
            </div>
            <button onclick="updateApp()" class="btn btn-primary btn-small">
                Update Now
            </button>
            <button onclick="this.parentElement.parentElement.remove()" class="btn btn-secondary btn-small">
                Later
            </button>
        </div>
    `;

    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: white;
        padding: 1.5rem;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 400px;
    `;

    document.body.appendChild(notification);
}

// Update app
function updateApp() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(reg => {
            if (reg && reg.waiting) {
                reg.waiting.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
            }
        });
    }
}

// Install prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallButton();
});

function showInstallButton() {
    const installButton = document.createElement('button');
    installButton.className = 'install-button';
    installButton.innerHTML = '<i class="fas fa-download"></i> Install App';
    installButton.onclick = installApp;

    installButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 1rem 2rem;
        border: none;
        border-radius: 50px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: transform 0.3s ease;
    `;

    installButton.onmouseover = () => {
        installButton.style.transform = 'translateY(-3px)';
    };

    installButton.onmouseout = () => {
        installButton.style.transform = 'translateY(0)';
    };

    document.body.appendChild(installButton);
}

async function installApp() {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        showNotification('App installed successfully!', 'success');
    }

    deferredPrompt = null;
    document.querySelector('.install-button')?.remove();
}

// Check if app is installed
window.addEventListener('appinstalled', () => {
    console.log('DermAI has been installed');
    showNotification('Welcome to DermAI!', 'success');
    document.querySelector('.install-button')?.remove();
});

// Online/Offline detection
window.addEventListener('online', () => {
    showNotification('You are back online', 'success');
});

window.addEventListener('offline', () => {
    showNotification('You are offline. Some features may be limited.', 'warning');
});

// Background Sync
if ('sync' in navigator.serviceWorker.ready) {
    navigator.serviceWorker.ready.then(registration => {
        return registration.sync.register('sync-detections');
    }).catch(err => {
        console.log('Background sync registration failed:', err);
    });
}
