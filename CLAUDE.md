# CRR Arts website — notes for Claude

Portfolio for artist Chandrakant R Raut, live at www.crrarts.com.
Read README.md for layout, commands and how to add a painting.

## Workflow
- `main` is live and auto-deploys via `.github/workflows/deploy.yml`. Never commit to `main`
  directly: branch, push, open a PR. Ask before pushing or merging.
- Run `npm run build` before committing; it must succeed. There is no browser in cloud
  sessions, so describe visual changes clearly in the PR for the maintainer to preview.
- Commit message style: `crrarts-<mon>-<yy>-<n> Summary` (e.g. `crrarts-sep-26-2 Add new paintings`).

## Conventions
- Pages are Nunjucks (`src/*.njk`) with `layouts/base.njk`. Shared markup goes in the layout.
- Images: originals live in `src/images/`; always reference them through the `image` or
  `artworkCard` shortcodes so they get resized. Never commit `_site/`.
- Gallery order = order in `src/_data/artworks.json`.
- Keep the site dependency-free at runtime (plain JS/CSS, no frameworks).
- `firestore.rules` is the source of truth for Firestore rules; after changing it, the
  maintainer must publish it in the Firebase console.
- About page text is written by the family — don't reword it unless asked.

## Roadmap (agreed plan)
1. ✅ Security hardening (Firestore rules, App Check, API key restriction, rulesets)
2. Eleventy migration + image optimization + Actions deploy
3. CI checks (HTML validation, link check, artworks.json schema), Dependabot, require PR checks
4. Move exhibition videos out of git (YouTube/Vimeo), optional history cleanup
5. SEO/sharing (Open Graph, sitemap, 404), accessibility, lightbox captions/titles
