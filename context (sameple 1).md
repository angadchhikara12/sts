# Luxury Limo Service Website — Full Project Context for AI Agent

## Project Overview

Build a modern, luxury limousine service website using ONLY:

* HTML5
* CSS3
* Vanilla JavaScript

Do NOT use:

* React
* Vue
* Angular
* jQuery
* Bootstrap
* Tailwind
* Any CSS framework
* Any frontend framework

The final project must feel premium, elegant, modern, fast, mobile-friendly, and production-ready.

The design aesthetic should combine:

* Luxury black-car service
* Executive/business class feel
* Modern airport transfer company
* Minimalistic dark UI
* Smooth animations
* Premium typography
* High-end automotive branding

The website should look like a real limousine business capable of accepting bookings from real customers.

---

# Brand Identity

## Business Name

Velora Limo

## Tagline

Luxury Rides. Professional Service.

## Primary Colors

* Matte Black: #0D0D0D
* Gold Accent: #D4AF37
* White: #FFFFFF
* Dark Gray: #1A1A1A
* Soft Gray: #A0A0A0

## Typography

Use elegant modern fonts.
Suggested:

* Headings: Playfair Display or Cinzel
* Body: Inter or Poppins

Use Google Fonts.

---

# Global Requirements

## Responsiveness

The website MUST:

* Work perfectly on desktop
* Work perfectly on tablet
* Work perfectly on mobile
* Use responsive layouts
* Use flexible grids
* Use CSS media queries
* Avoid horizontal scrolling

---

# Performance Requirements

Optimize for:

* Fast loading
* Smooth animations
* Lightweight assets
* Lazy loading images where needed
* Minimal DOM complexity

---

# Accessibility

Implement:

* Proper semantic HTML
* alt attributes for images
* Keyboard accessibility
* Focus states
* ARIA labels where appropriate
* Good color contrast

---

# SEO Requirements

Implement:

* Meta title
* Meta description
* Open Graph tags
* Semantic HTML structure
* Proper heading hierarchy
* Favicon

---

# Website Structure

The website should contain the following pages:

1. Home
2. Fleet
3. Services
4. About
5. Contact
6. Booking

Use separate HTML files for each page.

Example:

* index.html
* fleet.html
* services.html
* about.html
* contact.html
* booking.html

---

# Shared Components

## Navbar

Sticky navbar.

Contains:

* Logo
* Navigation links
* CTA button “Book Now”
* Mobile hamburger menu

Behavior:

* Transparent on top of homepage hero
* Turns solid black on scroll
* Smooth transitions
* Mobile slide-in menu

---

## Footer

Luxury styled footer with:

* Company logo
* Quick links
* Contact info
* Social icons
* Business hours
* Copyright

Include:

* Instagram
* Facebook
* X/Twitter
* LinkedIn

---

# Homepage Requirements

## Hero Section

Full-screen cinematic hero section.

Include:

* Large luxury limo/car background image
* Dark overlay
* Main headline
* Subheadline
* CTA buttons
* Smooth fade-in animations

Headline:
“Luxury Transportation Redefined”

Subheadline:
“Premium chauffeur and limousine services for airport transfers, corporate travel, weddings, and special events.”

Buttons:

* Book a Ride
* View Fleet

Hero should feel premium and cinematic.

---

## Quick Booking Form

Place below hero.

Fields:

* Pickup Location
* Dropoff Location
* Pickup Date
* Pickup Time
* Passenger Count
* Vehicle Type

Buttons:

* Check Availability

Add stylish glassmorphism or luxury card design.

---

## Why Choose Us Section

Cards with icons.

Include:

* Professional Chauffeurs
* Luxury Fleet
* 24/7 Availability
* On-Time Guarantee
* Airport Specialists
* Safe & Secure

Add subtle hover animations.

---

## Fleet Preview Section

Display 3–4 featured vehicles.

Each card includes:

* Vehicle image
* Vehicle name
* Passenger capacity
* Short description
* Pricing starting point
* “View Details” button

Suggested vehicles:

* Mercedes S-Class
* Cadillac Escalade
* Lincoln Stretch Limo
* Rolls-Royce Ghost

---

## Testimonials Section

Luxury card carousel.

Include:

* Customer name
* Rating stars
* Review text
* Optional profile image

Use smooth slider animation in VanillaJS.

---

## Statistics Section

Animated counters.

Examples:

* 10+ Years Experience
* 5000+ Happy Clients
* 50+ Luxury Vehicles
* 24/7 Customer Support

Animate numbers on scroll.

---

## CTA Banner

Large elegant call-to-action section.

Text:
“Experience First-Class Ground Transportation”

Button:
“Reserve Your Ride”

---

# Fleet Page Requirements

Create a luxury vehicle showcase.

Each vehicle card should contain:

* Large image
* Vehicle name
* Passenger capacity
* Luggage capacity
* Features list
* Hourly rate
* Airport transfer rate
* Book button

Vehicles should have hover effects.

Add filtering system using VanillaJS.

Filters:

* SUV
* Sedan
* Stretch
* Executive

