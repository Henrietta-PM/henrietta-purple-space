## MyPvrpleSpace: The Product Museum

### Concept
Create a realistic, interactive architectural tour inspired by the Louisiana Museum of Modern Art in Denmark. Use its relationship between landscape, pavilions and glass corridors as inspiration, not an exact reconstruction or an affiliation with the museum.

Start with a separate museum experience so the working portfolio remains intact while Henrietta reviews it.

### Visitor experience
- Open into a landscaped museum campus with an animated visitor and clearly identifiable product pavilions.
- Tap a pavilion to send the visitor along a walkway to its entrance.
- Open the door on arrival and reveal an Enter action.
- Enter a closer gallery view featuring the actual product previews and existing case-study content, with a clear return to the grounds.
- Give Sally, Targett and ProxyMedicine prominent positions while keeping every existing project accessible.
- Keep CV, Hire, Contact and a direct project list available without walking through the museum. Retain access to Letter and Shop without changing those pages.

### Visual direction
- Realistic daylight, textured surfaces, architectural glazing, planting and readable product signage.
- Preserve the portfolio's purple identity in restrained signage and existing interface controls, not as an all-purple environment.
- Use real project imagery and verified copy. Do not invent results, experience or architectural credentials.
- Provide reduced-motion behaviour and an accessible ordinary portfolio alternative.

### Technical approach
- Add a dedicated React Three Fiber museum route, compatible with the existing React 18 app.
- Reuse the current project data, CV asset pointer, booking links and case-study content.
- Source and validate licensed models for the visitor and realistic environment before referencing them. Use locally hosted assets, with no runtime dependency on external model servers.
- Source suitable architectural assets first. If a suitable museum model is unavailable, disclose an original custom-modelled interpretation rather than using placeholder buildings or claiming fidelity.
- Use waypoint-based walking, animation states for walking and door entry, and camera transitions. This is a single-visitor tour, not multiplayer.
- Load the 3D experience separately, cap rendering cost and provide a fallback if 3D is unavailable.

### Verification
Test pavilion selection, walking, door opening, entry, gallery return and the direct project alternative. Confirm CV download and booking remain available. Inspect desktop and phone views for visible scenery, legible controls and loading failures before presenting the museum.

### Scope
The first delivery is a reviewable museum experience, not an immediate replacement of the homepage. A faithful recreation of a real museum would require suitable plans or a licensed model and is outside this first interpretation.