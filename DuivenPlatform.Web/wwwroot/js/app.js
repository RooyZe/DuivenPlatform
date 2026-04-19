// Main Application Entry Point
import { router } from './router.js';

// Make router globally available for inline event handlers
window.router = router;

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    router.init();
});

