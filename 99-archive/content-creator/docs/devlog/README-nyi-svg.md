# NYI (Not Yet Implemented) SVG Component

This component provides a custom SVG illustration for "Not Yet Implemented" or "Coming Soon" pages in the Content Creator application.

## Basic Usage

```tsx
import { NYISVG } from "@/components/nyi-svg"

// Basic usage with default text
<NYISVG />

// Customize size
<NYISVG width={600} height={375} />

// Customize text
<NYISVG 
  title="Feature Under Development" 
  subtitle="We're working hard to bring you this feature soon."
  ragText="Part of our Q3 development roadmap"
/>
```

## Component Preview

The component displays a visually appealing SVG with:
- Content Creator logo/icon
- Customizable title and subtitle text
- Decorative elements (dots)
- Customizable roadmap text with a teal underline

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number` | `800` | The width of the SVG |
| `height` | `number` | `500` | The height of the SVG |
| `title` | `string` | `"This Feature is Coming Soon"` | The main title text |
| `subtitle` | `string` | `"We're working on adding this functionality to Content Creator."` | The subtitle text |
| `ragText` | `string` | `"Part of our Retrieval-Augmented Generation roadmap"` | The roadmap text at the bottom |
| `className` | `string` | `""` | Additional CSS classes to apply to the container |

## Example

See the `app/nyi/page.tsx` file for an example of how to use this component in a page.
