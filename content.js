// Add modern styles
const style = document.createElement('style');
style.textContent = `
    .link-preview {
        position: fixed;
        z-index: 999999;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08),
                    0 2px 8px rgba(0, 0, 0, 0.04),
                    0 0 1px rgba(0, 0, 0, 0.12);
        padding: 20px;
        max-width: 400px;
        min-width: 320px;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid rgba(0, 0, 0, 0.05);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        backdrop-filter: blur(10px);
        transform-origin: top center;
    }

    .link-preview:hover {
        transform: translateY(-2px) scale(1.01);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12),
                    0 4px 12px rgba(0, 0, 0, 0.06);
    }

    .preview-loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100px;
    }

    .loading-pulse {
        width: 8px;
        height: 8px;
        background: #6366f1;
        border-radius: 50%;
        animation: pulse 1.2s ease-in-out infinite;
    }

    @keyframes pulse {
        0% { transform: scale(0.95); opacity: 0.5; }
        50% { transform: scale(1.05); opacity: 0.8; }
        100% { transform: scale(0.95); opacity: 0.5; }
    }

    .preview-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
    }

    .preview-site-info {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .preview-favicon {
        width: 24px;
        height: 24px;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
    }

    .preview-domain {
        font-size: 14px;
        color: #6b7280;
        font-weight: 500;
    }

    .preview-body {
        margin: 16px 0;
    }

    .preview-title {
        font-size: 17px;
        font-weight: 600;
        color: #6b7280 !important;
        margin: 0 0 10px 0;
        line-height: 1.4;
        letter-spacing: -0.01em;
    }

    .preview-description {
        font-size: 14px;
        color: #4b5563;
        line-height: 1.6;
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .preview-security-badge {
        position: absolute;
        top: -10px;
        right: -10px;
        padding: 8px;
        border-radius: 50%;
        background: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        font-size: 16px;
        transition: all 0.2s ease;
        z-index: 1000000;
    }

    .preview-security-badge:hover {
        transform: scale(1.1) rotate(5deg);
    }

    .preview-security-badge.safe {
        background: #10b981;
        color: white;
    }

    .preview-security-badge.warning {
        background: #f59e0b;
        color: white;
    }

    .preview-security-badge.danger {
        background: #ef4444;
        color: white;
    }

    .security-warnings {
        margin: 16px 0;
        padding: 14px;
        background: #fffbeb;
        border-radius: 12px;
        border: 1px solid #fcd34d;
    }

    .security-warning {
        color: #92400e;
        font-size: 13px;
        margin: 6px 0;
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
    }

    .security-safe {
        margin: 16px 0;
        padding: 14px;
        background: #ecfdf5;
        border-radius: 12px;
        border: 1px solid #6ee7b7;
        color: #065f46;
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
    }

    /* Dark mode */
    @media (prefers-color-scheme: dark) {
        .link-preview {
            background: rgba(17, 24, 39, 0.95);
            border-color: rgba(255, 255, 255, 0.1);
        }

        .preview-title {
            color: #f3f4f6;
        }

        .preview-description {
            color: #9ca3af;
        }

        .preview-domain {
            color: #d1d5db;
        }

        .loading-pulse {
            background: #818cf8;
        }

        .security-warnings {
            background: rgba(245, 158, 11, 0.1);
            border-color: rgba(245, 158, 11, 0.2);
        }

        .security-warning {
            color: #fcd34d;
        }

        .security-safe {
            background: rgba(16, 185, 129, 0.1);
            border-color: rgba(16, 185, 129, 0.2);
            color: #34d399;
        }

        .preview-security-badge {
            background: #1f2937;
        }
    }

    /* Animations */
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .link-preview {
        animation: slideIn 0.2s ease-out;
    }

    /* Glass effect for modern browsers */
    @supports (backdrop-filter: blur(10px)) {
        .link-preview {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(10px);
        }

        @media (prefers-color-scheme: dark) {
            .link-preview {
                background: rgba(17, 24, 39, 0.85);
            }
        }
    }

    .preview-iframe {
        width: 100%; /* Full width */
        height: 150px; /* Adjust height as needed */
        border: none; /* Remove default border */
        border-radius: 8px; /* Match with other elements */
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06); /* Add shadow for consistency */
        overflow: hidden; /* Hide overflow */
        background: #fff; /* Background color */
        // transform: scale(0.8); /* Zoom out to 80% */
        // transform-origin: top left; /* Set origin for scaling */
    }
`;

