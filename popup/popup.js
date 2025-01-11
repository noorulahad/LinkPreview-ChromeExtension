document.addEventListener('DOMContentLoaded', function() {
    // Initialize settings
    let settings = {
        enablePreview: true,
        darkMode: false,
        previewDelay: 500,
        previewStyle: 'modern'
    };

    // Get DOM elements
    const saveButton = document.getElementById('saveSettings');
    const enablePreviewToggle = document.getElementById('enablePreview');
    const darkModeToggle = document.getElementById('darkMode');
    const previewDelaySlider = document.getElementById('previewDelay');
    const delayValueDisplay = document.getElementById('delayValue');
    const styleButtons = document.querySelectorAll('.style-btn');
    const saveToast = document.getElementById('saveToast');

    // Load saved settings
    chrome.storage.sync.get('previewSettings', function(data) {
        if (data.previewSettings) {
            settings = { ...settings, ...data.previewSettings };
            updateUI();
        }
    });

    // Update UI with current settings
    function updateUI() {
        enablePreviewToggle.checked = settings.enablePreview;
        darkModeToggle.checked = settings.darkMode;
        previewDelaySlider.value = settings.previewDelay;
        delayValueDisplay.textContent = `${settings.previewDelay}ms`;
        
        styleButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.style === settings.previewStyle);
        });

        document.body.classList.toggle('dark-mode', settings.darkMode);
    }

    // Event listeners
    enablePreviewToggle.addEventListener('change', function(e) {
        settings.enablePreview = e.target.checked;
    });

    darkModeToggle.addEventListener('change', function(e) {
        settings.darkMode = e.target.checked;
        document.body.classList.toggle('dark-mode', settings.darkMode);
    });

    previewDelaySlider.addEventListener('input', function(e) {
        settings.previewDelay = parseInt(e.target.value);
        delayValueDisplay.textContent = `${settings.previewDelay}ms`;
    });

    styleButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            settings.previewStyle = e.target.dataset.style;
            styleButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    // Save settings
    saveButton.addEventListener('click', function() {
        // Show loading state
        saveButton.textContent = 'Saving...';
        saveButton.disabled = true;

        chrome.storage.sync.set({ previewSettings: settings }, function() {
            // Show success state
            saveButton.textContent = 'Save Settings';
            saveButton.disabled = false;
            
            // Show toast
            saveToast.classList.add('show');
            setTimeout(() => {
                saveToast.classList.remove('show');
            }, 3000);

            // Notify all tabs
            chrome.tabs.query({}, function(tabs) {
                tabs.forEach(function(tab) {
                    chrome.tabs.sendMessage(tab.id, {
                        type: 'settingsUpdated',
                        settings: settings
                    }).catch(() => {
                        // Ignore errors for inactive tabs
                    });
                });
            });
        });
    });
});
