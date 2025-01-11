// Create preview element with better styling
const previewDiv = document.createElement('div');
previewDiv.className = 'link-preview';
previewDiv.innerHTML = `
    <div class="preview-loading">
        <div class="loading-pulse"></div>
        <span>Loading...</span>
    </div>
    <div class="preview-content" style="display: none;">
        <div class="preview-security-badge"></div>
        <div class="preview-header">
            <img class="preview-favicon" src="" alt="">
            <div class="preview-title"></div>
        </div>
        <div class="preview-description"></div>
        <div class="preview-security-info"></div>
        <div class="preview-meta">
            <span class="preview-url"></span>
            <span class="preview-security-status"></span>
        </div>
    </div>
`;
document.body.appendChild(previewDiv);

// Track hover state
let currentLink = null;
let previewTimeout = null;
let previewCache = new Map(); // Cache for faster loading

// Security check function
async function checkLinkSecurity(url) {
    try {
        const urlObj = new URL(url);
        const securityInfo = {
            isSecure: urlObj.protocol === 'https:',
            domain: urlObj.hostname,
            warnings: [],
            safetyStatus: 'unknown'
        };

        // Check for common security issues
        if (!securityInfo.isSecure) {
            securityInfo.warnings.push('Unsecure connection (HTTP)');
            securityInfo.safetyStatus = 'warning';
        }

        // Check for suspicious TLDs
        const suspiciousTLDs = ['.xyz', '.tk', '.ml', '.ga', '.cf'];
        if (suspiciousTLDs.some(tld => urlObj.hostname.endsWith(tld))) {
            securityInfo.warnings.push('Suspicious domain extension');
            securityInfo.safetyStatus = 'warning';
        }

        // Check for deceptive URLs
        const commonBrands = ['paypal', 'google', 'facebook', 'microsoft', 'apple'];
        const domainName = urlObj.hostname.toLowerCase();
        if (commonBrands.some(brand => domainName.includes(brand) && !domainName.endsWith(`.${brand}.com`))) {
            securityInfo.warnings.push('Potentially deceptive URL');
            securityInfo.safetyStatus = 'danger';
        }

        // Check for data URLs
        if (url.startsWith('data:')) {
            securityInfo.warnings.push('Data URL detected');
            securityInfo.safetyStatus = 'danger';
        }

        // Check for IP addresses instead of domain names
        const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
        if (ipRegex.test(urlObj.hostname)) {
            securityInfo.warnings.push('IP address instead of domain name');
            securityInfo.safetyStatus = 'warning';
        }

        return securityInfo;
    } catch (error) {
        return {
            isSecure: false,
            warnings: ['Invalid URL format'],
            safetyStatus: 'danger'
        };
    }
}

// Helper function for security badge icons
function getSecurityBadgeIcon(status) {
    const icons = {
        safe: {
            icon: '🛡️',
            color: '#10b981'
        },
        warning: {
            icon: '⚠️',
            color: '#f59e0b'
        },
        danger: {
            icon: '🚫',
            color: '#ef4444'
        },
        unknown: {
            icon: 'ℹ️',
            color: '#6b7280'
        }
    };

    const statusInfo = icons[status] || icons.unknown;
    return `<div style="color: ${statusInfo.color}">${statusInfo.icon}</div>`;
}