document.head.appendChild(style);

// Create preview element with modern design
const previewDiv = document.createElement('div');
previewDiv.className = 'link-preview';
previewDiv.innerHTML = `
    <div class="preview-loading">
        <div class="loading-pulse"></div>
    </div>
    <div class="preview-content" style="display: none;">
        <div class="preview-security-badge"></div>
        <div class="preview-header">
            <div class="preview-site-info">
                <img class="preview-favicon" src="" alt="">
                <div class="preview-domain"></div>
            </div>
            <div class="preview-security-status"></div>
        </div>
        <div class="preview-web-view">
            <iframe src="" class="preview-iframe"></iframe>
        </div>
        <div class="preview-body">
            <h3 class="preview-title"></h3>
            <p class="preview-description"></p>
        </div>
        <div class="preview-security-info"></div>
    </div>
`;

// Initialize variables
let currentLink = null;
let previewTimeout = null;
const previewCache = new Map();

// Event listeners for all clickable elements
document.addEventListener('mouseover', handleMouseOver);
document.addEventListener('mouseout', handleMouseOut);

// Handle mouse over event
function handleMouseOver(event) {
    const target = event.target;
    const link = target.closest('a[href], button[href], [data-href], [href], li a[href], span a[href]');

    if (!link) return;

    const url = link.href || link.getAttribute('data-href');
    if (!url) return;

    // Clear any existing timeouts
    if (previewTimeout) {
        clearTimeout(previewTimeout);
    }

    // Show preview with small delay for better UX
    previewTimeout = setTimeout(() => {
        showPreview(link, url);
    }, 100);
}

// Handle mouse out event with event parameter
function handleMouseOut(event) {
    const target = event.target;
    const link = target.closest('a') || target.closest('button[href]') || target.closest('[data-href]');
    
    if (!link) return;

    if (previewTimeout) {
        clearTimeout(previewTimeout);
    }

    // Use event for mouse position check
    setTimeout(() => {
        if (!isMouseOverPreview(event)) {
            hidePreview();
        }
    }, 100);
}

// Check if mouse is over preview
function isMouseOverPreview(mouseEvent) {
    const preview = document.querySelector('.link-preview');
    if (!preview) return false;

    const rect = preview.getBoundingClientRect();
    
    // Get mouse coordinates from event or global tracking
    const mouseX = mouseEvent?.clientX ?? window.mouseX ?? 0;
    const mouseY = mouseEvent?.clientY ?? window.mouseY ?? 0;

    // Check if mouse is within preview bounds
    return (
        mouseX >= rect.left &&
        mouseX <= rect.right &&
        mouseY >= rect.top &&
        mouseY <= rect.bottom
    );
}

// Global mouse position tracking
window.mouseX = 0;
window.mouseY = 0;

document.addEventListener('mousemove', (event) => {
    window.mouseX = event.clientX;
    window.mouseY = event.clientY;
});

// Show preview with better positioning
function showPreview(link, url) {
    currentLink = link;
    
    // Get link position
    const rect = link.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate best position
    let left = rect.left + scrollX;
    let top = rect.bottom + scrollY + 10; // Add some spacing

    // Check if preview would go off-screen
    const previewWidth = 400; // Max width of preview
    const previewHeight = 200; // Approximate height

    // Adjust horizontal position
    if (left + previewWidth > viewportWidth - 20) {
        left = viewportWidth - previewWidth - 20;
    }
    if (left < 20) {
        left = 20;
    }

    // Adjust vertical position
    if (top + previewHeight > viewportHeight + scrollY - 20) {
        top = rect.top + scrollY - previewHeight - 10;
    }

    // Update preview position
    previewDiv.style.left = `${left}px`;
    previewDiv.style.top = `${top}px`;
    
    // Show preview
    previewDiv.style.display = 'block';
    requestAnimationFrame(() => {
        previewDiv.style.opacity = '1';
        previewDiv.style.transform = 'translateY(0)';
    });

    // Update content
    updatePreviewContent({
        title: link.textContent || url,
        description: link.getAttribute('title') || `Preview for ${url}`,
        favicon: `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=128`,
        url: new URL(url).hostname
    });

    // Check security
    checkLinkSecurity(url).then(updateSecurityInfo);
}

