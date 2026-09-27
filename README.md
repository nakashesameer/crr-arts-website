# CRR Arts — www.crrarts.com

Art portfolio of Chandrakant R Raut. A static site built with [Eleventy](https://www.11ty.dev/)
and deployed to GitHub Pages by GitHub Actions.

## Local development

Requires Node.js 22+ (`brew install node`).

```sh
npm install      # once
npm run dev      # preview at http://localhost:8080, reloads on save
npm run build    # production build into _site/
```

## Project layout

```
src/
├── _data/
│   ├── artworks.json      # the gallery — one entry per painting
│   └── site.json          # site name, URL, navigation
├── _includes/layouts/
│   └── base.njk           # shared <head>, header/nav, footer
├── index.njk              # Gallery
├── about.njk              # About
├── accomplishments.njk    # Accomplishments
├── contact.njk            # Visitor comments (Firebase)
├── css/styles.css
├── js/main.js             # gallery "Load More", lightbox, mobile nav
├── js/comments.js         # Firestore comments + App Check
├── sw.njk                 # service worker (cache versioned per build)
├── images/                # ORIGINAL full-size images (never edit output)
├── icons/  manifest.json  CNAME
eleventy.config.js         # build config + image shortcodes
firestore.rules            # Firestore security rules (source of truth)
.github/workflows/         # build on PRs, build + deploy on main
```

`_site/` and `node_modules/` are generated — never edit or commit them.

## Adding a painting

1. Copy the original photo into `src/images/` (e.g. `artwork-50.jpg`). Full size is fine;
   the build creates optimized WebP/JPEG versions automatically.
2. Add an entry to `src/_data/artworks.json` in the position it should appear:
   ```json
   {
     "filename": "artwork-50.jpg",
     "title": "Sunset over Sahyadri",
     "medium": "Oil on canvas",
     "year": "2026",
     "orientation": "landscape"
   }
   ```
   `orientation` is `portrait` (4:5 card) or `landscape` (5:4 card). Title, medium and
   year are optional; the title is used as the image's alt text. They show as a
   lightbox caption only if `SHOW_CAPTIONS` is turned on in `eleventy.config.js`.
3. Preview with `npm run dev`, then open a pull request (below).

To use an image elsewhere on a page: `{% image "file.jpg", "Alt text", "sizes" %}`.

## Making changes

`main` is what's live. Every change goes through a pull request:

1. `git checkout -b my-change`
2. Edit, preview with `npm run dev`
3. Commit, `git push -u origin my-change`, open a PR on GitHub
4. The **Build and deploy** check builds the site on the PR
5. Merge → GitHub Actions builds and deploys to www.crrarts.com in ~2 minutes

## Comments (Firebase)

See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for Firestore rules, App Check and API key setup.
