# Project rules

- Serve the fixed downloadable CV through a Lovable Assets pointer so the uploaded PDF stays outside source control.
- Preserve existing portfolio experience and defer conflicting resume facts to the owner instead of silently replacing them.
- The Mac and iPhone style experience is the site home at /; classic pages stay reachable by URL but nothing in the new experience, sitemap or llms.txt links to them, and OS apps reuse the classic components' exported data so content is never duplicated.
- Pick the Mac or iPhone interface by viewport width with the shared mobile hook, and share app content between both shells.
- Share exploration notifications between both OS shells, using their existing app launch callbacks; keep them local and start phone notifications only after the lock screen closes so they never require browser permission or interrupt entry.