# Styling Rules

## Tailwind configuration (`tailwind.config.js`)
The Tailwind `base` layer is **disabled** (`corePlugins: { preflight: false }`). Only `utilities` and `components` are enabled. Do not rely on Tailwind's CSS reset — all element base styles must be in `src/index.css`.

## Brand token
| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#4D0B5E` | Brand purple — use `bg-primary`, `text-primary`, `border-primary` |

Never hardcode `#4D0B5E` in JSX or CSS. Use the `primary` theme token.

## Custom breakpoints
The project extends Tailwind's default breakpoints with smaller ones:

| Name | Value |
|------|-------|
| `xxsm` | (see tailwind.config.js) |
| `xsm` | (see tailwind.config.js) |

Use these for very small screen edge cases before reaching the standard `sm` breakpoint.

## Custom shadows
`shadow-evenly`, `shadow-info`, `shadow-testimonial-card` — defined in the theme. Use these instead of arbitrary shadow values.

## Font
The project uses **Cabin** (preloaded in `public/index.html`). Do not add `font-sans` or other font-family utilities that would override it.

## Inline styles
Only use `style={{}}` for values that are genuinely dynamic at runtime (e.g., a colour from user data). All static styling must use Tailwind utilities.

## Global styles
`src/index.css` owns base element styles and any CSS that cannot be expressed as Tailwind utilities. Keep it minimal.
