# Propertifi Landing Page

A modern, high-performance landing page for Propertifi - an AI-powered platform for connecting property owners with property managers.

## Features

### Modern Tech Stack
- **React 19.2** - Latest React with improved performance
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework with custom configuration
- **Framer Motion** - Professional animations and micro-interactions
- **PostCSS & Autoprefixer** - Modern CSS processing

### Design Highlights
- **Glassmorphism Effects** - Modern frosted glass UI elements
- **Gradient Backgrounds** - Eye-catching gradients and animated orbs
- **Smooth Animations** - Scroll-triggered animations and micro-interactions
- **Responsive Design** - Mobile-first approach with breakpoints at 1230px, 990px, 830px, 768px, 630px, 480px
- **Scroll Progress Indicator** - 3px orange progress bar at the top
- **Sticky Header** - Persistent navigation with backdrop blur effect
- **Custom Typography** - Manrope font with clear hierarchy (36px H1, 30px H2, 17.65px body)

### Performance Optimizations
- **Lazy Loading** - Images and components load on demand
- **Code Splitting** - Optimized bundle sizes
- **Optimized Animations** - 60fps smooth animations using Framer Motion
- **Production Build** - Tailwind CSS purging removes unused styles
- **Modern Build Process** - Vite for optimal bundle sizes

### Accessibility
- **ARIA Labels** - Proper labeling for screen readers
- **Keyboard Navigation** - Full keyboard support
- **Focus Visible States** - Clear focus indicators
- **Semantic HTML** - Proper heading hierarchy and structure

## Project Structure

```
propertifi-landing-page/
├── components/
│   ├── Header.tsx              # Sticky navigation with animations
│   ├── Hero.tsx                # Hero section with lead form
│   ├── HowItWorks.tsx          # 4-step process with connecting lines
│   ├── WhyChooseUs.tsx         # Feature cards with glassmorphism
│   ├── PropertyTypes.tsx       # Property type grid
│   ├── Connect.tsx             # State/city filters with map placeholder
│   ├── Partners.tsx            # Partner logos
│   ├── Testimonials.tsx        # Customer testimonials
│   ├── News.tsx                # Latest news/blog posts
│   ├── CtaSection.tsx          # Call-to-action section
│   ├── Faq.tsx                 # Frequently asked questions
│   ├── Contact.tsx             # Contact form
│   ├── Footer.tsx              # Site footer
│   ├── ScrollProgress.tsx      # Scroll progress indicator
│   └── icons/                  # Icon components
├── index.css                   # Tailwind directives and custom styles
├── index.tsx                   # React entry point
├── App.tsx                     # Main app component
├── index.html                  # HTML template
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

## Installation

### Prerequisites
- Node.js 18+ or higher
- npm or yarn package manager

### Setup

1. **Install Dependencies**
   ```bash
   cd propertifi-landing-page
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   The site will be available at `http://localhost:3000`

3. **Build for Production**
   ```bash
   npm run build
   ```
   Production files will be in the `dist/` folder

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

## Configuration

### Tailwind CSS

The custom Tailwind configuration includes:

**Color Palette**
- `propertifi-blue` - Primary blue (#3B82F6)
- `propertifi-orange` - Accent orange (#fc982d)
- `propertifi-gray` - Neutral grays (100, 200, 500, 700, 900)

**Typography**
- Font: Manrope (400, 500, 600, 700, 800 weights)
- Heading hierarchy with custom classes
- 194% line-height for body text

**Custom Animations**
- `fade-in` - Smooth fade-in effect
- `slide-up` - Slide up with fade
- `slide-down` - Slide down with fade
- `scale-in` - Scale in with fade
- `pulse-slow` - Slow pulsing effect

**Glassmorphism**
- `.glass` - Light glassmorphism effect
- `.glass-dark` - Dark glassmorphism effect

### Component Customization

Each component is designed to be easily customizable:

1. **Colors** - Modify `tailwind.config.js`
2. **Animations** - Adjust Framer Motion variants in components
3. **Content** - Update text and images in component files
4. **Layout** - Modify grid layouts and spacing

## Design Inspiration

This landing page combines:
- Clean, professional design from ipropertymanagement.com
- Modern glassmorphism and gradient effects
- Smooth animations and micro-interactions
- Clear information hierarchy
- Trust-building elements (ratings, stats, testimonials)

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Metrics

Target metrics:
- First Contentful Paint: < 1.8s
- Time to Interactive: < 3.9s
- Cumulative Layout Shift: < 0.1
- Bundle Size: < 200KB gzipped
- 60fps animations and scrolling

## Future Enhancements

Planned improvements:
- [ ] Interactive Leaflet map in Connect section
- [ ] Video integration in Hero or How It Works
- [ ] Dark mode toggle
- [ ] Custom illustrations instead of placeholders
- [ ] Advanced search functionality
- [ ] Property manager profiles
- [ ] Live chat integration

## Contributing

1. Follow the existing code style
2. Use TypeScript for all new components
3. Ensure responsive design across all breakpoints
4. Test animations for 60fps performance
5. Maintain accessibility standards

## License

Proprietary - Propertifi

## Contact

For questions or support, contact the Propertifi development team.
