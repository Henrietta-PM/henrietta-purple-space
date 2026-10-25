# Project rules

- Serve the fixed downloadable CV through a Lovable Assets pointer so the uploaded PDF stays outside source control.
- Preserve existing portfolio experience and defer conflicting resume facts to the owner instead of silently replacing them.
- Keep the museum on a lazy-loaded separate route and reuse portfolio project data and links so experimental 3D does not replace or duplicate the working portfolio.
- Use waypoint-based visitor movement and React state for museum phases, with per-frame transforms in refs, to keep the interface accessible and avoid rendering it every frame.