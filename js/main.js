/**
 * Art Portfolio - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Mobile Navigation
    initMobileNav();

    // Lightbox (only on gallery page)
    if (document.querySelector('.gallery-grid')) {
        initLightbox();
    }
});

/**
 * Mobile Navigation Toggle
 */
function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!navToggle || !navLinks) return;

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/**
 * Lightbox Gallery
 */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    const artworkCards = document.querySelectorAll('.artwork-card');

    if (!lightbox || artworkCards.length === 0) return;

    let currentIndex = 0;
    const artworks = Array.from(artworkCards).map(card => ({
        src: card.querySelector('img').src,
        title: card.querySelector('h3')?.textContent || '',
        description: card.querySelector('.artwork-info p')?.textContent || ''
    }));

    // Open lightbox
    artworkCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            currentIndex = index;
            showImage(currentIndex);
            openLightbox();
        });
    });

    // Close lightbox
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Navigation
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrev();
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showNext();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPrev();
                break;
            case 'ArrowRight':
                showNext();
                break;
        }
    });

    function openLightbox() {
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showImage(index) {
        const artwork = artworks[index];
        lightboxImage.src = artwork.src;
        lightboxImage.alt = artwork.title;
        lightboxTitle.textContent = artwork.title;
        lightboxDescription.textContent = artwork.description;
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + artworks.length) % artworks.length;
        showImage(currentIndex);
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % artworks.length;
        showImage(currentIndex);
    }
}
