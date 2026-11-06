# Deluxe Vintage Christmas Cookies

A standalone, responsive holiday website for GitHub Pages. No third-party website builder, embed iframe, framework, Node, or build tools required.

## Pages
- `index.html` — home page with hero, vintage GIF, welcome, holiday story, recipe links, and seasonal greeting.
- `recipes.html` — original sugar-cookie and icing recipes, Christmas countdown, interactive ingredient and shopping lists, print styles.
- `css/styles.css` — all styling, responsive behavior, and print rules.
- `js/site.js` — mobile menu, persistent checklists, countdown, print button.
- `assets/christmas-card.png` — included vintage title card.

## Customize images

1. **Hero image (PLACEHOLDER):** In `css/styles.css`, near the top, find `--hero-image:none`. Change it to `--hero-image:url('https://YOUR-HOST/YOUR-HERO-IMAGE.jpg')`. This is the large Christmas cookie/tree hero illustration from the original site. Until replaced, a warm Christmas-themed gradient displays as a fallback.
2. **Welcome animation:** In `index.html`, the GIF uses your corrected URL: `https://i.postimg.cc/tRhtRrcj/In-Shot-20261106-101318757.gif`. Replace the `src` if that changes.
3. **Holiday greeting card:** `assets/christmas-card.png` is included already. Replace the file to change the picture.
4. **Cookie thumbnails:** The recipe teasers currently use CSS decorative placeholders. You can replace the `.teaser-art` blocks in `index.html` with your cookie photographs at any time.
5. **Logo:** The logo is currently a stylized CSS badge, rather than the existing Google Sites icon. Replace `.brand-mark` in both HTML pages with your own image if desired.

## Publish using GitHub Pages

1. Create a new **public GitHub repository**, e.g. `deluxe-christmas-cookies`.
2. Upload the **contents of this folder** to the repository root (`index.html` must be at the root, not inside an extra nested folder).
3. In GitHub repository **Settings → Pages**, choose **Deploy from a branch**; select `main` and `/ (root)`; save.
4. Once published, your URL will normally be `https://YOUR-USERNAME.github.io/deluxe-christmas-cookies/`.
5. When editing, commit changes to the `main` branch and GitHub Pages republishes them.

All links between pages are relative, so this works both at a GitHub project URL and a custom domain.

## Guestbook

The existing Google Form remains linked at:
`https://docs.google.com/forms/d/e/1FAIpQLSepD3KOEROYPCmtr9J_5tR6kHB3oXomEkwlmHyR0JxOsneLbQ/viewform`

It opens separately; the website never embeds it inside a scrolling frame.

## Notes

- The shopping and recipe checklists save state in the visitor's browser using `localStorage`. They are not shared between devices.
- The countdown uses each visitor's local time and rolls forward after Christmas.
- The ingredient amounts and instructions were transcribed from the screenshot of the original website. Please compare with your original recipe before publication.
- Google Fonts requires an internet connection; Georgia and system fonts are fallbacks.
- No analytics, cookies from this site, signup, ads, or commercial features.
