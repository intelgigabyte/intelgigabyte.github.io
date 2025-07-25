// JavaScript functionality for the project
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    if (!themeToggle) {
        console.error('ERROR: Theme toggle button not found!');
        return;
    }

    // Set initial icon based on theme already applied by the head script
    if (htmlElement.classList.contains('light-mode')) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

    const applyTheme = (theme) => {
        if (theme === 'light-mode') {
            htmlElement.classList.remove('dark-mode');
            htmlElement.classList.add('light-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            htmlElement.classList.remove('light-mode');
            htmlElement.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
        localStorage.setItem('theme', theme);
    };

    themeToggle.addEventListener('click', () => {
        if (htmlElement.classList.contains('dark-mode')) {
            applyTheme('light-mode');
        } else {
            applyTheme('dark-mode');
        }
    });

    // ROM card click handler
    const romCards = document.querySelectorAll('.rom-card');
    romCards.forEach(romCard => {
        romCard.addEventListener('click', () => {
            const url = romCard.getAttribute('data-url');
            if (url) {
                window.location.href = url;
            }
        });
    });

    // Changelog Modal Logic
    const changelogBtn = document.getElementById('changelog-btn');
    const changelogModal = document.getElementById('changelogModal');
    const modalCloseBtn = document.querySelector('.modal-close');

    if (changelogBtn) {
        changelogBtn.addEventListener('click', () => {
            changelogModal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent scrolling on body
        });
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            changelogModal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling on body
        });
    }

    // Close modal when clicking outside of modal-content
    changelogModal.addEventListener('click', (event) => {
        if (event.target === changelogModal) {
            changelogModal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling on body
        }
    });

    // Mobile Navigation Toggle
    const navToggleIcon = document.getElementById('nav-toggle-icon');
    const navMenu = document.getElementById('nav-menu');

    if (navToggleIcon && navMenu) {
        navToggleIcon.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
        navMenu.querySelectorAll('.nav-item a').forEach(item => {
            item.addEventListener('click', () => {
                navMenu.classList.remove('active'); // Close menu on item click
            });
        });
    }
});