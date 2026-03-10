## Plan: Update Portfolio with Targett.app & NYSC Attendance System

### Summary

I've already copied the necessary assets from your other Lovable projects:

- **Targett logo** (`targett-logo-featured.png`) for the hero badge
- **Targett OG image** (`targett-preview-new.png`) for the updated project card
- **NYSC preview** (`nysc-preview.png`) for the new project card

Here's what I'll change:

### 1. Update Hero Featured Badge (Hero.tsx)

- Replace the Bloomie logo/text with Targett.app logo and name
- Still Link to /projects
- Import the new `targett-logo-featured.png`

### 2. Update Featured Projects (FeaturedProjects.tsx)

- Add Targett.app as the first featured card (before ProxyMedicine)
- Tags: `["AI Search", "SEO"]`, link: `https://www.targett.app`, `isLive: true`
- Use the new `targett-preview-new.png` image
- Keep ProxyMedicine as second featured card, remove Bloomie from featured (it stays on Projects page)

### 3. Update Projects Page (Projects.tsx)

- **Update Targett entry**: Change from "concept-stage AI travel planner" to its actual description as an AI search optimization platform. Update tags to `["AI Search", "SEO"]`. Mark as `isLive: true`. Use new preview image. Update responsibilities and achievements based on the actual product.
- **Add NYSC Attendance System**: New project entry with tags `["GovTech", "Attendance"]`, link to the deployed app, overview describing it as a QR-based check-in and management system for NYSC corps members. Use `nysc-preview.png`.
- Import the new `nysc-preview.png` asset

### 4. Files Changed

- `src/components/Hero.tsx` — swap featured badge to Targett
- `src/components/FeaturedProjects.tsx` — add Targett as first card, remove Bloomie
- `src/pages/Projects.tsx` — update Targett data, add NYSC project, import new image