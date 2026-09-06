# Prima16 Extras

Change orders and T&M tickets as numbered A4 PDFs.

- Site: https://extras.prima16.com
- Family: [Prima16](https://prima16.com) · sibling of [Документи](https://docs.prima16.com)
- Operator: Tsanko Valentinov Tsankov, trading as Prima16 (Bulgaria)
- Payments: Paddle (no Stripe, no subscription in v1)

Anyone can fill a form and download a PDF with no account. Free PDFs include a footer. A one-time Paddle unlock removes it on this device.

## Local

```bash
npm install
npm run dev
```

Default locale is Bulgarian on `/`. English is `/en`.

## Live (Hobby / €0)

Do **not** put this back through Lovable. Importing the repo there still spends credits to edit. Host it on Vercel Hobby from this repo.

1. Cloudflare DNS for `prima16.com`:
   - Type `CNAME`
   - Name `extras`
   - Target `cname.vercel-dns.com`
   - Proxy optional; if proxied, SSL Full
2. Vercel project `prima16-extras` (Prima16 team, Hobby)
   - Add domain `extras.prima16.com`
3. Search Console: **new** property `https://extras.prima16.com` (do not fold into the apex only)
   - Submit `https://extras.prima16.com/sitemap.xml`
4. Stats: Vercel Analytics (free) on this project only. No paid analytics.
5. Paddle: two new products on the existing seller
   - Clean PDF, one type, this device — €1.99
   - This device, all Extras generators — €19.99
   - Webhook: `https://extras.prima16.com/api/paddle/webhook`
   - Leave Документи products untouched

Hub card copy is in `HUB_CARD.md`.
