// Theme colours for Tailwind. Each one reads a CSS variable from app/css/theme.scss,
// so switching data-theme on <html> recolours the whole site.
// pink/violet only override the shades the site uses; every other shade stays Tailwind's default.
const v = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

module.exports = {
  page: v("page"),
  deep: v("deep"),
  surface: v("surface"),
  raised: v("raised"),
  line: v("line"),
  edge: v("edge"),
  accent: v("accent"),
  soft: v("soft"),
  muted: v("muted"),
  pink: { 500: v("pink-500"), 600: v("pink-600") },
  violet: { 100: v("violet-100"), 400: v("violet-400"), 500: v("violet-500"), 600: v("violet-600") },
};
