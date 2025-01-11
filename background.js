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
        fetch(request.url)
            .then(response => response.text())
            .then(html => {
                // Extract data without DOMParser
                const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
                const descriptionMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"[^>]*>/i) ||
                                       html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]+)"[^>]*>/i);
                const faviconMatch = html.match(/<link[^>]*rel="icon"[^>]*href="([^"]+)"[^>]*>/i) ||
                                   html.match(/<link[^>]*rel="shortcut icon"[^>]*href="([^"]+)"[^>]*>/i);

                const previewData = {
                    title: titleMatch ? titleMatch[1].trim() : 'No title available',
                    description: descriptionMatch ? descriptionMatch[1].trim() : 'No description available',
                    favicon: faviconMatch ? new URL(faviconMatch[1], request.url).href : 
                            new URL('/favicon.ico', request.url).href
                };

                const imageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"[^>]*>/i);
                previewData.image = imageMatch ? new URL(imageMatch[1], request.url).href : null;

                sendResponse(previewData);
            })
            .catch(error => {
                console.error('Fetch error:', error);
                sendResponse({ error: 'Failed to fetch page content' });
            });

        return true; // Will respond asynchronously
    }
});

// Handle installation
chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});

// Handle errors
self.onerror = function(message, source, lineno, colno, error) {
    console.error('Service Worker Error:', {message, source, lineno, colno, error});
    return true;
};
