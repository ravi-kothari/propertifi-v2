# Propertifi SEO-Optimized Landing Pages & PM Marketplace UX Design

**Date:** November 28, 2025
**Status:** UX Design Specification
**Category:** Strategy
**Focus:** State/City/Zipcode Landing Pages & Property Manager Discovery

---

## Executive Summary

This document provides comprehensive UX design specifications for Propertifi's property manager marketplace, optimized for SEO and user engagement. The design addresses:

1. **925 Property Managers** across **32 cities** in California and Florida
2. **Data Quality Challenges**: 65% have BBB ratings, 50%+ missing fees, 100% missing emails
3. **SEO-Optimized Landing Pages** for State → City → Individual PM profiles
4. **Lead Distribution UI** for tiered matching system
5. **User Journey Maps** for both property owners and property managers

**Key Design Principles:**
- Progressive disclosure to handle incomplete data gracefully
- SEO-first heading hierarchy and schema markup
- Mobile-first responsive design
- Trust-building through verification badges and ratings
- Clear calls-to-action throughout the journey

---

## Table of Contents

1. [Landing Page Hierarchy & SEO Strategy](#1-landing-page-hierarchy--seo-strategy)
2. [State Landing Pages](#2-state-landing-pages)
3. [City Landing Pages](#3-city-landing-pages)
4. [Individual PM Profile Pages](#4-individual-pm-profile-pages)
5. [Data Display Strategy](#5-data-display-strategy)
6. [Lead Distribution & Matching System UI](#6-lead-distribution--matching-system-ui)
7. [User Journey Maps](#7-user-journey-maps)
8. [Information Architecture](#8-information-architecture)
9. [Component Specifications](#9-component-specifications)
10. [Accessibility Requirements](#10-accessibility-requirements)
11. [Implementation Notes](#11-implementation-notes)

---

## 1. Landing Page Hierarchy & SEO Strategy

### 1.1 URL Structure

```
propertifi.com/
├── property-managers/                    (Directory Hub)
│   ├── california/                       (State Landing)
│   │   ├── san-diego/                    (City Landing)
│   │   │   ├── abc-property-management   (Individual PM)
│   │   │   ├── coastal-realty-pm         (Individual PM)
│   │   │   └── [zip-92101]/              (Zip Code Landing - Optional)
│   │   ├── los-angeles/
│   │   ├── san-francisco/
│   │   └── [19-more-cities]/
│   └── florida/                          (State Landing)
│       ├── miami/
│       ├── tampa/
│       ├── orlando/
│       └── [9-more-cities]/
```

### 1.2 SEO Page Title & Meta Strategy

**State Page:**
```html
<title>Property Managers in California | 500+ Verified Companies | Propertifi</title>
<meta name="description" content="Find top-rated property managers in California.
Compare 500+ verified companies across 19 cities. Free quotes, BBB ratings, and
instant matching with local experts.">
<meta name="keywords" content="California property managers, CA property management
companies, residential property management California">
```

**City Page:**
```html
<title>Best Property Managers in San Diego, CA | 45 Local Companies</title>
<meta name="description" content="Compare 45 property managers in San Diego.
View BBB ratings, management fees, and service areas. Get matched with verified
local experts in minutes.">
<link rel="canonical" href="https://propertifi.com/property-managers/california/san-diego">
```

**Individual PM Page:**
```html
<title>ABC Property Management - San Diego, CA | A+ BBB Rating | Propertifi</title>
<meta name="description" content="ABC Property Management in San Diego.
A+ BBB Rating, 15 years in business, managing 250+ properties. Residential,
Commercial, and HOA management services.">
```

### 1.3 Schema Markup Strategy

**LocalBusiness Schema for Individual PMs:**
```json
{
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "ABC Property Management",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main Street",
    "addressLocality": "San Diego",
    "addressRegion": "CA",
    "postalCode": "92101"
  },
  "telephone": "+1-619-555-1234",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "65",
    "bestRating": "5"
  },
  "priceRange": "8-10% of monthly rent",
  "openingHours": "Mo-Fr 09:00-17:00"
}
```

---

## 2. State Landing Pages

### 2.1 Wireframe (ASCII Art)

```
┌────────────────────────────────────────────────────────────────────┐
│  [HEADER: Propertifi Logo | Search | Get Matched CTA]             │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                    HERO SECTION                              │ │
│  │                                                              │ │
│  │  H1: Property Managers in California                        │ │
│  │  500+ Verified Companies | 19 Cities | Free Matching        │ │
│  │                                                              │ │
│  │  [Search Bar: "Enter your city or zip code"]  [Search Btn] │ │
│  │                                                              │ │
│  │  [ Or browse by city ↓ ]                                    │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  TRUST INDICATORS (Row)                                      │ │
│  │  [✓ 500+ PMs] [★ BBB Verified] [📍 Local Experts]          │ │
│  │  [🔒 Free Service] [⚡ Instant Matches]                      │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  H2: Browse Property Managers by City                              │
│  ────────────────────────────────────────────────                  │
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐               │
│  │ San Diego   │  │ Los Angeles │  │ San Francisco│               │
│  │ 45 managers │  │ 120 managers│  │ 85 managers │               │
│  │ [View All →]│  │ [View All →]│  │ [View All →]│               │
│  └─────────────┘  └─────────────┘  └─────────────┘               │
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐               │
│  │ Sacramento  │  │ San Jose    │  │ Fresno      │               │
│  │ 32 managers │  │ 56 managers │  │ 28 managers │               │
│  │ [View All →]│  │ [View All →]│  │ [View All →]│               │
│  └─────────────┘  └─────────────┘  └─────────────┘               │
│                                                                     │
│  [Show All 19 Cities ↓]                                            │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  H2: How Property Management Works in California             │ │
│  │  ─────────────────────────────────────────────────            │ │
│  │                                                               │ │
│  │  • Average Fee: 8-10% of monthly rent                        │ │
│  │  • Common Services: Tenant screening, rent collection,       │ │
│  │    maintenance coordination, financial reporting             │ │
│  │  • Regulations: California-specific requirements (AB-1482,   │ │
│  │    rent control laws, security deposit limits)               │ │
│  │                                                               │ │
│  │  [Learn More About CA Property Management →]                 │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  H2: Featured Property Managers in California                │ │
│  │  ─────────────────────────────────────────────────            │ │
│  │                                                               │ │
│  │  [PM Card 1: A+ BBB, 20 yrs]  [PM Card 2: A, 15 yrs]        │ │
│  │  [PM Card 3: A+, 12 yrs]      [PM Card 4: B+, 10 yrs]       │ │
│  │                                                               │ │
│  │  [View All 500+ Managers →]                                  │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  FAQ SECTION (Accordion)                                      │ │
│  │  ─────────────────────────────                                │ │
│  │  ▼ How much do property managers charge in California?       │ │
│  │  ▷ What services are included?                               │ │
│  │  ▷ How do I choose the right property manager?               │ │
│  │  ▷ What are California-specific regulations?                 │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  [FOOTER: Cities | About | Blog | Contact | Privacy]              │
└────────────────────────────────────────────────────────────────────┘
```

### 2.2 Component Breakdown

**1. Hero Section**
- **Purpose**: Primary SEO target + conversion
- **Elements**:
  - H1: "Property Managers in [State]"
  - Key stats: "500+ Verified | 19 Cities | Free Matching"
  - Search bar with autocomplete (city/zip)
  - CTA: "Get Matched Free"
- **Design Notes**:
  - Background: Gradient with subtle CA/FL landmark imagery
  - Search bar: Large, prominent, mobile-friendly
  - Stats: Icons + numbers for scanability

**2. Trust Indicator Bar**
- **Purpose**: Reduce anxiety, build credibility
- **Elements**:
  - Verification badges
  - Social proof numbers
  - Security indicators
- **Visual**: Subtle background, icons with short text

**3. City Grid**
- **Purpose**: Internal linking for SEO, user navigation
- **Layout**: 3-column on desktop, 1-column on mobile
- **Each Card Contains**:
  - City name (H3)
  - Manager count
  - Click-through link
  - Optional: City thumbnail image

**4. Educational Content Block**
- **Purpose**: SEO keyword targeting, user education
- **Content**:
  - State-specific regulations
  - Average fees
  - Common services
  - Market insights
- **Design**: Light background box, easy to scan

**5. Featured Managers Carousel**
- **Purpose**: Showcase quality, drive engagement
- **Criteria for Featured**:
  - BBB A+ rating
  - 10+ years in business
  - Complete profile data
  - Premium subscription (revenue driver)
- **Design**: Cards with key info, "Featured" badge

**6. FAQ Section**
- **Purpose**: SEO (long-tail keywords), user education
- **Format**: Accordion, schema-marked up
- **Questions**: State-specific, high search volume

### 2.3 Heading Hierarchy (SEO Critical)

```html
<h1>Property Managers in California</h1>

  <h2>Browse Property Managers by City</h2>
    <h3>San Diego</h3>
    <h3>Los Angeles</h3>
    <h3>San Francisco</h3>
    <!-- ... -->

  <h2>How Property Management Works in California</h2>

  <h2>Featured Property Managers in California</h2>
    <h3>ABC Property Management</h3>
    <h3>Coastal Realty PM</h3>
    <!-- ... -->

  <h2>Frequently Asked Questions</h2>
    <h3>How much do property managers charge in California?</h3>
    <h3>What services are included?</h3>
    <!-- ... -->
```

---

## 3. City Landing Pages

### 3.1 Wireframe (ASCII Art)

```
┌────────────────────────────────────────────────────────────────────┐
│  [BREADCRUMB: Home > Property Managers > California > San Diego]   │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  HERO + FILTERS                                              │ │
│  │                                                              │ │
│  │  H1: Property Managers in San Diego, California             │ │
│  │  45 Verified Companies | BBB Rated | Free Quotes            │ │
│  │                                                              │ │
│  │  ┌─────────────────────────────────────────────────────────┐│ │
│  │  │ FILTER BAR                                              ││ │
│  │  │ [Service Type ▼] [BBB Rating ▼] [Years ▼] [Sort By ▼] ││ │
│  │  │ [ ] Residential  [ ] Commercial  [ ] HOA                ││ │
│  │  │ [x] Show only companies with pricing available          ││ │
│  │  └─────────────────────────────────────────────────────────┘│ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  QUICK STATS                                                  │ │
│  │  [📊 Avg Fee: 8-10%] [⭐ Avg BBB: A] [🏢 Avg Exp: 12 yrs]   │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  H2: Top Rated Property Managers in San Diego                      │
│  ─────────────────────────────────────────────                     │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  PM CARD #1                                       [FEATURED]  │ │
│  │  ┌────┐                                                      │ │
│  │  │IMG │  ABC Property Management          ★★★★★ A+ BBB     │ │
│  │  │    │  San Diego, CA 92101              (125 reviews)     │ │
│  │  └────┘  ✓ Verified | 20 Years in Business                  │ │
│  │                                                              │ │
│  │  📍 Serves: Downtown, North Park, La Jolla (+12 areas)      │ │
│  │  🏢 Services: Residential • Commercial • HOA                │ │
│  │  📊 Manages: 250+ properties                                │ │
│  │                                                              │ │
│  │  💰 Management Fee: 8% of monthly rent                      │ │
│  │  📞 (619) 555-1234        🌐 Visit Website                  │ │
│  │                                                              │ │
│  │  "Full-service property management with 24/7 tenant         │ │
│  │   support and online owner portal..."                       │ │
│  │                                                              │ │
│  │  [Get Free Quote]  [Compare]  [View Full Profile →]         │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  PM CARD #2                                                   │ │
│  │  ┌────┐                                                      │ │
│  │  │IMG │  Coastal Realty PM              ★★★★☆ A BBB        │ │
│  │  │    │  San Diego, CA 92103            (87 reviews)        │ │
│  │  └────┘  ✓ Verified | 15 Years in Business                  │ │
│  │                                                              │ │
│  │  📍 Serves: Pacific Beach, Ocean Beach, Mission Bay         │ │
│  │  🏢 Services: Residential • Vacation Rentals                │ │
│  │  📊 Manages: 180+ properties                                │ │
│  │                                                              │ │
│  │  💰 Management Fee: Contact for pricing                     │ │
│  │  📞 (619) 555-5678        🌐 Visit Website                  │ │
│  │                                                              │ │
│  │  "Specializing in coastal properties and vacation           │ │
│  │   rental management..."                                     │ │
│  │                                                              │ │
│  │  [Get Free Quote]  [Compare]  [View Full Profile →]         │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  [... 43 more PM cards ...]                                        │
│                                                                     │
│  [Load More (12 per page)] [Page 1 2 3 4 →]                       │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  SIDEBAR (Desktop) / Below Cards (Mobile)                    │ │
│  │  ─────────────────────────────────────────                   │ │
│  │                                                              │ │
│  │  ┌────────────────────────────────┐                         │ │
│  │  │ 🎯 Not Sure Which One to Pick? │                         │ │
│  │  │                                │                         │ │
│  │  │ Answer 3 quick questions and  │                         │ │
│  │  │ get matched with the best PMs │                         │ │
│  │  │ for your property.             │                         │ │
│  │  │                                │                         │ │
│  │  │ [Get Matched Free →]           │                         │ │
│  │  └────────────────────────────────┘                         │ │
│  │                                                              │ │
│  │  ┌────────────────────────────────┐                         │ │
│  │  │ 📊 Compare Tool (0/3)          │                         │ │
│  │  │                                │                         │ │
│  │  │ Select up to 3 companies to   │                         │ │
│  │  │ view side-by-side comparison.  │                         │ │
│  │  │                                │                         │ │
│  │  │ [ ] ABC Property Mgmt          │                         │ │
│  │  │ [ ] Coastal Realty PM          │                         │ │
│  │  │                                │                         │ │
│  │  │ [Compare Selected]             │                         │ │
│  │  └────────────────────────────────┘                         │ │
│  │                                                              │ │
│  │  ┌────────────────────────────────┐                         │ │
│  │  │ 🗺️ Browse Nearby Cities        │                         │ │
│  │  │                                │                         │ │
│  │  │ • Los Angeles (120 PMs)        │                         │ │
│  │  │ • Orange County (65 PMs)       │                         │ │
│  │  │ • Riverside (42 PMs)           │                         │ │
│  │  │ • San Bernardino (38 PMs)      │                         │ │
│  │  └────────────────────────────────┘                         │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  H2: Property Management Guide for San Diego                 │ │
│  │  ─────────────────────────────────────────────────            │ │
│  │                                                               │ │
│  │  H3: Average Costs                                            │ │
│  │  • Management Fee: 8-10% of monthly rent                     │ │
│  │  • Tenant Placement: $500-$1,200 (one-time)                  │ │
│  │  • Maintenance Markup: 10-15% typical                        │ │
│  │                                                               │ │
│  │  H3: San Diego Market Insights                                │ │
│  │  • Average Rent (1BR): $2,400/month                          │ │
│  │  • Average Rent (2BR): $3,100/month                          │ │
│  │  • Vacancy Rate: 4.2% (Q4 2025)                              │ │
│  │  • Rental Market: Strong demand, limited supply              │ │
│  │                                                               │ │
│  │  H3: Local Regulations                                        │ │
│  │  • Rent Control: Not city-wide, some neighborhoods apply     │ │
│  │  • Security Deposit Max: 2x monthly rent                     │ │
│  │  • Required Disclosures: Lead paint, mold, etc.              │ │
│  │                                                               │ │
│  │  [Download Free San Diego PM Guide (PDF) →]                  │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  [FAQ SECTION - San Diego Specific]                                │
│  [FOOTER]                                                           │
└────────────────────────────────────────────────────────────────────┘
```

### 3.2 Filter & Sort System

**Filter Options:**

1. **Service Type** (Multi-select)
   - Residential
   - Commercial
   - HOA/Condo
   - Vacation Rentals
   - Multi-family (4+ units)

2. **BBB Rating** (Multi-select)
   - A+ (highest)
   - A
   - B+
   - B
   - Not Rated (show separately)

3. **Years in Business**
   - 20+ years
   - 10-19 years
   - 5-9 years
   - Under 5 years
   - Any

4. **Portfolio Size** (when data available)
   - 200+ properties
   - 100-199 properties
   - 50-99 properties
   - Under 50 properties
   - Any

5. **Data Completeness** (Toggle)
   - Show only companies with pricing available
   - Show only companies with full contact info

**Sort Options:**
- Recommended (default - combines BBB rating, years, portfolio size)
- BBB Rating (highest first)
- Years in Business (most experienced first)
- Portfolio Size (largest first)
- Alphabetical (A-Z)

**Filter Interaction:**
```
User Flow:
1. Filters applied → URL updates (for SEO & sharing)
   /property-managers/california/san-diego?service=residential&rating=a-plus&sort=rating

2. Filter count badge shows active filters: "Filters (3 active)"

3. "Clear All Filters" button appears when filters are active

4. Results update with smooth transition

5. Empty state if no matches:
   "No property managers match your filters. Try adjusting your criteria."
   [Clear Filters] [Get Matched Instead →]
```

### 3.3 Property Manager Card Design

**Card Components (Priority Order):**

```
┌─────────────────────────────────────────────────────────────┐
│ [FEATURED BADGE]                    [Compare Checkbox]      │
├─────────────────────────────────────────────────────────────┤
│ ┌─────┐                                                     │
│ │     │  COMPANY NAME                    ★★★★★ A+ BBB      │
│ │LOGO │  Street Address                  (125 reviews)     │
│ │     │  City, State ZIP                 ✓ Verified        │
│ └─────┘  ⏱️ 20 Years in Business                            │
├─────────────────────────────────────────────────────────────┤
│ 📍 Service Area: [Neighborhoods/Areas]                      │
│ 🏢 Property Types: [Icons + Labels]                         │
│ 📊 Portfolio: 250+ properties managed                       │
├─────────────────────────────────────────────────────────────┤
│ 💰 PRICING (If Available)                                   │
│    Management Fee: 8% of monthly rent                       │
│    Leasing Fee: $800 per placement                          │
│                                                             │
│    OR (If Not Available)                                    │
│    💰 Pricing: Contact for custom quote                     │
├─────────────────────────────────────────────────────────────┤
│ DESCRIPTION (2 lines max, truncated)                        │
│ "Full-service property management with 24/7 tenant          │
│  support and online owner portal for real-time..."          │
├─────────────────────────────────────────────────────────────┤
│ 📞 (619) 555-1234        🌐 Visit Website                   │
├─────────────────────────────────────────────────────────────┤
│ [Get Free Quote]  [Add to Compare]  [View Profile →]        │
└─────────────────────────────────────────────────────────────┘
```

**Handling Missing Data:**

| Data Point | If Missing | Display Strategy |
|------------|-----------|------------------|
| **Email** (100% missing) | N/A | Never show email field; use contact form instead |
| **Management Fee** (50%+ missing) | Required | Show "Contact for pricing" + CTA button |
| **Leasing Fee** | Optional | Hide row if missing |
| **BBB Rating** (35% missing) | Important | Show "Not BBB Rated" in gray text, don't hide company |
| **Years in Business** | Nice-to-have | Show "Established [year]" or hide if unknown |
| **Portfolio Size** | Nice-to-have | Hide if unknown, don't penalize in sorting |
| **Website** | Nice-to-have | Hide link if missing |
| **Description** | Optional | Use generic text: "Professional property management services in [city]" |

**Visual Hierarchy:**
1. Company name + BBB rating (primary)
2. Service types + portfolio size (secondary)
3. Pricing (if available - high value)
4. Contact methods (tertiary)
5. CTAs (prominent, color-coded)

---

## 4. Individual PM Profile Pages

### 4.1 Wireframe (Full Profile)

```
┌────────────────────────────────────────────────────────────────────┐
│  [BREADCRUMB: Home > CA > San Diego > ABC Property Management]     │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  HERO SECTION                                [Add to Compare]│ │
│  │                                                               │ │
│  │  ┌──────┐                                                    │ │
│  │  │      │  ABC Property Management        [FEATURED]         │ │
│  │  │ LOGO │  San Diego, California                             │ │
│  │  │      │                                                    │ │
│  │  └──────┘  ★★★★★ A+ BBB Rating (125 reviews)                 │ │
│  │             ✓ Verified Company                               │ │
│  │             ⏱️ 20 Years in Business                           │ │
│  │             📊 Managing 250+ Properties                       │ │
│  │                                                               │ │
│  │  [Get Free Quote]  [📞 Call Now]  [Compare Similar →]        │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌────────────────┬──────────────────────────────────────────────┐│
│  │ LEFT COLUMN    │ RIGHT SIDEBAR (Sticky)                       ││
│  │ (Main Content) │                                              ││
│  │                │ ┌──────────────────────────────────────────┐││
│  │                │ │ CONTACT CARD                             │││
│  │                │ │                                          │││
│  │                │ │ 📍 123 Main Street                       │││
│  │                │ │    San Diego, CA 92101                   │││
│  │                │ │                                          │││
│  │                │ │ 📞 (619) 555-1234                        │││
│  │                │ │ 🌐 www.abcpm.com                         │││
│  │                │ │                                          │││
│  │                │ │ ⏰ Mon-Fri: 9AM-5PM                       │││
│  │                │ │    Sat: 10AM-2PM                         │││
│  │                │ │                                          │││
│  │                │ │ [Request Free Consultation →]            │││
│  │                │ └──────────────────────────────────────────┘││
│  │                │                                              ││
│  │                │ ┌──────────────────────────────────────────┐││
│  │ H2: Overview   │ │ QUICK FACTS                              │││
│  │ ─────────────  │ │                                          │││
│  │                │ │ 🏢 Service Types                         │││
│  │ Full-service   │ │    • Residential                         │││
│  │ property mgmt  │ │    • Commercial                          │││
│  │ company spec-  │ │    • HOA/Condo                           │││
│  │ ializing in... │ │                                          │││
│  │                │ │ 📊 Portfolio Size                        │││
│  │ [Read More ▼]  │ │    250+ properties                       │││
│  │                │ │                                          │││
│  │                │ │ 📍 Service Radius                        │││
│  │ H2: Services   │ │    50 miles from downtown                │││
│  │ ─────────────  │ │                                          │││
│  │                │ │ 💰 Average Fee                           │││
│  │ ✓ Tenant       │ │    8% of monthly rent                    │││
│  │   Screening    │ │                                          │││
│  │ ✓ Rent Coll-   │ │ 🎓 Certifications                        │││
│  │   ection       │ │    • CPM, NARPM Member                   │││
│  │ ✓ 24/7 Maint-  │ │                                          │││
│  │   enance       │ │ 🏆 Awards                                │││
│  │ ✓ Financial    │ │    • Best PM 2024 (SD Mag)               │││
│  │   Reporting    │ └──────────────────────────────────────────┘││
│  │ ✓ Eviction     │                                              ││
│  │   Handling     │ ┌──────────────────────────────────────────┐││
│  │ ✓ Inspections  │ │ 🗺️ SERVICE AREA MAP                     │││
│  │                │ │                                          │││
│  │                │ │  [Interactive Map Showing Coverage]      │││
│  │ H2: Pricing    │ │                                          │││
│  │ ─────────────  │ │  • Downtown SD                           │││
│  │                │ │  • North Park                            │││
│  │ 💰 Management  │ │  • La Jolla                              │││
│  │    Fee         │ │  • Pacific Beach                         │││
│  │    8% of mo.   │ │  • [+12 more areas]                      │││
│  │    rent        │ └──────────────────────────────────────────┘││
│  │                │                                              ││
│  │ 💰 Leasing Fee │ ┌──────────────────────────────────────────┐││
│  │    $800 per    │ │ 📊 SIMILAR COMPANIES                     │││
│  │    placement   │ │                                          │││
│  │                │ │ [Coastal Realty PM]                      │││
│  │ 💰 Inspection  │ │ A BBB • 15 yrs • 180 props               │││
│  │    $150/visit  │ │                                          │││
│  │                │ │ [Pacific Property Mgmt]                  │││
│  │ [Custom Quote] │ │ B+ BBB • 12 yrs • 120 props              │││
│  │                │ │                                          │││
│  │                │ │ [View All San Diego PMs →]               │││
│  │ H2: Areas      │ └──────────────────────────────────────────┘││
│  │    Served      │                                              ││
│  │ ─────────────  │                                              ││
│  │                │                                              ││
│  │ • Downtown SD  │                                              ││
│  │ • North Park   │                                              ││
│  │ • La Jolla     │                                              ││
│  │ • Pacific Bch  │                                              ││
│  │ • [+12 more]   │                                              ││
│  │                │                                              ││
│  │ Serving all of │                                              ││
│  │ San Diego Co.  │                                              ││
│  │ within 50-mile │                                              ││
│  │ radius.        │                                              ││
│  │                │                                              ││
│  │ H2: Reviews    │                                              ││
│  │ ─────────────  │                                              ││
│  │                │                                              ││
│  │ ★★★★★ A+ BBB   │                                              ││
│  │ 125 reviews    │                                              ││
│  │                │                                              ││
│  │ ┌────────────┐ │                                              ││
│  │ │"Excellent  │ │                                              ││
│  │ │ service!"  │ │                                              ││
│  │ │ - John D.  │ │                                              ││
│  │ │ ★★★★★      │ │                                              ││
│  │ └────────────┘ │                                              ││
│  │                │                                              ││
│  │ [View BBB →]   │                                              ││
│  │                │                                              ││
│  │                │                                              ││
│  │ H2: FAQ        │                                              ││
│  │ ─────────────  │                                              ││
│  │                │                                              ││
│  │ ▼ What's your  │                                              ││
│  │   minimum?     │                                              ││
│  │ ▷ How fast can │                                              ││
│  │   you lease?   │                                              ││
│  │ ▷ Do you offer │                                              ││
│  │   discounts?   │                                              ││
│  │                │                                              ││
│  └────────────────┴──────────────────────────────────────────────┘│
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  CTA FOOTER SECTION                                           │ │
│  │                                                               │ │
│  │  Ready to Get Started with ABC Property Management?          │ │
│  │                                                               │ │
│  │  [Get Free Quote]  [Schedule Call]  [Compare Similar PMs]    │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  [FOOTER]                                                           │
└────────────────────────────────────────────────────────────────────┘
```

### 4.2 Profile Content Strategy

**Required Sections (Even with Missing Data):**

1. **Hero/Header** - Always show
   - Company name (required)
   - Location (required from address)
   - BBB rating (or "Not BBB Rated")
   - Years in business (or "Established [year]")
   - Portfolio size (or hide if unknown)

2. **Overview** - Always show
   - If missing description: Auto-generate from available data
   - Example: "ABC Property Management is a property management company serving San Diego, California. Specializing in residential and commercial properties, they have been in business for 20 years."

3. **Services** - Always show
   - If service types missing: Show generic list
   - "Property management services may include: Tenant screening, Rent collection, Maintenance coordination, Financial reporting"
   - Add disclaimer: "Contact company for specific services offered"

4. **Pricing** - Critical section
   - **If fees available**: Display prominently with breakdown
   - **If fees missing**:
     ```
     💰 Custom Pricing Available

     Management fees typically range from 8-10% of monthly rent
     in the San Diego area. Contact ABC Property Management for
     a personalized quote based on your property.

     [Request Custom Quote →]
     ```

5. **Contact Card** - Always show (sticky sidebar)
   - Address (required)
   - Phone (required)
   - Website (if available)
   - Hours (if available, else "Call for hours")
   - NO EMAIL FIELD (100% missing)

6. **Reviews** - If BBB rating available
   - Link to BBB profile
   - Aggregate rating display
   - Note: "Reviews from Better Business Bureau"
   - If NO BBB rating: "No public reviews available yet. [Be the first to review →]"

---

## 5. Data Display Strategy

### 5.1 Data Quality Matrix

**Current Data Landscape:**

| Data Point | Availability | Display Strategy |
|-----------|-------------|------------------|
| **Company Name** | 100% | Always show, H1 on profile |
| **Address** | 100% | Always show, use for geocoding |
| **Phone** | 100% | Always show, click-to-call on mobile |
| **BBB Rating** | 65% | Show when available, "Not Rated" badge when missing |
| **Years in Business** | 80%* | Show when available, hide row if missing |
| **Service Types** | 75%* | Show when available, generic if missing |
| **Rentals Managed** | 60%* | Show when available, use in sorting/filtering |
| **Management Fees** | 50% | **CRITICAL** - Use placeholder strategy (see below) |
| **Leasing Fees** | 40% | Optional, hide if missing |
| **Email** | 0% | **NEVER SHOW** - Use contact form instead |
| **Website** | 70%* | Show link if available |
| **Description** | 60%* | Auto-generate if missing |

*Estimated based on typical scraper data

### 5.2 Pricing Display Strategy (50%+ Missing)

**Scenario 1: Fees Available**
```
┌──────────────────────────────────────┐
│ 💰 PRICING                           │
│                                      │
│ Management Fee: 8% of monthly rent   │
│ Leasing Fee: $800 per placement      │
│ Inspection: $150 per visit           │
│                                      │
│ [Get Custom Quote]                   │
└──────────────────────────────────────┘
```

**Scenario 2: No Fees Available**
```
┌──────────────────────────────────────┐
│ 💰 PRICING                           │
│                                      │
│ Contact for Custom Quote             │
│                                      │
│ Average fees in San Diego:           │
│ • Management: 8-10% of rent          │
│ • Leasing: $500-$1,200               │
│                                      │
│ [Request Your Quote →]               │
└──────────────────────────────────────┘
```

**Scenario 3: Partial Fees**
```
┌──────────────────────────────────────┐
│ 💰 PRICING                           │
│                                      │
│ Management Fee: 8% of monthly rent   │
│ Leasing Fee: Contact for pricing     │
│                                      │
│ [Get Complete Pricing →]             │
└──────────────────────────────────────┘
```

### 5.3 Missing Data UX Patterns

**Pattern 1: Soft Disclosure**
- Don't hide companies with missing data
- Show them with "Contact for details" placeholders
- Use market averages to set expectations

**Pattern 2: Progressive Enhancement**
- Companies with complete data rank higher (sorting)
- Filter option: "Show only companies with pricing"
- Visual indicator: "✓ Complete Profile" badge

**Pattern 3: Data Collection Incentive**
- For PMs: "Complete your profile to rank higher"
- Show completion percentage in PM dashboard
- Premium tier gets priority even with incomplete data

**Pattern 4: Trust Through Transparency**
```
ℹ️ Some information not provided by this company.
   We've included market averages to help you compare.
   [Contact them directly for specific details →]
```

### 5.4 Comparison Tool with Missing Data

**3-Column Comparison Table:**

```
┌────────────────┬────────────────┬────────────────┬────────────────┐
│                │ ABC Property   │ Coastal Realty │ Pacific PM     │
│                │ Management     │ PM             │ Group          │
├────────────────┼────────────────┼────────────────┼────────────────┤
│ BBB Rating     │ A+ (125)       │ A (87)         │ Not Rated      │
├────────────────┼────────────────┼────────────────┼────────────────┤
│ Years in Bus.  │ 20 years       │ 15 years       │ 10 years       │
├────────────────┼────────────────┼────────────────┼────────────────┤
│ Properties     │ 250+           │ 180+           │ Not disclosed  │
├────────────────┼────────────────┼────────────────┼────────────────┤
│ Management Fee │ 8% of rent     │ Contact for    │ 9% of rent     │
│                │                │ pricing        │                │
├────────────────┼────────────────┼────────────────┼────────────────┤
│ Leasing Fee    │ $800           │ Contact for    │ $1,000         │
│                │                │ pricing        │                │
├────────────────┼────────────────┼────────────────┼────────────────┤
│ Service Types  │ • Residential  │ • Residential  │ • Residential  │
│                │ • Commercial   │ • Vacation     │ • Commercial   │
│                │ • HOA          │                │                │
├────────────────┼────────────────┼────────────────┼────────────────┤
│ Website        │ abcpm.com      │ coastalpm.com  │ Not available  │
├────────────────┼────────────────┼────────────────┼────────────────┤
│                │ [Get Quote]    │ [Get Quote]    │ [Get Quote]    │
└────────────────┴────────────────┴────────────────┴────────────────┘

ℹ️ "Contact for pricing" means the company hasn't published standard
   rates. This is common for custom management solutions.

   Average San Diego fees: 8-10% management, $500-$1,200 leasing.
```

**Visual Treatment for Missing Data:**
- Available data: Normal text, black
- Missing data: "Not disclosed" in gray italic
- Helpful context: Blue info icon with tooltip

---

## 6. Lead Distribution & Matching System UI

### 6.1 PM Dashboard - Leads View

**Wireframe:**

```
┌────────────────────────────────────────────────────────────────────┐
│  Property Manager Dashboard              [Premium Tier] 🏆         │
│  ────────────────────────────────────────────────────────────      │
│  [Dashboard] [Leads] [Profile] [Analytics] [Settings]              │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  🎯 LEADS OVERVIEW                                            │ │
│  │                                                               │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │ │
│  │  │ New: 12  │  │ Active:8 │  │ Won: 5   │  │ Lost: 2  │    │ │
│  │  │ 🔥 3 Hot │  │          │  │ This mo. │  │ This mo. │    │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  FILTERS & ACTIONS                                            │ │
│  │  [All Leads ▼] [Status ▼] [Match Score ▼] [Date ▼]          │ │
│  │                                            [Export] [Import]  │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  H2: Available Leads (12)                  [Switch to Kanban View]│
│  ────────────────────────────────────────────────────────────      │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  LEAD CARD #1                              [NEW] [HOT MATCH] │ │
│  │                                                               │ │
│  │  🏠 Multi-Family Property - San Diego, CA 92101               │ │
│  │  Submitted 2 hours ago                                        │ │
│  │                                                               │ │
│  │  ┌─────────────────────────────────────────────────────────┐│ │
│  │  │ 🎯 MATCH SCORE: 94/100                     Excellent     ││ │
│  │  │                                                          ││ │
│  │  │ [████████████████████░░] 94%                            ││ │
│  │  │                                                          ││ │
│  │  │ Why this is a great match:                              ││ │
│  │  │ ✓ Property type: Multi-family (your specialty)          ││ │
│  │  │ ✓ Location: 2.3 miles from your office                  ││ │
│  │  │ ✓ Portfolio size: 12 units (in your sweet spot)         ││ │
│  │  │ ✓ Service area: Downtown SD (your top market)           ││ │
│  │  └─────────────────────────────────────────────────────────┘│ │
│  │                                                               │ │
│  │  📋 DETAILS                                                   │ │
│  │  • Property: 12-unit apartment building                      │ │
│  │  • Location: 100 Test Street, San Diego, CA 92101            │ │
│  │  • Current: Self-managed, looking to hire                    │ │
│  │  • Timeline: Ready to start within 30 days                   │ │
│  │                                                               │ │
│  │  👤 OWNER INFO                                                │ │
│  │  • Name: John Smith                                           │ │
│  │  • Contact: john@email.com • (619) 555-1234                  │ │
│  │  • Preferred: Email                                           │ │
│  │                                                               │ │
│  │  ⏰ AVAILABILITY                                               │ │
│  │  ✓ Available NOW (Premium tier early access)                 │ │
│  │  Free tier access: in 48 hours (Nov 30, 2025 10:00 AM)       │ │
│  │                                                               │ │
│  │  ┌─────────────────────────────────────────────────────────┐│ │
│  │  │ 💡 QUICK RESPONSE TEMPLATES                             ││ │
│  │  │                                                          ││ │
│  │  │ [📧 Send Introduction] [📞 Schedule Call]               ││ │
│  │  │ [💰 Send Pricing] [📄 Send Proposal]                    ││ │
│  │  └─────────────────────────────────────────────────────────┘│ │
│  │                                                               │ │
│  │  [Respond to Lead →]  [Not Interested]  [View Full Details] │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  LEAD CARD #2                                      [MATCHED] │ │
│  │                                                               │ │
│  │  🏠 Single-Family - Residential - La Jolla, CA 92037         │ │
│  │  Submitted 1 day ago                                          │ │
│  │                                                               │ │
│  │  🎯 MATCH SCORE: 78/100                        Good Match    │ │
│  │  [██████████████░░░░░░] 78%                                  │ │
│  │                                                               │ │
│  │  Why good but not perfect:                                    │ │
│  │  ✓ Property type: Single-family (you accept)                 │ │
│  │  ⚠ Location: 12.5 miles from office (moderate)              │ │
│  │  ✓ Service area: La Jolla (you serve this area)             │ │
│  │                                                               │ │
│  │  [Respond to Lead →]  [Pass]  [View Details]                 │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  [Load More Leads]  [Page 1 2 3 →]                                 │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  📊 MATCH SCORE BREAKDOWN                                     │ │
│  │                                                               │ │
│  │  How match scores are calculated:                            │ │
│  │  • Property Type Match: 25 points                            │ │
│  │  • Unit Range Fit: 25 points                                 │ │
│  │  • Distance from Office: 50 points                           │ │
│  │    - Under 10 miles: 50 pts                                  │ │
│  │    - 10-25 miles: 35 pts                                     │ │
│  │    - 25-40 miles: 20 pts                                     │ │
│  │    - Over 40 miles: 10 pts                                   │ │
│  │                                                               │ │
│  │  [Adjust Your Preferences →]                                 │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

### 6.2 Lead Response Modal

**When PM clicks "Respond to Lead":**

```
┌────────────────────────────────────────────────────────────────┐
│  Respond to Lead: Multi-Family Property                    [X] │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Responding to: John Smith (john@email.com)                    │
│  Property: 12-unit building, Downtown San Diego                │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ RESPONSE TYPE                                            │ │
│  │                                                          │ │
│  │ ⚪ Quick Response (Use Template)                         │ │
│  │ ⚪ Custom Response                                        │ │
│  │ 🔵 Comprehensive Proposal (Recommended)                  │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ SELECT TEMPLATE (if Quick Response)                      │ │
│  │                                                          │ │
│  │ [Initial Introduction ▼]                                 │ │
│  │                                                          │ │
│  │ Options:                                                 │ │
│  │ • Initial Introduction                                   │ │
│  │ • Send Pricing Information                              │ │
│  │ • Schedule Consultation                                  │ │
│  │ • Full Service Breakdown                                 │ │
│  │ • Custom (Write your own)                                │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ MESSAGE PREVIEW                                          │ │
│  │                                                          │ │
│  │ Subject: Your Property Management Request - ABC PM      │ │
│  │                                                          │ │
│  │ Hi John,                                                 │ │
│  │                                                          │ │
│  │ Thank you for your interest in ABC Property Management.  │ │
│  │ I reviewed your 12-unit property in Downtown San Diego  │ │
│  │ and would love to discuss how we can help.              │ │
│  │                                                          │ │
│  │ [Template continues...]                                  │ │
│  │                                                          │ │
│  │ [Edit Template]                                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ ATTACH DOCUMENTS (Optional)                              │ │
│  │                                                          │ │
│  │ ☑ Company Brochure (ABC_Brochure_2025.pdf)              │ │
│  │ ☑ Pricing Sheet (Standard_Pricing.pdf)                  │ │
│  │ ☐ Sample Contract                                        │ │
│  │ ☐ Client Testimonials                                    │ │
│  │                                                          │ │
│  │ [+ Add Custom Attachment]                                │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ NEXT STEPS                                               │ │
│  │                                                          │ │
│  │ ☑ Set follow-up reminder (3 days)                        │ │
│  │ ☑ Move lead to "Active" status                          │ │
│  │ ☐ Schedule automatic follow-up if no response in 5 days │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  [Cancel]                                    [Send Response →] │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### 6.3 Admin View - Lead Assignment Monitoring

**Admin Dashboard - Lead Assignments Page:**

```
┌────────────────────────────────────────────────────────────────────┐
│  Admin Dashboard - Lead Assignment Monitor                         │
│  [Dashboard] [Leads] [PMs] [Assignments] [Analytics] [Settings]    │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  TIER PERFORMANCE OVERVIEW                                    │ │
│  │                                                               │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │ │
│  │  │ Enterprise  │  │ Premium     │  │ Free Tier   │          │ │
│  │  │ 48h access  │  │ 24h access  │  │ Delayed     │          │ │
│  │  │             │  │             │  │             │          │ │
│  │  │ 8 PMs       │  │ 24 PMs      │  │ 150 PMs     │          │ │
│  │  │ 156 leads   │  │ 428 leads   │  │ 892 leads   │          │ │
│  │  │ Avg: 19/PM  │  │ Avg: 18/PM  │  │ Avg: 6/PM   │          │ │
│  │  │             │  │             │  │             │          │ │
│  │  │ Response:   │  │ Response:   │  │ Response:   │          │ │
│  │  │ 42% in 24h  │  │ 38% in 24h  │  │ 18% in 48h  │          │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘          │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  FILTERS                                                      │ │
│  │  [All Tiers ▼] [Status ▼] [Date Range ▼] [Search PM/Lead]   │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  H2: Recent Lead Assignments (1,476 total)                         │
│  ────────────────────────────────────────────────────────────      │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ TABLE VIEW                                         [Export]  │ │
│  ├──────┬────────────┬──────────────┬──────┬─────────┬─────────┤ │
│  │ Lead │ PM         │ Property     │ Tier │ Score   │ Status  │ │
│  ├──────┼────────────┼──────────────┼──────┼─────────┼─────────┤ │
│  │ #145 │ ABC PM     │ Multi-family │ 🏆   │ 94/100  │🟢 Now   │ │
│  │      │ San Diego  │ 12 units     │ Prem │         │Available│ │
│  │      │            │ 92101        │      │         │         │ │
│  ├──────┼────────────┼──────────────┼──────┼─────────┼─────────┤ │
│  │ #145 │ Coastal PM │ Multi-family │ 🥈   │ 89/100  │🟢 Now   │ │
│  │      │ San Diego  │ 12 units     │ Prem │         │Available│ │
│  │      │            │ 92101        │      │         │         │ │
│  ├──────┼────────────┼──────────────┼──────┼─────────┼─────────┤ │
│  │ #145 │ Pacific PM │ Multi-family │ ⚪   │ 82/100  │🟡 48h   │ │
│  │      │ San Diego  │ 12 units     │ Free │         │Nov 30   │ │
│  │      │            │ 92101        │      │         │10:00 AM │ │
│  ├──────┼────────────┼──────────────┼──────┼─────────┼─────────┤ │
│  │ #144 │ LA Realty  │ Single-fam   │ 💎   │ 76/100  │🟢 Now   │ │
│  │      │ Los Angeles│ Residential  │ Ent  │         │Available│ │
│  │      │            │ 90210        │      │         │         │ │
│  ├──────┴────────────┴──────────────┴──────┴─────────┴─────────┤ │
│  │ [Previous] Page 1 of 123                        [Next]      │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  MATCHING ALGORITHM VISUALIZATION                             │ │
│  │                                                               │ │
│  │  Lead #145: Multi-family, 12 units, San Diego 92101          │ │
│  │                                                               │ │
│  │  Step 1: Geographic Filter                                    │ │
│  │  ├─ 182 PMs within 50-mile radius                            │ │
│  │  └─ Excluded: 743 PMs (outside service area)                 │ │
│  │                                                               │ │
│  │  Step 2: Property Type Filter                                 │ │
│  │  ├─ 89 PMs accepting multi-family                            │ │
│  │  └─ Excluded: 93 PMs (wrong property type)                   │ │
│  │                                                               │ │
│  │  Step 3: Unit Range Filter                                    │ │
│  │  ├─ 67 PMs accepting 10-15 unit range                        │ │
│  │  └─ Excluded: 22 PMs (outside unit preference)               │ │
│  │                                                               │ │
│  │  Step 4: Match Score Calculation                              │ │
│  │  ├─ 67 matches scored (range: 62-94)                         │ │
│  │  └─ Top 10 assigned based on score                           │ │
│  │                                                               │ │
│  │  Step 5: Tier-Based Availability                              │ │
│  │  ├─ 6 Premium/Enterprise: Available NOW                      │ │
│  │  └─ 4 Free: Available in 48 hours                            │ │
│  │                                                               │ │
│  │  [View Full Algorithm Details →]                             │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  ANALYTICS CHARTS                                             │ │
│  │                                                               │ │
│  │  Average Match Score by Tier                                  │ │
│  │  ┌─────────────────────────────────────────────────────────┐│ │
│  │  │ Enterprise: ████████████░░░░ 78/100                      ││ │
│  │  │ Premium:    ██████████████░░ 82/100                      ││ │
│  │  │ Free:       ████████░░░░░░░░ 71/100                      ││ │
│  │  └─────────────────────────────────────────────────────────┘│ │
│  │                                                               │ │
│  │  Response Time by Tier                                        │ │
│  │  [Line chart showing Enterprise/Premium respond faster]      │ │
│  │                                                               │ │
│  │  Conversion Rate by Match Score                               │ │
│  │  [Chart showing 90+ score = 45% conversion vs <70 = 12%]    │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

### 6.4 Matching Algorithm Visualization

**For Property Owners (After Lead Submission):**

```
┌────────────────────────────────────────────────────────────────┐
│  🎉 Your Request Has Been Submitted!                           │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  We're finding the best property managers for you...           │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ MATCHING PROGRESS                                        │ │
│  │                                                          │ │
│  │ ✓ Analyzing your property details                       │ │
│  │ ✓ Searching 925 property managers                       │ │
│  │ ✓ Filtering by location (San Diego, CA)                 │ │
│  │ ✓ Matching property type (Multi-family)                 │ │
│  │ ✓ Calculating match scores                              │ │
│  │ ⏳ Notifying matched managers...                         │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ✅ RESULTS                                                     │
│                                                                 │
│  We found 10 property managers that match your needs!          │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ 🏆 TOP MATCHES                                           │ │
│  │                                                          │ │
│  │ 1. ABC Property Management        Match: 94/100 ⭐⭐⭐    │ │
│  │    A+ BBB • 20 years • 250+ properties                   │ │
│  │    Specialty: Multi-family in Downtown SD                │ │
│  │                                                          │ │
│  │ 2. Coastal Realty PM              Match: 89/100 ⭐⭐⭐    │ │
│  │    A BBB • 15 years • 180+ properties                    │ │
│  │    Specialty: Coastal properties                         │ │
│  │                                                          │ │
│  │ 3. Pacific Property Management    Match: 82/100 ⭐⭐      │ │
│  │    B+ BBB • 12 years • 120+ properties                   │ │
│  │    Specialty: Residential & Commercial                   │ │
│  │                                                          │ │
│  │ [View All 10 Matches →]                                  │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ⏰ WHAT HAPPENS NEXT?                                          │
│                                                                 │
│  1. Matched managers are reviewing your request               │
│  2. Expect to hear from them within 24-48 hours               │
│  3. We'll email you when managers respond                     │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ 💡 TIP: Create an account to track responses             │ │
│  │                                                          │ │
│  │ • See when managers view your request                    │ │
│  │ • Compare proposals side-by-side                         │ │
│  │ • Message managers directly                              │ │
│  │                                                          │ │
│  │ [Create Free Account →]  [Continue as Guest]            │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  [Return to Home]  [Search More Managers]                      │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## 7. User Journey Maps

### 7.1 Property Owner Journey

**Scenario: First-time property owner looking for management help**

```
DISCOVERY PHASE
│
├─ Trigger: "I need help managing my rental property"
│
├─ Search: Google → "property managers near me" / "best property managers san diego"
│
├─ Land on: Propertifi City Page (San Diego)
│  │
│  └─ SEO optimization brings them here
│
└─ First Impression (5 seconds)
   │
   ├─ See: "45 Verified Property Managers in San Diego"
   ├─ Trust Signals: BBB badges, review counts, verification
   └─ Scan: Top-rated companies with clear pricing

RESEARCH PHASE
│
├─ Browse: Scroll through PM cards
│  │
│  ├─ Filter by: BBB rating, Service type (Residential)
│  ├─ Compare: Add 3 companies to comparison tool
│  └─ Read: Educational content about typical fees
│
├─ Click: View profile of ABC Property Management
│  │
│  ├─ See: Detailed info, pricing, service area map
│  ├─ Read: Reviews and credentials
│  └─ Decision Point: "This looks good, but want more options"
│
└─ Return: Back to city page, review 2 more companies

DECISION PHASE
│
├─ Realize: "I don't know which one is best for MY property"
│
├─ Notice: CTA box → "Not sure which one to pick? Get matched"
│
├─ Click: "Get Matched Free" button
│
└─ Enter: Get Started wizard
   │
   ├─ Step 1: Property details (address, type, units)
   ├─ Step 2: Current situation (self-managed, timeline)
   ├─ Step 3: Contact info (name, email, phone)
   └─ Step 4: Review and submit

CONVERSION PHASE
│
├─ Submit: Lead form
│
├─ See: Matching in progress animation
│  │
│  └─ Builds anticipation, shows value being delivered
│
├─ Results: "10 property managers matched!"
│  │
│  ├─ View: Top 3 matches with scores
│  └─ CTA: "Create account to track responses"
│
└─ Decision Point:
   │
   ├─ Option A: Create account (25-30% conversion)
   │  │
   │  └─ Now can: Track responses, save favorites, message PMs
   │
   └─ Option B: Continue as guest (70-75%)
      │
      └─ Receive: Email confirmation with match summary

ENGAGEMENT PHASE (If account created)
│
├─ Day 1: Receive 3 responses via email
│
├─ Login: Owner dashboard
│  │
│  ├─ See: "3 new responses" notification
│  ├─ View: Messages from PMs with proposals
│  └─ Compare: Pricing and services side-by-side
│
├─ Day 3: Schedule calls with 2 finalists
│
├─ Day 7: Make decision
│  │
│  └─ Update lead status: "Hired ABC Property Management"
│
└─ Future: Return to use ROI calculator, read blog, refer friends

PAIN POINTS ADDRESSED:
✅ Too many options → Filtered by location and expertise
✅ Don't know pricing → Displayed upfront when available
✅ Can't evaluate quality → BBB ratings, years, portfolio size
✅ Unsure of fit → Matching algorithm with scores
✅ Information overload → Progressive disclosure, clear hierarchy
```

### 7.2 Property Manager Journey

**Scenario: Premium tier PM looking for new clients**

```
ONBOARDING PHASE
│
├─ Sign Up: Create PM account on Propertifi
│
├─ Choose: Premium tier subscription ($99/month)
│  │
│  └─ Value Prop: 24-hour early access to leads
│
├─ Complete: Profile setup
│  │
│  ├─ Company info (name, address, phone, website)
│  ├─ Service details (areas, property types, fees)
│  ├─ Credentials (BBB rating, years, portfolio size)
│  └─ Upload: Logo, brochure, pricing sheet
│
└─ Set: Lead preferences
   │
   ├─ Geographic: 50-mile radius from office
   ├─ Property types: Residential, Commercial, Multi-family
   ├─ Unit range: 5-50 units
   └─ Notifications: Email + SMS for high-match leads

LEAD DISCOVERY PHASE
│
├─ Day 1: Receive notification
│  │
│  └─ "🔥 New hot match! 94/100 - Multi-family property in San Diego"
│
├─ Click: Notification → Opens PM dashboard
│
├─ See: Lead card with match breakdown
│  │
│  ├─ Match score: 94/100 (Excellent)
│  ├─ Why: Property type ✓, Location ✓, Units ✓
│  ├─ Property details: 12 units, Downtown SD
│  └─ Owner: John Smith, prefers email, ready in 30 days
│
└─ Decision: "This is a perfect fit!"

RESPONSE PHASE
│
├─ Click: "Respond to Lead" button
│
├─ Choose: Response type
│  │
│  └─ Select: "Comprehensive Proposal" (recommended)
│
├─ Use: Pre-built template
│  │
│  ├─ Auto-filled: Property details, owner name
│  ├─ Customize: Add personal touch, specific value props
│  └─ Attach: Brochure, pricing sheet, testimonials
│
├─ Set: Follow-up reminder (3 days)
│
└─ Send: Response within 30 minutes
   │
   └─ Status: Lead moved to "Active"

TRACKING PHASE
│
├─ Dashboard: Monitor lead status
│  │
│  ├─ See: "Viewed by owner" notification (Day 2)
│  ├─ See: "Owner requested call" (Day 3)
│  └─ Update: Schedule call in calendar
│
├─ Day 3: Phone consultation
│  │
│  ├─ Discuss: Property needs, timeline, pricing
│  ├─ Send: Formal proposal via platform
│  └─ Set: Follow-up for next week
│
└─ Day 7: Owner accepts proposal
   │
   └─ Status: Lead marked "Won" 🎉

ANALYTICS PHASE
│
├─ View: Performance dashboard
│  │
│  ├─ Leads this month: 24 (vs 8 on free tier)
│  ├─ Average match score: 82/100
│  ├─ Response rate: 42% within 24h
│  └─ Conversion rate: 18% (vs 6% industry avg)
│
├─ Insight: High-match leads convert 3x better
│
└─ Action: Adjust preferences to increase match quality

OPTIMIZATION PHASE
│
├─ Notice: Low matches for HOA properties
│
├─ Update: Add HOA to accepted property types
│
├─ See: Immediate increase in HOA leads
│
└─ Result: 6 new HOA leads next month, 2 conversions

UPGRADE DECISION POINT
│
├─ Compare: Premium vs Enterprise tier
│  │
│  ├─ Premium: 24h early access, 24 leads/month avg
│  └─ Enterprise: 48h early access, 40 leads/month avg
│
├─ Calculate: ROI
│  │
│  ├─ Enterprise cost: $199/month
│  ├─ Extra leads: ~16/month
│  ├─ Conversion rate: 18%
│  └─ Value: ~3 extra clients = $12K+ annual revenue
│
└─ Upgrade: To Enterprise tier 🏆

PAIN POINTS ADDRESSED:
✅ Low-quality leads → Matching algorithm filters for fit
✅ Slow response time → Real-time notifications + mobile app
✅ Manual outreach → Response templates and automation
✅ Can't track status → Dashboard with lead pipeline
✅ Competing with too many → Tiered system gives advantage
✅ No data on performance → Analytics dashboard with insights
```

### 7.3 Journey Comparison Matrix

| Stage | Property Owner | Property Manager |
|-------|---------------|------------------|
| **Awareness** | Google search for local PMs | Platform marketing + referrals |
| **First Touch** | SEO landing page (city) | Sign-up page with tier comparison |
| **Research** | Browse PMs, compare, read reviews | Review lead preferences setup |
| **Decision** | "Get Matched" wizard | Choose subscription tier |
| **Conversion** | Submit lead, see matches | Complete profile, set preferences |
| **Activation** | Create account (optional) | Receive first lead notification |
| **Engagement** | Review PM responses, compare | Respond to leads, track status |
| **Retention** | Return for calculators, blog | Monthly leads, performance analytics |
| **Advocacy** | Refer other owners | Upgrade tier, recruit other PMs |

---

## 8. Information Architecture

### 8.1 Site Map

```
Propertifi.com
│
├─ Home (/)
│  └─ Hero + CTA to Get Started
│
├─ Property Managers (/property-managers)
│  │
│  ├─ Directory Hub
│  │  └─ Browse by State
│  │
│  ├─ State Pages (/property-managers/[state])
│  │  │
│  │  ├─ California (/property-managers/california)
│  │  │  ├─ 19 cities listed
│  │  │  └─ Featured PMs
│  │  │
│  │  └─ Florida (/property-managers/florida)
│  │     ├─ 13 cities listed
│  │     └─ Featured PMs
│  │
│  ├─ City Pages (/property-managers/[state]/[city])
│  │  │
│  │  ├─ San Diego (/property-managers/california/san-diego)
│  │  │  ├─ 45 PMs listed
│  │  │  ├─ Filters & sorting
│  │  │  ├─ Comparison tool
│  │  │  └─ Local market guide
│  │  │
│  │  ├─ Los Angeles (/property-managers/california/los-angeles)
│  │  │  └─ [Same structure]
│  │  │
│  │  └─ [30 more cities...]
│  │
│  └─ Individual PM Pages (/property-managers/[state]/[city]/[pm-slug])
│     │
│     ├─ ABC Property Management (...san-diego/abc-property-management)
│     │  ├─ Full profile
│     │  ├─ Contact card
│     │  └─ CTA buttons
│     │
│     └─ [924 more PM profiles...]
│
├─ Get Started (/get-started)
│  ├─ Step 1: Property Details
│  ├─ Step 2: Current Situation
│  ├─ Step 3: Contact Info
│  └─ Step 4: Review & Submit
│
├─ Compare (/compare)
│  └─ Side-by-side PM comparison (up to 3)
│
├─ Owner Dashboard (/owner)
│  ├─ My Leads
│  ├─ Saved Managers
│  ├─ Saved Calculations
│  └─ Settings
│
├─ PM Dashboard (/property-manager)
│  ├─ Leads
│  ├─ Preferences
│  ├─ Analytics
│  └─ Profile
│
├─ Admin Dashboard (/admin)
│  ├─ Lead Assignments
│  ├─ User Management
│  └─ Analytics
│
├─ Resources (Future)
│  ├─ Blog
│  ├─ Calculators
│  └─ Guides
│
└─ Legal
   ├─ Privacy Policy
   ├─ Terms of Service
   └─ Contact
```

### 8.2 Navigation Patterns

**Public Navigation (Not Logged In):**
```
┌────────────────────────────────────────────────────────────┐
│ [Propertifi Logo]              [Find PMs] [Get Matched]    │
└────────────────────────────────────────────────────────────┘
```

**Owner Navigation (Logged In):**
```
┌────────────────────────────────────────────────────────────┐
│ [Logo] [Dashboard] [My Leads] [Saved]     [👤 John Smith] │
└────────────────────────────────────────────────────────────┘
```

**PM Navigation (Logged In):**
```
┌────────────────────────────────────────────────────────────┐
│ [Logo] [Dashboard] [Leads] [Analytics]  [🏆 Premium] [👤] │
└────────────────────────────────────────────────────────────┘
```

**Mobile Navigation (Hamburger Menu):**
```
☰ Menu
├─ Find Property Managers
├─ Get Matched
├─ About
├─ Blog
├─ Login / Sign Up
└─ [User Menu if logged in]
```

---

## 9. Component Specifications

### 9.1 Property Manager Card Component

**Props:**
```typescript
interface PMCardProps {
  pm: PropertyManager;
  variant: 'compact' | 'detailed' | 'featured';
  showComparison?: boolean;
  showMatchScore?: boolean;
  matchScore?: number;
}

interface PropertyManager {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  website?: string;
  bbbRating?: 'A+' | 'A' | 'B+' | 'B' | 'C' | null;
  reviewCount?: number;
  yearsInBusiness?: number;
  portfolioSize?: number;
  serviceTypes: ('residential' | 'commercial' | 'hoa' | 'vacation')[];
  managementFee?: string;
  leasingFee?: string;
  description?: string;
  featured?: boolean;
  verified: boolean;
  logo?: string;
}
```

**States:**
- Default
- Hover (shadow elevation)
- Selected (for comparison)
- Featured (badge + border)

**Accessibility:**
- ARIA label with company name and rating
- Keyboard navigable
- Focus visible
- Click target min 44x44px

### 9.2 Filter Component

**Props:**
```typescript
interface FilterProps {
  filters: {
    serviceTypes: string[];
    bbbRatings: string[];
    yearsInBusiness: string;
    portfolioSize: string;
    hasPricing: boolean;
  };
  onFilterChange: (filters: FilterState) => void;
  resultCount: number;
}
```

**Behavior:**
- Update URL params on change (SEO + shareable)
- Debounce filter application (300ms)
- Show active filter count
- Clear all button when filters active
- Persist in localStorage

### 9.3 Match Score Indicator

**Visual Design:**
```
Score Range → Color → Label
90-100      → Green  → Excellent Match
80-89       → Blue   → Great Match
70-79       → Yellow → Good Match
60-69       → Orange → Fair Match
<60         → Gray   → Not Recommended
```

**Component:**
```typescript
interface MatchScoreProps {
  score: number;
  breakdown: {
    propertyType: number;  // 0-25
    unitRange: number;     // 0-25
    distance: number;      // 0-50
  };
  showBreakdown?: boolean;
}
```

### 9.4 Lead Card Component (PM Dashboard)

**Props:**
```typescript
interface LeadCardProps {
  lead: Lead;
  matchScore: number;
  matchBreakdown: MatchBreakdown;
  availableAt: Date | null;
  status: 'new' | 'viewed' | 'responded' | 'won' | 'lost';
  tier: 'free' | 'premium' | 'enterprise';
}
```

**Actions:**
- Respond to Lead (primary)
- Pass on Lead (secondary)
- View Full Details (tertiary)
- Set Reminder (tertiary)

**Visual Priority:**
1. Match score (large, color-coded)
2. Property type + location
3. Owner contact preferences
4. Availability status
5. Response templates

---

## 10. Accessibility Requirements

### 10.1 WCAG 2.1 AA Compliance

**Color Contrast:**
- Text: Minimum 4.5:1 ratio
- Large text (18pt+): Minimum 3:1 ratio
- Interactive elements: Minimum 3:1 ratio

**Keyboard Navigation:**
- All interactive elements tab-accessible
- Logical tab order
- Visible focus indicators
- Skip navigation link
- Escape key closes modals

**Screen Reader Support:**
- Semantic HTML (proper heading hierarchy)
- ARIA labels for icons and buttons
- ARIA live regions for dynamic content
- Alt text for images
- Form labels and error messages

**Responsive & Zoom:**
- Support 200% browser zoom
- No horizontal scroll at 320px width
- Touch targets minimum 44x44px
- Readable text at all sizes

### 10.2 Specific Implementations

**Property Manager Cards:**
```html
<article
  role="article"
  aria-labelledby="pm-name-123"
  aria-describedby="pm-summary-123"
>
  <h3 id="pm-name-123">ABC Property Management</h3>
  <div id="pm-summary-123">
    A+ BBB Rating, 20 years in business, San Diego
  </div>
  <!-- ... -->
</article>
```

**Filter System:**
```html
<form role="search" aria-label="Filter property managers">
  <fieldset>
    <legend>Service Type</legend>
    <div role="group" aria-labelledby="service-type-label">
      <input type="checkbox" id="residential" />
      <label for="residential">Residential</label>
      <!-- ... -->
    </div>
  </fieldset>
</form>
```

**Match Score:**
```html
<div
  role="status"
  aria-label="Match score: 94 out of 100, Excellent match"
>
  <span aria-hidden="true">94/100</span>
  <span class="sr-only">Match score: 94 out of 100, Excellent match</span>
</div>
```

---

## 11. Implementation Notes

### 11.1 Technical Stack Recommendations

**Frontend:**
- Next.js 14+ (already in use)
- App Router for file-based routing
- Server Components for SEO pages
- Client Components for interactive features
- Tailwind CSS for styling
- Framer Motion for animations
- React Query for data fetching

**SEO Optimization:**
- Dynamic sitemap generation
- Schema.org markup (Organization, LocalBusiness, Review)
- Canonical URLs
- Meta tags with Open Graph
- Structured data for rich snippets
- Image optimization (Next.js Image component)
- Lazy loading for below-fold content

### 11.2 Performance Targets

**Page Speed:**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
- TTI (Time to Interactive): < 3.5s

**Optimization Strategies:**
- Static generation for state/city pages
- ISR (Incremental Static Regeneration) for PM profiles
- Image optimization with WebP format
- Code splitting by route
- Prefetch links on hover
- CDN for static assets

### 11.3 Database Schema Considerations

**Property Managers Table:**
```sql
CREATE TABLE property_managers (
  id INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(2) NOT NULL,
  zip VARCHAR(10) NOT NULL,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  phone VARCHAR(20) NOT NULL,
  website VARCHAR(255),
  bbb_rating VARCHAR(5),
  bbb_review_count INT,
  years_in_business INT,
  established_year INT,
  portfolio_size INT,
  management_fee VARCHAR(100),
  leasing_fee VARCHAR(100),
  description TEXT,
  featured BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,
  logo_url VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,

  INDEX idx_city_state (city, state),
  INDEX idx_bbb_rating (bbb_rating),
  INDEX idx_featured (featured),
  FULLTEXT idx_search (name, description)
);
```

**PM Service Types (Many-to-Many):**
```sql
CREATE TABLE pm_service_types (
  pm_id INT,
  service_type ENUM('residential', 'commercial', 'hoa', 'vacation'),
  PRIMARY KEY (pm_id, service_type),
  FOREIGN KEY (pm_id) REFERENCES property_managers(id)
);
```

### 11.4 API Endpoints

**Public Endpoints:**
```
GET /api/property-managers
  ?state=ca
  &city=san-diego
  &service_type=residential
  &bbb_rating=a-plus
  &has_pricing=true
  &sort=rating
  &page=1
  &per_page=12

GET /api/property-managers/:slug
  Returns: Full PM profile data

POST /api/leads
  Body: { property details, owner contact }
  Returns: { lead_id, matched_managers[] }
```

**Authenticated PM Endpoints:**
```
GET /api/pm/leads
  ?status=new
  &min_score=80
  Returns: Assigned leads with match scores

POST /api/pm/leads/:id/respond
  Body: { message, attachments, template_id }
  Returns: Success + lead status update
```

### 11.5 Mobile Considerations

**Responsive Breakpoints:**
- Mobile: < 640px (1 column)
- Tablet: 640-1024px (2 columns)
- Desktop: > 1024px (3 columns + sidebar)

**Mobile-Specific Features:**
- Click-to-call phone numbers
- Native share functionality
- Touch-optimized filters (bottom sheet)
- Simplified comparison (2 max on mobile)
- Sticky CTA buttons
- Reduced data on initial load

**Progressive Web App:**
- Manifest.json for home screen install
- Service worker for offline support
- Push notifications for PM lead alerts
- Offline mode for viewing saved PMs

### 11.6 Analytics & Tracking

**Key Metrics to Track:**
- Page views by landing page type
- Filter usage patterns
- Comparison tool engagement
- Lead submission rate (by source page)
- PM profile views
- Click-through rates (card → profile)
- Search queries (for SEO insights)
- Time on page by page type

**Event Tracking:**
```javascript
// Property Owner Events
trackEvent('pm_card_clicked', { pm_id, source_page, position });
trackEvent('filter_applied', { filter_type, value });
trackEvent('comparison_added', { pm_id, comparison_count });
trackEvent('lead_submitted', { city, property_type, matched_count });
trackEvent('account_created', { source: 'post_lead' });

// Property Manager Events
trackEvent('lead_viewed', { lead_id, match_score });
trackEvent('lead_responded', { lead_id, response_time_minutes });
trackEvent('lead_status_updated', { lead_id, status });
```

### 11.7 SEO Implementation Checklist

**Per Page Type:**

**State Page:**
- [ ] Dynamic title with keyword + state name
- [ ] Meta description with key stats
- [ ] H1 with state name
- [ ] Structured data (Organization, BreadcrumbList)
- [ ] Internal links to all city pages
- [ ] Canonical URL
- [ ] Sitemap inclusion
- [ ] Image alt texts

**City Page:**
- [ ] Dynamic title with keyword + city + state
- [ ] Meta description with local stats
- [ ] H1 with city name
- [ ] Structured data (LocalBusiness aggregate)
- [ ] Internal links to PM profiles
- [ ] Related cities sidebar
- [ ] FAQ schema markup
- [ ] Local market content (500+ words)

**PM Profile:**
- [ ] Title with company name + city + rating
- [ ] Meta description with USP
- [ ] H1 with company name
- [ ] Structured data (LocalBusiness, Review, FAQPage)
- [ ] Breadcrumb navigation
- [ ] Social share tags (Open Graph, Twitter)
- [ ] Canonical URL
- [ ] Related PM suggestions

---

## Conclusion

This UX design specification provides a comprehensive blueprint for creating SEO-optimized landing pages and an intuitive property manager marketplace for Propertifi.

**Key Takeaways:**

1. **SEO-First Approach**: Proper heading hierarchy, schema markup, and internal linking will drive organic traffic
2. **Data Quality Handling**: Graceful degradation and placeholder strategies address missing data (especially fees and emails)
3. **Tiered System UI**: Clear visual indicators and match scores communicate value to both owners and PMs
4. **User-Centered Design**: Journey maps reveal friction points and opportunities for conversion optimization
5. **Accessibility**: WCAG 2.1 AA compliance ensures inclusive experience for all users

**Next Steps:**
1. Review and approve design specifications
2. Prioritize implementation phases
3. Create high-fidelity mockups in Figma/Sketch
4. Build component library in Storybook
5. Implement MVP (State + City pages first)
6. Test with real users and iterate

---

**Files Referenced:**
- `/Users/ravi/Documents/gemini_projects/propertifi/docs/strategy/SEO_LANDING_PAGES_UX_DESIGN.md` (this file)
- `/Users/ravi/Documents/gemini_projects/propertifi/propertifi-frontend/nextjs-app/app/components/ManagerCard.tsx`
- `/Users/ravi/Documents/gemini_projects/propertifi/PROPERTIFI_ONBOARDING_GUIDE.md`
- `/Users/ravi/Documents/gemini_projects/propertifi/docs/README.md`

**Maintained by:** UX/UI Design Team
**Last Updated:** November 28, 2025
**Status:** DRAFT - Ready for Review