Include at least 8 vehicles.

---

# Services Page Requirements

Create sections for:

* Airport Transfers
* Corporate Travel
* Weddings
* Prom Nights
* Special Events
* City Tours
* Hourly Chauffeur
* VIP Transportation

Each service section includes:

* Large image
* Description
* Benefits
* CTA button

Alternate layouts for visual variety.

---

# About Page Requirements

Include:

* Company story
* Mission statement
* Team section
* Luxury experience philosophy
* Timeline/history
* Awards or achievements

Add elegant animations.

Include a premium office/chauffeur image section.

---

# Contact Page Requirements

Include:

* Contact form
* Google Maps embed placeholder
* Business info
* Phone number
* Email
* Office address
* Business hours

Contact form fields:

* Name
* Email
* Phone
* Subject
* Message

Add frontend validation using VanillaJS.

---

# Booking Page Requirements

This is the most important page.

Create a premium multi-step booking form.

## Step 1

Trip Details:

* Pickup location
* Dropoff location
* Date
* Time
* Number of passengers
* Number of luggage

## Step 2

Vehicle Selection:

* Vehicle cards
* Pricing
* Features
* Select vehicle button

## Step 3

Customer Information:

* Full name
* Email
* Phone number
* Special requests

## Step 4

Booking Summary:

* Ride details
* Selected vehicle
* Estimated price
* Confirmation button

Use animated transitions between steps.

Add progress bar.

Frontend only.
Do NOT implement backend.

Use localStorage to temporarily save booking data.

---

# JavaScript Features

Implement the following using VanillaJS:

## Animations

* Fade-in on scroll
* Reveal animations
* Counter animations
* Navbar scroll effects
* Button ripple effects
* Image hover interactions

---

## Mobile Menu

Animated hamburger menu.

Requirements:

* Slide-in animation
* Close on outside click
* Close on link click
* Body scroll lock when open

---

## Form Validation

Validate:

* Required fields
* Email format
* Phone format
* Empty inputs

Show elegant error messages.

---

## Booking System UI Logic

Implement:

* Step navigation
* Data persistence
* Booking summary generation
* Vehicle selection state

---

## Testimonials Slider

Create custom VanillaJS slider.

Features:

* Auto play
* Manual controls
* Responsive behavior
* Smooth transitions

---

## Scroll Animations

Use Intersection Observer API.

Animate:

* Sections
* Cards
* Images
* Statistics

---

# File Structure

/project-root
│
├── index.html
├── fleet.html
├── services.html
├── about.html
├── contact.html
├── booking.html
│
├── /css
│   ├── style.css
│   ├── responsive.css
│   ├── animations.css
│
├── /js
│   ├── main.js
│   ├── booking.js
│   ├── slider.js
│   ├── animations.js
│   ├── validation.js
│
├── /assets
│   ├── /images
│   ├── /icons
│   ├── /videos
│
└── /fonts

---

# UI/UX Guidelines

The UI should feel:

* Elegant
* Smooth
* Expensive
* Spacious
* Professional
* Minimalistic

Avoid:

* Cluttered layouts
* Cheap-looking gradients
* Overly bright colors
* Cartoonish UI
* Excessive animations

Use:

* Soft shadows
* Smooth transitions
* Large typography
* Spacious sections
* Premium spacing system
* Rounded corners carefully
* High-quality imagery

---

# Animation Style

Animations should be:

* Smooth
* Slow-premium feel
* Subtle
* Not distracting

Use:

* opacity transitions
* translateY reveals
* scaling hover effects
* smooth easing

Avoid:

* flashy effects
* bouncing animations
* neon cyberpunk effects

---

# Additional Requirements

## Image Usage

Use royalty-free luxury car images.

Recommended sources:

* Unsplash
* Pexels

---

## Icons

Use:

* Font Awesome
  OR
* Lucide icons via CDN

---

## Code Quality

The codebase must:

* Be clean
* Be modular
* Be well-commented
* Follow consistent naming
* Avoid duplicate logic
* Use reusable utility classes

---

# Deliverables

The AI agent should generate:

1. All HTML pages
2. All CSS files
3. All JavaScript files
4. Responsive design
5. Working navigation
6. Functional booking UI
7. Smooth animations
8. Clean folder structure
9. SEO metadata
10. Placeholder assets references

---

# Important Technical Constraints

* Use ONLY VanillaJS
* No frameworks
* No TypeScript
* No backend
* No database
* No build tools required
* Website must run by simply opening index.html

---

# Expected Final Quality

The final website should feel similar in quality to:

* Premium chauffeur companies
* Executive transportation services
* High-end luxury car rental brands
* Modern limousine booking websites

The result should look realistic enough to be used as an actual business website.

---

# Final Instruction To AI Agent

Generate the ENTIRE project with complete code.

Do not ask clarification questions.

Make reasonable professional design decisions where necessary.

Prioritize:

* luxury aesthetics
* responsiveness
* smooth interactions
* clean architecture
* modern UI/UX
* maintainable code

Every page must feel polished and production-ready.
