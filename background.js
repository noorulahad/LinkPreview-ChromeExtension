// Create a worker-specific parser
self.DOMParser = class {
    parseFromString(string, type) {
        return new Response(string).text()
            .then(text => {
                const parser = new self.DOMParser();
                return parser.parseFromString(text, type);
            });
    }
};

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'fetchPreview') {
        fetchPreviewData(request.url)
            .then(data => sendResponse(data))
            .catch(error => sendResponse({ error: error.message }));
        return true; // Will respond asynchronously
    }
});

// Function to fetch preview data
async function fetchPreviewData(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        
        // Extract metadata
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Get title
        const title = doc.querySelector('title')?.textContent ||
                     doc.querySelector('meta[property="og:title"]')?.content ||
                     url;

        // Get description
        const description = doc.querySelector('meta[name="description"]')?.content ||
                          doc.querySelector('meta[property="og:description"]')?.content ||
                          '';

        // Get favicon
        const favicon = doc.querySelector('link[rel="icon"]')?.href ||
                       doc.querySelector('link[rel="shortcut icon"]')?.href ||
                       `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=128`;

        // Get image
        const image = doc.querySelector('meta[property="og:image"]')?.content ||
                     doc.querySelector('meta[name="twitter:image"]')?.content ||
                     '';

        return {
            title,
            description,
            favicon,
            image,
            url: new URL(url).hostname
        };
    } catch (error) {
        console.error('Error fetching preview:', error);
        return {
            title: url,
            description: '',
            favicon: `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=128`,
            url: new URL(url).hostname
        };
    }
}

// Handle installation
chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});

// Handle errors
self.onerror = function(message, source, lineno, colno, error) {
    console.error('Service Worker Error:', {message, source, lineno, colno, error});
    return true;
};
