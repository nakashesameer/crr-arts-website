import Image, { generateHTML } from "@11ty/eleventy-img";

const IMAGE_OPTIONS = {
    widths: [480, 960, 1920],
    formats: ["webp", "jpeg"],
    outputDir: "_site/img/",
    urlPath: "/img/",
};

// Show title / medium / year in the lightbox caption (titles are always used as alt text)
const SHOW_CAPTIONS = false;

const escapeAttr = (value = "") =>
    String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// Responsive <picture> for any image in src/images
async function image(filename, alt, sizes = "100vw", extraAttrs = {}) {
    const metadata = await Image(`src/images/${filename}`, IMAGE_OPTIONS);
    return generateHTML(metadata, { alt, sizes, loading: "lazy", decoding: "async", ...extraAttrs });
}

// Gallery card for one entry in _data/artworks.json
async function artworkCard(artwork) {
    const metadata = await Image(`src/images/${artwork.filename}`, IMAGE_OPTIONS);
    const full = metadata.webp[metadata.webp.length - 1].url;
    const alt = artwork.title || "Painting by Chandrakant R Raut";
    const title = SHOW_CAPTIONS ? artwork.title || "" : "";
    const description = SHOW_CAPTIONS ? [artwork.medium, artwork.year].filter(Boolean).join(", ") : "";
    const picture = generateHTML(metadata, {
        alt,
        sizes: "(max-width: 768px) 100vw, 400px",
        loading: "lazy",
        decoding: "async",
    });
    const landscape = artwork.orientation === "landscape" ? " landscape" : "";

    return `<article class="artwork-card${landscape}" data-full="${full}" data-title="${escapeAttr(title)}" data-description="${escapeAttr(description)}">
    <div class="artwork-image">${picture}</div>
</article>`;
}

export default function (eleventyConfig) {
    eleventyConfig.addAsyncShortcode("image", image);
    eleventyConfig.addAsyncShortcode("artworkCard", artworkCard);

    // Build timestamp, used to version the service worker cache
    eleventyConfig.addGlobalData("buildTime", () => Date.now());

    // Copied as-is (images are processed on demand by the shortcodes above)
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/js");
    eleventyConfig.addPassthroughCopy("src/icons");
    eleventyConfig.addPassthroughCopy("src/manifest.json");
    eleventyConfig.addPassthroughCopy("src/CNAME");
    eleventyConfig.addPassthroughCopy("src/images/*.MP4");

    return {
        dir: {
            input: "src",
            output: "_site",
        },
        templateFormats: ["njk"],
        htmlTemplateEngine: "njk",
    };
}
