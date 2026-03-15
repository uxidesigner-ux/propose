# propose

Astro-based static corporate site + blog + GitHub-only report publishing platform.

Configured production URL: `https://uxidesigner-ux.github.io/propose/`

## Tech Stack
- Astro (static output)
- TypeScript where useful
- Astro Content Collections for blog
- Local JSON/TS data files for editable content
- GitHub Pages deployment via GitHub Actions

## Project Structure
- `public/images`, `public/icons`: replacement-safe local assets
- `src/components/`: layout + page domain components
- `src/content/blog/`: Markdown blog posts
- `src/content/reports/`: JSON report source files
- `src/data/`: editable structured data (navigation/services/projects/clients/testimonials/contact/site)
- `src/lib/reportRenderer.ts`: shared report block renderer + chart validation
- `src/pages/`: all routes including `/admin`, `/reports`, and corporate pages
- `.github/workflows/deploy-pages.yml`: GitHub Pages deployment

## Routes
- `/` home
- `/about`
- `/services`
- `/projects`
- `/clients`
- `/culture-careers`
- `/blog`
- `/blog/[slug]`
- `/contact`
- `/privacy-policy`
- `/terms`
- `/admin` (report JSON builder)
- `/reports`
- `/reports/[slug]`

## Local Development
```bash
npm install
npm run dev
```

Validation:
```bash
npm run check
npm run build
npm run preview
```

## Editing Content
### Blog posts
1. Add a markdown file in `src/content/blog/`.
2. Include frontmatter:
   - `title`, `description`, `category`, `pubDate`, `author`

### Corporate site data
Edit files in `src/data/`:
- `site.ts`
- `navigation.ts`
- `services.ts`
- `projects.ts`
- `clients.ts`
- `testimonials.ts`
- `contact.ts`

### Reports (GitHub-only MVP)
1. Open `/admin` and compose report JSON (supports draft save + import/export + preview).
2. Export JSON.
3. Save file to `src/content/reports/<slug>.json`.
4. Commit + push to GitHub.
5. GitHub Actions builds and publishes static pages.

### Block types
Supported report blocks:
- `hero`
- `rich-text`
- `kpi-grid`
- `table`
- `timeline`
- `quote-cards`
- `chart`
- `accordion`
- `cta-link`

Common block fields:
`id`, `type`, `sectionId`, `navLabel`, `visibleInNav`, `title`, `description`, `styleVariant`, `order`

Chart blocks are validated for labels/datasets length consistency and surface errors in preview and browser console.

## GitHub Pages Deployment
- Workflow file: `.github/workflows/deploy-pages.yml`
- Astro config:
  - `site: 'https://uxidesigner-ux.github.io'`
  - `base: '/propose/'`

If the repository name changes, **you must update `base` in `astro.config.mjs`** to match the new repository path.

## GitHub-only MVP limitations
- No DB, backend, or CMS.
- `/admin` cannot write to GitHub at runtime.
- Publish flow is commit-based (JSON file in repo + CI build).

## Remaining manual tasks
- Replace placeholder copy and imagery.
- Optionally connect contact form to your preferred provider.
- Add more report templates or stricter JSON schema validation if needed.
