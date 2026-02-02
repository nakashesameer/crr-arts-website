/**
 * Art Portfolio - Main JavaScript
 */

// Configuration
const ITEMS_PER_PAGE = 6; // Number of artworks to show initially and per "Load more" click

document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Mobile Navigation
    initMobileNav();

    // Gallery with progressive loading (only on gallery page)
    if (document.querySelector('.gallery-grid')) {
        loadGalleryData();
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
 * Load gallery data from JSON file
 */
async function loadGalleryData() {
    const galleryGrid = document.getElementById('gallery-grid');

    try {
        const response = await fetch('data/artworks.json');
        if (!response.ok) {
            throw new Error('Failed to load artwork data');
        }
        const data = await response.json();

        // Generate artwork cards from JSON data
        data.artworks.forEach(artwork => {
            const card = createArtworkCard(artwork);
            galleryGrid.appendChild(card);
        });

        // Initialize gallery after cards are created
        initGallery();
    } catch (error) {
        console.error('Error loading gallery:', error);
        galleryGrid.innerHTML = '<p class="error-message">Failed to load gallery. Please refresh the page.</p>';
    }
}

/**
 * Create an artwork card element
 */
function createArtworkCard(artwork) {
    const article = document.createElement('article');
    article.className = 'artwork-card';

    // Add orientation class (defaults to portrait if not specified)
    if (artwork.orientation === 'landscape') {
        article.classList.add('landscape');
    }

    // Format the description (medium and year)
    let description = artwork.medium || '';
    if (artwork.year) {
        description += description ? `, ${artwork.year}` : artwork.year;
    }

    article.innerHTML = `
        <div class="artwork-image">
            <img src="images/${artwork.filename}" alt="${artwork.title}" loading="lazy">
        </div>
        <div class="artwork-info">
            <h3>${artwork.title}</h3>
            <p>${description}</p>
        </div>
    `;

    return article;
}

/**
 * Gallery with Progressive Loading and Lightbox
 */
function initGallery() {
    const galleryGrid = document.getElementById('gallery-grid');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const galleryCount = document.getElementById('gallery-count');
    const artworkCards = Array.from(galleryGrid.querySelectorAll('.artwork-card'));

    let visibleCount = 0;
    const totalCount = artworkCards.length;

    // Initially hide all cards
    artworkCards.forEach(card => {
        card.classList.add('hidden');
    });

    // Show initial batch
    showMoreItems();

    // Load more button click handler
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', showMoreItems);
    }

    function showMoreItems() {
        const nextBatch = artworkCards.slice(visibleCount, visibleCount + ITEMS_PER_PAGE);

        nextBatch.forEach((card, index) => {
            // Stagger the animation
            setTimeout(() => {
                card.classList.remove('hidden');
                card.classList.add('fade-in');
            }, index * 100);
        });

        visibleCount += nextBatch.length;
        updateUI();
    }

    function updateUI() {
        // Update count display
        if (galleryCount) {
            galleryCount.textContent = `Showing ${visibleCount} of ${totalCount} artworks`;
        }

        // Hide button if all items are visible
        if (loadMoreBtn) {
            if (visibleCount >= totalCount) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'inline-block';
            }
        }
    }

    // Initialize lightbox
    initLightbox(artworkCards);
}

/**
 * Lightbox Gallery
 */
function initLightbox(artworkCards) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    if (!lightbox || artworkCards.length === 0) return;

    let currentIndex = 0;

    // Get artwork data from cards
    function getArtworks() {
        return artworkCards
            .filter(card => !card.classList.contains('hidden'))
            .map(card => ({
                src: card.querySelector('img').src,
                title: card.querySelector('h3')?.textContent || '',
                description: card.querySelector('.artwork-info p')?.textContent || ''
            }));
    }

    // Open lightbox when clicking a visible card
    artworkCards.forEach(card => {
        card.addEventListener('click', () => {
            if (card.classList.contains('hidden')) return;

            const visibleCards = artworkCards.filter(c => !c.classList.contains('hidden'));
            currentIndex = visibleCards.indexOf(card);
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
        const artworks = getArtworks();
        if (artworks.length === 0) return;

        const artwork = artworks[index];
        lightboxImage.src = artwork.src;
        lightboxImage.alt = artwork.title;
        lightboxTitle.textContent = artwork.title;
        lightboxDescription.textContent = artwork.description;
    }

    function showPrev() {
        const artworks = getArtworks();
        currentIndex = (currentIndex - 1 + artworks.length) % artworks.length;
        showImage(currentIndex);
    }

    function showNext() {
        const artworks = getArtworks();
        currentIndex = (currentIndex + 1) % artworks.length;
        showImage(currentIndex);
    }
}
