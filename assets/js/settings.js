// =====================
// Settings Management
// =====================

class SettingsManager {
    constructor() {
        this.storageKey = 'dermAI_settings';
        this.defaultSettings = {
            appearance: {
                darkMode: false,
                fontSize: 'medium',
                animations: true
            },
            detection: {
                autoSave: true,
                imageEnhancement: true,
                confidenceThreshold: 70,
                showAllPredictions: true
            },
            notifications: {
                browser: false,
                sound: false,
                reminders: false
            },
            privacy: {
                saveImages: true,
                analytics: false,
                historyLimit: 10
            }
        };

        this.settings = this.load();
    }

    // Load settings from localStorage
    load() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            try {
                return { ...this.defaultSettings, ...JSON.parse(stored) };
            } catch (e) {
                console.error('Error loading settings:', e);
                return this.defaultSettings;
            }
        }
        return this.defaultSettings;
    }

    // Save settings to localStorage
    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
        this.applySettings();
    }

    // Get specific setting
    get(category, key) {
        return this.settings[category]?.[key];
    }

    // Set specific setting
    set(category, key, value) {
        if (!this.settings[category]) {
            this.settings[category] = {};
        }
        this.settings[category][key] = value;
        this.save();
    }

    // Apply settings to UI
    applySettings() {
        // Apply dark mode
        if (this.settings.appearance.darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }

        // Apply font size
        document.documentElement.style.fontSize = {
            small: '14px',
            medium: '16px',
            large: '18px'
        }[this.settings.appearance.fontSize] || '16px';

        // Apply animations
        if (!this.settings.appearance.animations) {
            document.documentElement.style.setProperty('--transition', 'none');
        } else {
            document.documentElement.style.setProperty('--transition', 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)');
        }
    }

    // Export settings as JSON
    export() {
        const dataStr = JSON.stringify(this.settings, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dermAI_settings_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Import settings from JSON
    import(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                this.settings = { ...this.defaultSettings, ...imported };
                this.save();
                this.initializeUI();
                showNotification('Settings imported successfully!', 'success');
                setTimeout(() => window.location.reload(), 1000);
            } catch (error) {
                showNotification('Error importing settings', 'error');
                console.error('Import error:', error);
            }
        };
        reader.readAsText(file);
    }

    // Reset to defaults
    reset() {
        this.settings = { ...this.defaultSettings };
        this.save();
        this.initializeUI();
    }

    // Initialize UI with current settings
    initializeUI() {
        // Appearance
        document.getElementById('darkModeToggle').checked = this.settings.appearance.darkMode;
        document.getElementById('fontSizeSelect').value = this.settings.appearance.fontSize;
        document.getElementById('animationsToggle').checked = this.settings.appearance.animations;

        // Detection
        document.getElementById('autoSaveToggle').checked = this.settings.detection.autoSave;
        document.getElementById('enhancementToggle').checked = this.settings.detection.imageEnhancement;
        document.getElementById('confidenceThreshold').value = this.settings.detection.confidenceThreshold;
        document.getElementById('thresholdValue').textContent = this.settings.detection.confidenceThreshold;
        document.getElementById('showAllToggle').checked = this.settings.detection.showAllPredictions;

        // Notifications
        document.getElementById('browserNotificationsToggle').checked = this.settings.notifications.browser;
        document.getElementById('soundToggle').checked = this.settings.notifications.sound;
        document.getElementById('remindersToggle').checked = this.settings.notifications.reminders;

        // Privacy
        document.getElementById('saveImagesToggle').checked = this.settings.privacy.saveImages;
        document.getElementById('analyticsToggle').checked = this.settings.privacy.analytics;
        document.getElementById('historyLimitSelect').value = this.settings.privacy.historyLimit;
    }
}

// Initialize settings manager
const settingsManager = new SettingsManager();

// Load and apply settings on page load
window.addEventListener('load', () => {
    settingsManager.applySettings();
    settingsManager.initializeUI();
    calculateCacheSize();
});

// =====================
// Event Listeners
// =====================