// Show preview immediately with loading state
async function showQuickPreview(link) {
    const url = new URL(link.href);
    const securityInfo = await checkLinkSecurity(link.href);
    
    const quickPreview = {
        title: link.textContent || url.hostname,
        favicon: `https://www.google.com/s2/favicons?domain=${url.hostname}`,
        url: url.hostname,
        security: securityInfo
    };

    const content = previewDiv.querySelector('.preview-content');
    content.querySelector('.preview-favicon').src = quickPreview.favicon;
    content.querySelector('.preview-title').textContent = quickPreview.title;
    content.querySelector('.preview-url').textContent = quickPreview.url;

    // Update security badge and info
    const securityBadge = content.querySelector('.preview-security-badge');
    const securityInfoElement = content.querySelector('.preview-security-info');
    const securityStatus = content.querySelector('.preview-security-status');

    // Set security badge class and icon
    securityBadge.className = `preview-security-badge ${quickPreview.security.safetyStatus}`;
    securityBadge.innerHTML = getSecurityBadgeIcon(quickPreview.security.safetyStatus);

    // Update security info
    if (quickPreview.security.warnings.length > 0) {
        securityInfoElement.innerHTML = `
            <div class="security-warnings">
                ${quickPreview.security.warnings.map(warning => `
                    <div class="security-warning">
                        ⚠️ ${warning}
                    </div>
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

    // Update security status
    securityStatus.textContent = quickPreview.security.isSecure ? '🔒 Secure' : '⚠️ Not Secure';
    
    // Show preview
    previewDiv.querySelector('.preview-loading').style.display = 'none';
    content.style.display = 'block';
    
    positionPreview(link);
    showPreview(link);
}

// Position preview
function positionPreview(link) {
    const rect = link.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let left = rect.left + window.scrollX;
    let top = rect.bottom + window.scrollY + 5;

    if (left + previewDiv.offsetWidth > viewportWidth) {
        left = viewportWidth - previewDiv.offsetWidth - 10;
    }
    if (top + previewDiv.offsetHeight > viewportHeight + window.scrollY) {
        top = rect.top + window.scrollY - previewDiv.offsetHeight - 5;
    }

    previewDiv.style.left = `${left}px`;
    previewDiv.style.top = `${top}px`;
}

// Show/hide preview with animation
function showPreview(link) {
    previewDiv.style.display = 'block';
    previewDiv.style.opacity = '0';
    previewDiv.style.transform = 'translateY(5px)';
    
    requestAnimationFrame(() => {
        previewDiv.style.opacity = '1';
        previewDiv.style.transform = 'translateY(0)';
    });
}

function hidePreview() {
    previewDiv.style.opacity = '0';
    previewDiv.style.transform = 'translateY(5px)';
    
    setTimeout(() => {
        previewDiv.style.display = 'none';
    }, 150);
}

// Mouse over handler with instant preview
document.addEventListener('mouseover', (event) => {
    const link = event.target.closest('a');
    if (!link || !link.href) return;

    currentLink = link;
    
    if (previewTimeout) {
        clearTimeout(previewTimeout);
    }

    // Show quick preview immediately
    showQuickPreview(link);

    // Then load full preview
    if (previewCache.has(link.href)) {
        updatePreviewContent(previewCache.get(link.href));
    } else {
        chrome.runtime.sendMessage({
            type: 'fetchPreview',
            url: link.href
        }, (response) => {
            if (response && !response.error) {
                previewCache.set(link.href, response);
                if (currentLink === link) {
                    updatePreviewContent(response);
                }
            }
        });
    }
});

// Update preview content
function updatePreviewContent(data) {
    const content = previewDiv.querySelector('.preview-content');
    content.querySelector('.preview-title').textContent = data.title;
    if (data.description) {
        content.querySelector('.preview-description').textContent = data.description;
    }
}

// Mouse out handler
document.addEventListener('mouseout', (event) => {
    const link = event.target.closest('a');
    if (!link) return;

    if (previewTimeout) {
        clearTimeout(previewTimeout);
    }

    hidePreview();
    currentLink = null;
});

// Add styles
const style = document.createElement('style');
style.textContent = `
.link-preview {
    position: absolute;
    z-index: 10000;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 6px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    padding: 10px 14px;
    max-width: 300px;
    min-width: 200px;
    transition: all 0.15s ease;
    border: 1px solid rgba(0, 0, 0, 0.06);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.preview-loading {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
    padding: 6px;
}

.loading-pulse {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #6366f1;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% { transform: scale(0.95); opacity: 0.4; }
    50% { transform: scale(1.05); opacity: 0.7; }
    100% { transform: scale(0.95); opacity: 0.4; }
}

.preview-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
}

.preview-favicon {
    width: 14px;
    height: 14px;
}

.preview-title {
    font-weight: 500;
    font-size: 13px;
    color: #374151;
    line-height: 1.4;
}

.preview-description {
    font-size: 12px;
    color: #6b7280;
    line-height: 1.5;
    margin: 4px 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.preview-meta {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: #9ca3af;
    margin-top: 4px;
}

/* Dark mode - lighter version */
@media (prefers-color-scheme: dark) {
    .link-preview {
        background: rgba(30, 41, 59, 0.95);
        border-color: rgba(255, 255, 255, 0.08);
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    }

    .preview-title {
        color: #e5e7eb;
    }

    .preview-description {
        color: #cbd5e1;
    }

    .preview-meta {
        color: #94a3b8;
    }

    .loading-pulse {
        background: #818cf8;
    }
}

/* Hover effect */
.link-preview:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
}

/* Loading text */
.preview-loading span {
    font-size: 12px;
    color: #6b7280;
}

/* Error state */
.preview-error {
    padding: 8px;
    text-align: center;
    color: #ef4444;
    font-size: 12px;
}

.preview-security-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    padding: 4px;
    border-radius: 50%;
    font-size: 16px;
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
    margin: 8px 0;
    padding: 8px;
    background: #fff3cd;
    border-radius: 4px;
    border: 1px solid #ffeeba;
}

.security-warning {
    color: #856404;
    font-size: 11px;
    margin: 2px 0;
    display: flex;
    align-items: center;
    gap: 4px;
}

.security-safe {
    margin: 8px 0;
    padding: 8px;
    background: #d4edda;
    border-radius: 4px;
    border: 1px solid #c3e6cb;
    color: #155724;
    font-size: 11px;
    display: flex;
    align-items: center;
    gap: 4px;
}

.preview-security-status {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
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
}
`;

document.head.appendChild(style);
  