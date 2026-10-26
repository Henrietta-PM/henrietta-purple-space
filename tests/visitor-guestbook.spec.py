import asyncio
import unittest
from playwright.async_api import async_playwright


class VisitorGuestbookRules(unittest.TestCase):
    def test_public_read_and_required_consent(self):
        asyncio.run(self.check_rules())

    async def check_rules(self):
        async with async_playwright() as playwright:
            browser = await playwright.chromium.launch(headless=True)
            page = await browser.new_page(viewport={"width": 1280, "height": 1800})
            await page.goto("http://localhost:8080")
            results = await page.evaluate("""async () => {
              const { supabase } = await import('/src/integrations/supabase/client.ts');
              const read = await supabase.functions.invoke('visitor-guestbook', { method: 'GET' });
              const rejected = await supabase.functions.invoke('visitor-guestbook', {
                body: { name: 'Consent test', message: 'Must not publish', consent: false }
              });
              return { publicRead: !read.error && Array.isArray(read.data.posts), rejectedStatus: rejected.error?.context?.status };
            }""")
            self.assertTrue(results["publicRead"])
            self.assertEqual(results["rejectedStatus"], 400)
            await browser.close()


if __name__ == "__main__":
    unittest.main()