// Hide preview with animation
function hidePreview() {
    previewDiv.style.opacity = '0';
    previewDiv.style.transform = 'translateY(5px)';
    
    setTimeout(() => {
        previewDiv.style.display = 'none';
        currentLink = null;
    }, 200);
}

// Add hover effect to preview
previewDiv.addEventListener('mouseover', (event) => {
    if (previewTimeout) {
        clearTimeout(previewTimeout);
    }
});

previewDiv.addEventListener('mouseout', (event) => {
    const relatedTarget = event.relatedTarget;
    if (!relatedTarget || !previewDiv.contains(relatedTarget)) {
        hidePreview();
    }
});

// Update preview content
function updatePreviewContent(data) {
    const content = previewDiv.querySelector('.preview-content');
    content.style.display = 'block';
    previewDiv.querySelector('.preview-loading').style.display = 'none';

    content.querySelector('.preview-title').textContent = data.title || 'No title';
    content.querySelector('.preview-description').textContent = data.description || '';
    content.querySelector('.preview-favicon').src = data.favicon || '';
    content.querySelector('.preview-domain').textContent = data.url || '';
    content.querySelector('.preview-iframe').src = data.url || '';
}

// Check link security
async function checkLinkSecurity(url) {
    try {
        const urlObj = new URL(url);
        const securityInfo = {
            isSecure: urlObj.protocol === 'https:',
            safetyStatus: urlObj.protocol === 'https:' ? 'safe' : 'warning',
            warnings: []
        };

        if (!securityInfo.isSecure) {
            securityInfo.warnings.push('Connection is not secure (HTTP)');
            showToast('Warning: This link is not secure.');
        }

        // Check for suspicious TLDs
        const suspiciousTLDs = ['.xyz', '.tk', '.ml', '.ga', '.cf'];
        if (suspiciousTLDs.some(tld => urlObj.hostname.endsWith(tld))) {
            securityInfo.warnings.push('Suspicious domain extension');
            securityInfo.safetyStatus = 'warning';
            showToast('Warning: Suspicious domain extension.');
        }

        return securityInfo;
    } catch (error) {
        showToast('Error: Invalid URL format or unable to load.');
        return {
            isSecure: false,
            safetyStatus: 'danger',
            warnings: ['Invalid URL format']
        };
    }
}

// Update security information
function updateSecurityInfo(securityInfo) {
    const content = previewDiv.querySelector('.preview-content');
    const securityBadge = content.querySelector('.preview-security-badge');
    const securityInfoElement = content.querySelector('.preview-security-info');

    securityBadge.className = `preview-security-badge ${securityInfo.safetyStatus}`;
    securityBadge.innerHTML = getSecurityBadgeIcon(securityInfo.safetyStatus);

    if (securityInfo.warnings.length > 0) {
        securityInfoElement.innerHTML = `
            <div class="security-warnings">
                ${securityInfo.warnings.map(warning => `
                    <div class="security-warning">⚠️ ${warning}</div>
                `).join('')}
            </div>
        `;
    } else {
        securityInfoElement.innerHTML = `
            <div class="security-safe">
                ✅ This link appears to be safe
            </div>
        `;
    }
}

// Get security badge icon
function getSecurityBadgeIcon(status) {
    const icons = {
        safe: '🔒',
        warning: '⚠️',
        danger: '🚫'
    };
    return icons[status] || '❓';
}

// Initialize preview div
document.body.appendChild(previewDiv);

// Update mouse position tracking
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});
  

// -----------------------------------------------------------------------------------------------
async function fetchLinkDetails(url) {
    try {
        const response = await fetch(url, { method: 'GET', mode: 'cors' });
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        const title = doc.querySelector('title') ? doc.querySelector('title').innerText : 'No title';
        const description = doc.querySelector('meta[name="description"]') ? doc.querySelector('meta[name="description"]').content : 'No description';
        const favicon = doc.querySelector('link[rel="icon"]') ? doc.querySelector('link[rel="icon"]').href : '';
        const domain = new URL(url).hostname; // Extract domain from URL

        return { title, description, favicon, domain };
    } catch (error) {
        console.error('Error fetching link details:', error);
        return { title: 'Error', description: 'Could not fetch details', favicon: '', domain: '' };
    }
}

// Function to show toast message
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// CSS for toast message
const styleToast = document.createElement('style');
styleToast.textContent = `
    .toast-message {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #333;
        color: #fff;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 9999;
        opacity: 0.9;
        transition: opacity 0.5s;
    }
`;
document.head.appendChild(styleToast);