# Project rules

- Serve the fixed downloadable CV through a Lovable Assets pointer so the uploaded PDF stays outside source control.
- Preserve existing portfolio experience and defer conflicting resume facts to the owner instead of silently replacing them.
- The Mac and iPhone style experience is the site home at /; classic pages stay reachable by URL but nothing in the new experience, sitemap or llms.txt links to them, and OS apps reuse the classic components' exported data so content is never duplicated.
- Pick the Mac or iPhone interface by viewport width with the shared mobile hook, and share app content between both shells.
- App organization uses a shared validated visitor-local layout and dnd-kit sensors for both shells; keep layout changes separate from portfolio content and use category-based folder names so rearranging never modifies owner data.
- Share exploration notifications between both OS shells, using their existing app launch callbacks; keep them local and start phone notifications only after the lock screen closes so they never require browser permission or interrupt entry.
- Camera and Photos share a visitor guestbook; anonymous submissions and private reports go through a validated edge function with atomic network throttling, and private photo storage is accessed only through service-generated signed URLs to keep write access out of the browser.
- Keep the existing letter launcher ID for saved layouts, but present it as Notes with shared note content; pass a note selection from widgets and note shortcuts so normal app launches open the note list.
- Notes uses single-screen folder/list/reader navigation on phone and independently scrollable folder/list/reader columns on Mac; retain working reader actions and omit owner-only authoring tools.