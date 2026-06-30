---
name: Neon Forest
colors:
  surface: '#f9f9fc'
  surface-dim: '#dadadc'
  surface-bright: '#f9f9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f6'
  surface-container: '#eeeef0'
  surface-container-high: '#e8e8ea'
  surface-container-highest: '#e2e2e5'
  on-surface: '#1a1c1e'
  on-surface-variant: '#424843'
  inverse-surface: '#2f3133'
  inverse-on-surface: '#f0f0f3'
  outline: '#727973'
  outline-variant: '#c2c8c1'
  surface-tint: '#466552'
  primary: '#001308'
  on-primary: '#ffffff'
  primary-container: '#0a2a1a'
  on-primary-container: '#72937d'
  inverse-primary: '#accfb7'
  secondary: '#416900'
  on-secondary: '#ffffff'
  secondary-container: '#b7f569'
  on-secondary-container: '#457000'
  tertiary: '#0d1011'
  on-tertiary: '#ffffff'
  tertiary-container: '#222526'
  on-tertiary-container: '#8a8c8d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c7ebd2'
  primary-fixed-dim: '#accfb7'
  on-primary-fixed: '#012112'
  on-primary-fixed-variant: '#2e4d3b'
  secondary-fixed: '#b7f569'
  secondary-fixed-dim: '#9dd850'
  on-secondary-fixed: '#102000'
  on-secondary-fixed-variant: '#304f00'
  tertiary-fixed: '#e1e3e4'
  tertiary-fixed-dim: '#c5c7c8'
  on-tertiary-fixed: '#191c1d'
  on-tertiary-fixed-variant: '#454748'
  background: '#f9f9fc'
  on-background: '#1a1c1e'
  surface-variant: '#e2e2e5'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.03em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 48px
  margin-mobile: 20px
---

## Brand & Style
The design system embodies "High-Energy Professionalism," a fusion of institutional stability and disruptive digital-native energy. It targets a demographic that values both the security of a traditional bank and the velocity of a tech startup. 

The aesthetic is **Modern Corporate with Glassmorphic accents**. It utilizes a sophisticated dark-to-vibrant color contrast to create a premium, editorial feel. High-quality whitespace, crisp geometric typography, and tactile surface treatments evoke an emotional response of trust, clarity, and forward-thinking innovation.

## Colors
The palette is built on a foundation of high-contrast greens. The **Primary Dark Green** acts as the anchor, used for headers, text, and deep backgrounds to provide a sense of grounded luxury. The **Primary Bright Green** is the "electric" highlight, used sparingly for calls-to-action, active states, and focus indicators to inject Gen-Z vitality.

Surface colors rely on a clean hierarchy:
- **Background:** A soft off-white to reduce eye strain compared to pure white.
- **Surface:** Pure white for elevated interactive cards.
- **Glass:** Semi-transparent variations of the background for floating elements.

## Typography
This design system utilizes **Plus Jakarta Sans** for headlines to provide a soft, modern geometric character. Tight kerning (letter-spacing) is applied to all heading levels to create a "locked-in," impactful editorial look.

**Inter** is utilized for all functional text, body copy, and labels. Its neutral, systematic nature ensures high legibility for complex financial data and transactional details. On mobile, headlines scale down slightly to maintain optimal line wrapping while preserving the bold typographic hierarchy.

## Layout & Spacing
The layout follows a **12-column fluid grid** for desktop and a **4-column grid** for mobile. Spacing is based on an 8px rhythmic scale. 

Content is grouped into logical sections using wide gutters (24px) to emphasize the "card-on-surface" architecture. Large margins on desktop (48px) create a luxurious, airy feel that prevents the UI from feeling cluttered. On mobile, margins are tightened to 20px to maximize the screen real estate for financial charts and lists.

## Elevation & Depth
Depth is expressed through a combination of **Ambient Shadows** and **Glassmorphism**:

1.  **Level 1 (Cards):** Surface-white cards use a very soft, diffused shadow (`0px 12px 24px rgba(0, 0, 0, 0.05)`) to appear gently lifted from the off-white background.
2.  **Level 2 (Navigation/Floating Elements):** Elements like bottom navigation bars or summary overlays use a glassmorphic effect—a semi-transparent white background (`rgba(255, 255, 255, 0.7)`) combined with a `20px` backdrop blur.
3.  **Contrast Borders:** For interactive elements on dark backgrounds, a low-opacity `1px` border of the Primary Bright Green may be used to define edges without adding heavy shadows.

## Shapes
The shape language is defined by **High Circularity**. Standard cards use a radius of 24px, while larger containers (like hero sections or modal overlays) scale up to 32px. 

Buttons, tags, and input fields utilize a **full pill-shape (Level 3)**. This approach softens the overall aesthetic, making the financial platform feel approachable and "human," contrasting with the sharp, technical nature of traditional banking software.

## Components
- **Buttons:** Primary buttons are pill-shaped, filled with Primary Dark Green or Bright Green depending on prominence. Text is always centered and uppercase for labels.
- **Input Fields:** Large, pill-shaped containers with a background of pure white and a subtle 1px border. Focus states transition the border to Primary Bright Green.
- **Cards:** The primary container for information. Always pure white with a 24px-32px border radius and a soft shadow. No borders should be used on cards when placed on the off-white background.
- **Chips/Status:** Small pill-shaped indicators. For "Growth/Success," use Soft Green background with Dark Green text. For "Alerts/Spend," use Soft Red with Dark Red text.
- **Floating Nav:** A glassmorphic bar anchored to the bottom of the screen with a 32px radius and high backdrop-blur, ensuring visibility over scrollable content.
- **Charts:** Use the Primary Bright Green for positive data trends and Primary Dark Green for secondary data series, maintaining a minimal, "clean-data" aesthetic.