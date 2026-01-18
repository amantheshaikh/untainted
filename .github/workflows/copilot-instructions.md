# Untainted - GitHub Copilot Instructions

## Brand Overview

Untainted is a B2B-first personalized product intelligence platform. It's an API-first intelligence layer that helps platforms make safer, smarter, and more personalized food decisions for their users at the moment of purchase.

### Target Audience
- **Primary**: B2B platforms (Quick-commerce, Food delivery, Grocery & Retail, Health & Wellness apps)
- **Secondary**: Individual consumers via mobile app and web

### Market Context
- India-focused product
- Supports Indian dietary preferences (Jain, Sattvic, Vegan, No Maida, etc.)
- Prices in INR (₹)
- References FSSAI compliance and Indian food regulations

---

## Brand Colors

```css
/* Primary */
--brand-brown: #7C6145        /* Primary text and headings */
--brand-brown-dark: #5D4632   /* Darker variant for emphasis */
--brand-orange: #F58220       /* Accent color, CTAs, highlights */
--brand-orange-light: #FF9E4A /* Lighter orange for hover states */

/* Backgrounds */
--cream: #FDF8F3              /* Primary background */
--cream-dark: #F5EDE0         /* Secondary background, cards */
--white: #FFFFFF              /* Card backgrounds, contrast areas */

/* Neutrals */
--text-primary: #7C6145       /* Main body text */
--text-secondary: #8B7355     /* Secondary text, descriptions */
--text-muted: #A89580         /* Muted text, captions */
--border: #E8DFD4             /* Borders, dividers */
```

### Color Usage Rules
- Use warm browns for text, never pure black
- Orange (#F58220) is reserved for primary CTAs, badges, and key highlights
- Cream backgrounds create warmth and approachability
- Maintain high contrast for accessibility
- Green (#22C55E) for success/safe states, Red (#EF4444) for warnings/flags

---

## Typography

### Font Family
- **Primary**: `DM Sans` - Modern, clean, highly readable
- **Fallback**: System sans-serif stack

### Type Scale
```
Hero Heading:     text-5xl md:text-6xl lg:text-7xl font-bold
Section Heading:  text-3xl md:text-4xl font-bold
Subsection:       text-2xl md:text-3xl font-semibold
Card Title:       text-xl font-semibold
Body Large:       text-lg
Body:             text-base
Caption/Small:    text-sm
Code:             font-mono text-sm
```

### Text Colors
- Headings: `text-[#5D4632]` or `text-[#7C6145]`
- Body: `text-[#7C6145]`
- Muted: `text-[#8B7355]`
- On dark backgrounds: `text-white` or `text-white/80`

---

## Design Principles

### Visual Style
1. **Clean and Trustworthy**: Convey safety, purity, and reliability
2. **Warm and Approachable**: Use cream backgrounds and rounded corners
3. **Technical but Accessible**: Show API/code examples in digestible formats
4. **B2B Professional**: Enterprise-ready feel without being cold

### Spacing
- Use consistent spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px
- Section padding: `py-20 md:py-32`
- Container max-width: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Card padding: `p-6` or `p-8`

### Border Radius
- Cards: `rounded-2xl` or `rounded-3xl`
- Buttons: `rounded-full` for primary, `rounded-lg` for secondary
- Badges: `rounded-full`
- Inputs: `rounded-lg`

### Shadows
- Cards: `shadow-lg` with warm undertone
- Elevated elements: `shadow-xl`
- Subtle: `shadow-sm`

---

## Component Patterns

### Buttons
```tsx
// Primary CTA
<Button className="bg-[#F58220] hover:bg-[#E07010] text-white rounded-full px-8 py-3 font-semibold">
  Get Started
</Button>

// Secondary
<Button variant="outline" className="border-[#7C6145] text-[#7C6145] hover:bg-[#7C6145] hover:text-white rounded-full bg-transparent">
  Learn More
</Button>
```

### Cards
```tsx
<div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E8DFD4]">
  {/* Card content */}
</div>
```

### Section Headers
```tsx
<div className="text-center mb-16">
  <span className="text-[#F58220] font-semibold text-sm uppercase tracking-wider">
    Section Label
  </span>
  <h2 className="text-3xl md:text-4xl font-bold text-[#5D4632] mt-4">
    Section Heading
  </h2>
  <p className="text-[#8B7355] text-lg mt-4 max-w-2xl mx-auto">
    Section description text
  </p>
</div>
```

### Code Blocks (API Examples)
```tsx
<div className="bg-[#1a1a2e] rounded-xl p-4 font-mono text-sm">
  <div className="flex gap-2 mb-3">
    <span className="w-3 h-3 rounded-full bg-red-500" />
    <span className="w-3 h-3 rounded-full bg-yellow-500" />
    <span className="w-3 h-3 rounded-full bg-green-500" />
  </div>
  <pre className="text-green-400">
    {/* Code content */}
  </pre>
</div>
```

---

## Content Guidelines

### Voice and Tone
- **Professional but warm**: Not cold corporate speak
- **Confident**: We know our product solves real problems
- **Clear and direct**: No jargon without explanation
- **India-aware**: Use relevant cultural references and examples

### Messaging Hierarchy
1. **Primary**: B2B value proposition (platforms, APIs, integration)
2. **Secondary**: Consumer app features (scanning, profiles, preferences)

### Key Phrases
- "Smarter food decisions"
- "At the moment of purchase"
- "Personalized product intelligence"
- "Decision frameworks" (not templates)
- "Evaluation standards"
- "Intelligence engine"

### Dietary Preferences to Reference
- Vegetarian, Vegan, Jain, Sattvic
- No Maida, No Refined Sugar
- Gluten-free, Lactose-free
- Nut allergies, specific ingredient avoidance

### Avoid
- Naming specific companies (no Zepto, Swiggy, BigBasket, etc.)
- Mentioning Hindi/regional language support (not yet available)
- Using "template" - use "Decision Framework" or "Evaluation Standard"
- Pure black text - always use warm browns
- Cold, sterile design - maintain warmth

---

## Technical Patterns

### Intelligence Engine - Three Core Processes
1. **Normalize**: Converts messy labels, INS/E-codes, synonyms → standardized ingredients
2. **Classify**: Maps ingredients to food taxonomy (ghee → dairy, chicken → meat)
3. **Evaluate**: Compares against dietary preferences, allergies, restrictions, or preset standards

### Input Modes
1. Barcode scan
2. Image/OCR scan of label
3. Direct text input (ingredient list)

## Animation Guidelines

- Use Framer Motion for animations
- Subtle entrance animations: `fadeIn`, `fadeInUp`
- Stagger children animations for lists
- Duration: 0.3-0.6s for most transitions
- Easing: `easeOut` for entrances, `easeInOut` for transitions

```tsx
// Standard fade in up
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5 }}

// Staggered children
variants={{
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}}
```
---

## Do's and Don'ts

### Do
- Use the orange citrus logo consistently
- Show real API examples with realistic responses
- Include flagged_ingredients in verdict outputs
- Reference Indian dietary preferences
- Use phone mockups for consumer features
- Show code snippets for B2B integration

### Don't
- Use company names (Zepto, Swiggy, etc.)
- Mention Hindi/regional languages
- Use pure black (#000000) for text
- Use cold blues or grays as primary colors
- Make consumer features more prominent than B2B
- Use generic stock imagery - prefer illustrations/mockups