# Art Portfolio Website

A minimal, clean portfolio website for showcasing artwork. Built with pure HTML, CSS, and JavaScript - no frameworks or build tools required.

## Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Lightbox Gallery** - Click artwork to view larger with keyboard navigation
- **Clean Typography** - Uses Cormorant Garamond and Inter fonts
- **Fast Loading** - No dependencies, optimized CSS
- **GitHub Pages Ready** - Deploy directly to GitHub Pages

## Quick Start

1. Clone this repository
2. Add your artwork images to the `images/` folder
3. Update the HTML files with your content
4. Push to GitHub and enable GitHub Pages

## File Structure

```
├── index.html          # Gallery page (home)
├── about.html          # About page
├── contact.html        # Contact page
├── css/
│   └── styles.css      # All styles
├── js/
│   └── main.js         # Lightbox & mobile nav
└── images/             # Your artwork images
```

## Customization

### Adding Your Artwork

1. Add images to the `images/` folder (recommended: JPG, optimized for web)
2. In `index.html`, update each artwork card:

```html
<article class="artwork-card" data-index="0">
    <div class="artwork-image">
        <img src="images/your-artwork.jpg" alt="Artwork Title" loading="lazy">
    </div>
    <div class="artwork-info">
        <h3>Your Artwork Title</h3>
        <p>Oil on Canvas, 2024</p>
    </div>
</article>
```

### Updating Your Information

- **Logo/Name**: Change "Artist Name" in the `.logo` link in all HTML files
- **About Page**: Edit `about.html` with your bio and photo
- **Contact Info**: Update email and social links in `contact.html`

### Contact Form Setup

The contact form uses [Formspree](https://formspree.io) for processing. To enable:

1. Create a free account at formspree.io
2. Create a new form and get your form ID
3. Replace `YOUR_FORM_ID` in `contact.html` with your actual ID

### Custom Domain

To use your own domain with GitHub Pages:

1. In your repository settings, go to Pages
2. Add your custom domain
3. Create a `CNAME` file in the root with your domain name

## Deploying to GitHub Pages

1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Set source to "main" branch, root folder
4. Your site will be live at `https://username.github.io/repository-name`

## Image Recommendations

- **Format**: JPG for artwork, PNG for logo if needed
- **Size**: Max 1500-2000px on longest side for gallery images
- **Optimization**: Use tools like TinyJPG to compress images
- **Aspect Ratio**: 4:5 works best with the gallery grid

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge).

## License

Free to use and modify for personal projects.