// Dark Mode Toggle
document.getElementById('darkModeToggle')?.addEventListener('change', (e) => {
    settingsManager.set('appearance', 'darkMode', e.target.checked);
});

// Font Size
document.getElementById('fontSizeSelect')?.addEventListener('change', (e) => {
    settingsManager.set('appearance', 'fontSize', e.target.value);
});

// Animations
document.getElementById('animationsToggle')?.addEventListener('change', (e) => {
    settingsManager.set('appearance', 'animations', e.target.checked);
});

// Auto-Save
document.getElementById('autoSaveToggle')?.addEventListener('change', (e) => {
    settingsManager.set('detection', 'autoSave', e.target.checked);
});

// Image Enhancement
document.getElementById('enhancementToggle')?.addEventListener('change', (e) => {
    settingsManager.set('detection', 'imageEnhancement', e.target.checked);
});

// Confidence Threshold
document.getElementById('confidenceThreshold')?.addEventListener('input', (e) => {
    const value = e.target.value;
    document.getElementById('thresholdValue').textContent = value;
    settingsManager.set('detection', 'confidenceThreshold', parseInt(value));
});

// Show All Predictions
document.getElementById('showAllToggle')?.addEventListener('change', (e) => {
    settingsManager.set('detection', 'showAllPredictions', e.target.checked);
});

// Browser Notifications
document.getElementById('browserNotificationsToggle')?.addEventListener('change', async (e) => {
    if (e.target.checked) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            settingsManager.set('notifications', 'browser', true);
            showNotification('Notifications enabled!', 'success');
        } else {
            e.target.checked = false;
            showNotification('Notification permission denied', 'error');
        }
    } else {
        settingsManager.set('notifications', 'browser', false);
    }
});

// Sound Effects
document.getElementById('soundToggle')?.addEventListener('change', (e) => {
    settingsManager.set('notifications', 'sound', e.target.checked);
});

// Reminders
document.getElementById('remindersToggle')?.addEventListener('change', (e) => {
    settingsManager.set('notifications', 'reminders', e.target.checked);
});

// Save Images
document.getElementById('saveImagesToggle')?.addEventListener('change', (e) => {
    settingsManager.set('privacy', 'saveImages', e.target.checked);
});

// Analytics
document.getElementById('analyticsToggle')?.addEventListener('change', (e) => {
    settingsManager.set('privacy', 'analytics', e.target.checked);
});

// History Limit
document.getElementById('historyLimitSelect')?.addEventListener('change', (e) => {
    settingsManager.set('privacy', 'historyLimit', parseInt(e.target.value));
});

// Import Settings
document.getElementById('importFile')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        settingsManager.import(file);
    }
});

// =====================
// Utility Functions
// =====================

function exportSettings() {
    settingsManager.export();
    showNotification('Settings exported successfully!', 'success');
}

async function clearCache() {
    if (confirm('Are you sure you want to clear the cache? This will remove all offline data.')) {
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
            showNotification('Cache cleared successfully!', 'success');
            calculateCacheSize();
        }
    }
}

function clearAllData() {
    if (confirm('Are you sure you want to clear ALL data? This action cannot be undone and will remove:

• Detection history
• Settings
• Cached images
• All stored preferences')) {
        localStorage.clear();
        sessionStorage.clear();
        clearCache();
        showNotification('All data cleared. Reloading...', 'success');
        setTimeout(() => window.location.reload(), 1500);
    }
}

async function calculateCacheSize() {
    const cacheElement = document.getElementById('cacheSize');
    if (!cacheElement) return;

    try {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            const estimate = await navigator.storage.estimate();
            const usedMB = (estimate.usage / (1024 * 1024)).toFixed(2);
            const quotaMB = (estimate.quota / (1024 * 1024)).toFixed(2);
            cacheElement.textContent = `${usedMB} MB of ${quotaMB} MB used`;
        } else {
            cacheElement.textContent = 'Unable to estimate';
        }
    } catch (error) {
        cacheElement.textContent = 'Unable to calculate';
        console.error('Cache size calculation error:', error);
    }
}
