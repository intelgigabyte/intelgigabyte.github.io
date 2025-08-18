class AnnouncementManager {
    constructor() {
        this.container = document.getElementById('announcements');
        this.init();
    }

    init() {
        if (!this.container) return;
        this.showSkeleton();
        this.loadAnnouncement();
    }

    showSkeleton() {
        this.container.innerHTML = `
            <div class="announcement-skeleton">
                <div class="skeleton-header">
                    <div class="skeleton-icon"></div>
                    <div class="skeleton-title"></div>
                    <div class="skeleton-date"></div>
                </div>
                <div class="skeleton-content">
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line"></div>
                </div>
            </div>
        `;
    }

    async loadAnnouncement() {
        try {
            const response = await fetch('https://raw.githubusercontent.com/MeidyOS/MeidyOS.github.io/refs/heads/main/announcements.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const announcement = await response.json();
            this.displayAnnouncement(announcement);
        } catch (error) {
            console.error('Failed to load announcement:', error);
            this.showError();
        }
    }

    displayAnnouncement(announcement) {
        const formattedDate = this.formatDate(announcement.date);
        const formattedContent = this.formatContent(announcement.content);
        
        this.container.innerHTML = `
            <div class="announcement-card">
                <div class="announcement-header">
                    <i class="fas fa-bullhorn announcement-icon"></i>
                    <h3 class="announcement-title">${this.escapeHtml(announcement.title)}</h3>
                    <span class="announcement-date">${formattedDate}</span>
                </div>
                <div class="announcement-content">${formattedContent}</div>
            </div>
        `;
    }

    showError() {
        this.container.innerHTML = `
            <div class="announcement-error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Failed to load announcement. Please try again later.</p>
            </div>
        `;
    }

    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    }

    formatContent(content) {
        // Escape HTML first
        const escaped = this.escapeHtml(content);
        
        // Convert URLs to links
        const linkRegex = /(https?:\/\/[^\s]+)/g;
        return escaped.replace(linkRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AnnouncementManager();
});