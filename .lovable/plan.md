

## Plan: Create AFRIKA KOMMT! Application Presentation (PDF)

### Summary
Create a 4-slide presentation deck as a downloadable PDF, styled to match the portfolio's dark theme with purple accents. Output to `/mnt/documents/`.

### Design Direction
- **Background**: Deep dark purple (`#1E1A2E` — matching `253 35% 12%`)
- **Accent**: Vibrant purple (`#631FE0` — matching `253 90% 60%`)
- **Text**: White headers, light gray body text
- **Style**: Bold headers, minimal text, generous spacing, subtle accent lines/shapes
- **Font**: Clean sans-serif pairing (Space Grotesk-style for headers, Inter-style for body)

### Slide Layout (1920x1080 equivalent, landscape PDF)

**Slide 1 — My Aims for AFRIKA KOMMT!**
- Bold title with purple accent line
- 3-4 concise paragraphs with key phrases bolded
- Clean left-aligned layout with breathing room

**Slide 2 — Skills I Expect to Gain**
- 3 bullet points with icon-style purple dots
- Smaller closing line at bottom

**Slide 3 — Preferred Profile 1**
- Subtitle: "Fellow as Digitalization & AI Platform Specialist"
- "What I bring" section with 3 bullets
- Closing line

**Slide 4 — Preferred Profile 2**
- Subtitle: "Fellow in Strategic Product Management"
- "What I bring" section with 3 bullets
- Closing line

### Technical Approach
1. Discover available fonts via canvas-fonts directory
2. Use ReportLab (Python) to create a landscape PDF with 4 slides
3. Custom drawing for accent lines, shapes, and layout
4. QA via pdftoppm conversion and visual inspection
5. Output to `/mnt/documents/afrika_kommt_presentation.pdf`

### Files Changed
- No codebase changes — artifact generated to `/mnt/documents/`

