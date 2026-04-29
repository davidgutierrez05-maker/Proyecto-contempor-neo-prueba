---
name: Contemporánica
colors:
  surface: '#051424'
  surface-dim: '#051424'
  surface-bright: '#2c3a4c'
  surface-container-lowest: '#010f1f'
  surface-container-low: '#0d1c2d'
  surface-container: '#122131'
  surface-container-high: '#1c2b3c'
  surface-container-highest: '#273647'
  on-surface: '#d4e4fa'
  on-surface-variant: '#dcc0bf'
  inverse-surface: '#d4e4fa'
  inverse-on-surface: '#233143'
  outline: '#a48b8a'
  outline-variant: '#564241'
  surface-tint: '#ffb3b1'
  primary: '#ffb3b1'
  on-primary: '#620f17'
  primary-container: '#e57373'
  on-primary-container: '#5e0c15'
  inverse-primary: '#a03e40'
  secondary: '#bec6e0'
  on-secondary: '#283044'
  secondary-container: '#3f465c'
  on-secondary-container: '#adb4ce'
  tertiary: '#bcc7de'
  on-tertiary: '#263143'
  tertiary-container: '#8b96ac'
  on-tertiary-container: '#242f41'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad8'
  primary-fixed-dim: '#ffb3b1'
  on-primary-fixed: '#410007'
  on-primary-fixed-variant: '#80272b'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#d8e3fb'
  tertiary-fixed-dim: '#bcc7de'
  on-tertiary-fixed: '#111c2d'
  on-tertiary-fixed-variant: '#3c475a'
  background: '#051424'
  on-background: '#d4e4fa'
  surface-variant: '#273647'
typography:
  display-xl:
    fontFamily: Outfit
    fontSize: 64px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Outfit
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Outfit
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Outfit
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1440px
  gutter: 24px
---

## Brand & Style
The brand identity for this design system is rooted in the intersection of traditional musicology and high-end digital modernity. It targets a discerning audience of curators, composers, and collectors who value precision and aesthetic quietude.

The design style is a hybrid of **Modern Minimalism** and **Glassmorphism**. It prioritizes vast negative space and structural clarity to allow the music catalog imagery to breathe. By utilizing translucent layers and frosted surfaces, the interface achieves a sense of physical depth without clutter, evoking the feel of a premium physical gallery or a high-end audio hardware interface.

## Colors
The palette is anchored by **Midnight Blue (#0F172A)**, providing a deep, cinematic canvas that reduces eye strain and enhances the vibrancy of album art. The primary accent is **Salmon/Coral (#E57373)**, used sparingly for critical actions and high-level navigation markers to maintain a premium feel.

Secondary surfaces utilize a lighter navy for tonal layering, while micro-gradients are applied to call-to-action elements to provide a subtle 3D lift. The logo resides on a true black circle to provide a definitive visual anchor within the midnight environment.

## Typography
This design system utilizes **Outfit** for its geometric clarity and open apertures, which mirror the modern classical aesthetic. Headlines use tighter tracking and heavier weights to command authority, while body text maintains a generous line height for maximum legibility against the dark background. 

Label styles are frequently set in uppercase with increased letter spacing to serve as organizational metadata, ensuring the catalog feels like a professional archival tool.

## Layout & Spacing
The layout follows a **Fixed Grid** model for desktop viewports, centering content within a 1440px container to ensure a focused, editorial experience. A 12-column system is used with 24px gutters.

Spacing rhythm is strictly based on an 8px scale. High-level sections are separated by large "air gaps" (80px) to distinguish between different catalog categories, while interactive elements are grouped with tighter 12px or 24px increments to signify relationship and functional unity.

## Elevation & Depth
Hierarchy is established through **Backdrop Blurs** and **Tonal Layering**. 
- **Level 0 (Background):** Solid Midnight Blue.
- **Level 1 (Cards/Containers):** Semi-transparent surfaces (70-80% opacity) with a 20px backdrop-blur and a 1px subtle white stroke (10% opacity) to define edges.
- **Level 2 (Modals/Popovers):** Deeper shadows (25% opacity, 40px blur) and higher transparency to create a floating "glass" effect.

Micro-gradients are applied to primary buttons to give them a "soft-lit" appearance, mimicking the glow of a high-end audio interface.

## Shapes
The shape language is consistently **Rounded**. Avoid sharp corners to maintain the sophisticated, approachable nature of the brand. Standards are set at 0.5rem for small components, with larger containers and album art containers utilizing 1rem (16px) to create a soft, premium frame. Search bars and category chips utilize pill-shaped radii (2rem) to distinguish them from structural content containers.

## Components
- **Buttons:** Primary buttons use the Salmon gradient with white text. Secondary buttons are "ghost" style with a glass background and a 1px border.
- **Cards:** Use a glassmorphic background with 16px padding. Images within cards should have a 12px radius.
- **Input Fields:** Darker than the background (#0B1222) with a Salmon-colored 1px border focus state. Use Outfit Medium for placeholder text.
- **Chips/Tags:** Small, pill-shaped with a 10% Salmon background tint and 100% Salmon text for active states.
- **Music Player Bar:** A persistent, full-width glassmorphic bar at the bottom of the viewport with a 40px backdrop-blur and a subtle top-border separator.
- **Audio Visualizers:** Integrated micro-animations using Salmon-colored bars with varied heights to indicate active playback.