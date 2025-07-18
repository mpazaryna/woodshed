# SVG Icon Component

This component provides a flexible way to display SVG icons in your application.

## Basic Usage

```tsx
import { SVGIcon } from "@/components/svg-icon"

// Basic usage with default type (construction)
<SVGIcon />

// Specify a different built-in type
<SVGIcon type="coming-soon" />

// Change the size
<SVGIcon type="maintenance" size="lg" />

// Customize colors
<SVGIcon type="construction" color="#3b82f6" secondaryColor="#9ca3af" />
```

## Available Types

The component comes with several built-in SVG types:

- `construction` (default) - A construction/building icon
- `coming-soon` - A clock/timer icon
- `maintenance` - A tools/wrench icon

## Size Options

You can control the size of the SVG using the `size` prop:

- `sm` - Small (16x16)
- `md` - Medium (24x24)
- `lg` - Large (32x32) (default)
- `xl` - Extra Large (48x48)

## Custom SVGs

You can also provide your own custom SVG content:

```tsx
import { SVGIcon } from "@/components/svg-icon"

const MyComponent = () => {
  const customSVG = (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor"
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )

  return <SVGIcon customSVG={customSVG} size="md" />
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `"construction" \| "coming-soon" \| "maintenance" \| "custom"` | `"construction"` | The type of SVG to display |
| `size` | `"sm" \| "md" \| "lg" \| "xl"` | `"lg"` | The size of the SVG |
| `color` | `string` | `"currentColor"` | The primary color of the SVG |
| `secondaryColor` | `string` | `"#6b7280"` | The secondary color of the SVG (if applicable) |
| `customSVG` | `React.ReactNode` | `undefined` | Custom SVG content to display instead of built-in types |
| `className` | `string` | `""` | Additional CSS classes to apply to the container |

## Example

See the `app/nyi/page.tsx` file for an example of how to use this component in a page.
