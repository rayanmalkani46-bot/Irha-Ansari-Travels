# IRHA ANSARI TRAVELS

A complete responsive B2B Umrah website using Next.js App Router, TypeScript, React and Tailwind CSS. Five principal pages, a privacy/credits page, accessible navigation and FAQs, licensed local photography, subtle photographic parallax, and a server-side Supabase enquiry endpoint.

## Local installation (downloadable Next.js source)

Install Node.js 22 LTS or later. Extract the ZIP, open the `IRHA_ANSARI_TRAVELS` folder in your terminal:

```bash
npm install
cp .env.example .env.local
npm run dev
```

On Windows Command Prompt use `copy .env.example .env.local`. In PowerShell use `Copy-Item .env.example .env.local`; if script policy blocks npm, use `npm.cmd install` and `npm.cmd run dev`.

Open http://localhost:3000. The enquiry form displays a clear notice until the three server-side settings below exist. In this state, Check Enquiry Details validates the fields, and Copy / Download enquiry draft lets visitors retain their own draft. These actions do not submit to IRHA. No fake success is shown.

```bash
npm run typecheck
npm test
npm run build
npm start
```

In the Sites repository, standard `dev`/`build` scripts use the supplied Vinext compatibility runtime for Cloudflare hosting. For native Next.js in that repository, use `npm run dev:next`, `npm run build:next`, and `npm run start:next`. The downloadable ZIP uses native Next.js scripts by default and excludes Sites runtime files.

## Pages and editing

- `/`: Home, six services, benefits, process, ground services, gallery, FAQs and enquiry CTA.
- `/visa-services`: Three detailed visa assistance sections and requirements CTAs.
- `/ground-services`: Hotel BRN, catering BRN and transport coordination.
- `/about`: Business-supplied experience, Managing Director and Makkah support details, without invented affiliations.
- `/contact`: Initial B2B enquiry, with service preselection via `?service=group` (also `individual`, `long-stay`, `hotel`, `catering`, `transport`). Add `&intent=requirements` for requirements requests.
- `/privacy`: Interim privacy information and image credits; complete the business privacy details before launch.

Central business details, navigation, services, FAQs and process copy are in `lib/content.ts`. Phone, email, WhatsApp and address start blank intentionally. Confirm these before adding them. The user-supplied 11+ years of experience, Managing Director Younus Malkani, Makkah staff support, BRN options and bus-model enquiry are included. Previous document checklists remain explicitly subject to current confirmation. Expired offers, old prices, guaranteed processing times and Malkani-only facts are excluded. Update page-specific copy in `app/`. Styling lives in `app/globals.css`; UI components in `components/irha/`. System serif and sans-serif fonts avoid external font requests. Images are local optimized WebP files using `next/image`. See `ASSETS.md` for sources and licenses.

## Supabase setup

1. Create a Supabase project. Open its SQL Editor and execute **all** of `supabase/migrations/001_enquiries.sql`, then `supabase/migrations/002_backend_health.sql`, in that order.
2. Copy the project URL and server-only service-role key from Supabase project API settings.
3. Set these in `.env.local` for local development, or your deployment platform’s encrypted environment settings:

```env
NEXT_PUBLIC_SITE_URL=https://your-confirmed-domain.example
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-server-only-service-role-key
ENQUIRY_RATE_LIMIT_SALT=a-long-random-secret
```

Generate the salt with a password manager or `openssl rand -hex 32`. Do not prefix any secret with `NEXT_PUBLIC_`. Never commit `.env.local`. Restart the local server / redeploy after changing configuration.

4. Run `npm run check:backend` locally to verify credentials, database tables and the RPC connection without creating an enquiry. The deployed `/api/health` route returns only readiness status, never credentials or enquiry data. Then submit one test enquiry. Confirm it appears in `public.enquiries` in the Supabase Table Editor. Database persistence is the success condition; email notification is not included. Your authorised team must monitor the table or implement its own approved notification workflow.
5. Verify that requests with the anonymous key cannot read `enquiries`, read `enquiry_rate_limits` or call `submit_enquiry`. There are no public RLS policies; both client roles are explicitly revoked. The RPC is granted only to `service_role`.
6. Confirm business privacy contact, retention period and data request process, and update `/privacy` before accepting real enquiries.

### Endpoint security

`POST /api/enquiries` checks same-origin requests, JSON content type, a streaming 16 KiB body limit, the shared Zod schema and a honeypot. The server calls one database RPC. An atomic database bucket limits each hashed trusted client IP to five saved enquiries per hour. It is durable across server instances. Raw IP addresses are not stored. Expired buckets are cleaned during submissions.

Trusted IP headers: `cf-connecting-ip` on the hosted Cloudflare site; `x-vercel-forwarded-for` when `VERCEL` is set by Vercel. Other hosting environments share a conservative fallback bucket until you adapt the trusted proxy integration. Do not blindly trust caller-supplied forwarded headers. Add a managed WAF/Turnstile if abuse volume warrants it; this is basic abuse protection, not bot-proof authentication. If RPC/database calls fail, the endpoint returns an error and the form retains inputs. No passports, uploads or identity documents are collected.

## Production deployment (native Next.js)

1. Put the ZIP source in your own Git repository and import it into Vercel as Next.js.
2. Use Node.js 22+, install `npm install`, build `npm run build`, default Next.js output.
3. Add the four environment values above. Configure your real domain and update `NEXT_PUBLIC_SITE_URL` to it.
4. Deploy, then test all navigation, service preselection, mobile menu, keyboard focus, FAQ toggles and enquiry success/failure against the real database.
5. Confirm the production trusted-IP behaviour and verify public database access is denied.

On a Node.js host: run `npm install`, `npm run build`, then `npm start` behind an HTTPS reverse proxy. Adapt the trusted client-IP extraction for your proxy; otherwise the shared rate limit applies.

## Motion / genuine 360° upgrade

The hero is a **flat photograph with restrained desktop parallax**, not a 360° view. Text does not move. Mobile and reduced-motion users receive a static photograph. No verified licensed full-orbit asset was available for this build. A later upgrade requires commercially licensed orbital footage, an aligned full-orbit image sequence, or an accurate textured model with surrounding context. See `ASSETS.md`. Keep this photographic fallback for mobile, slow networks, reduced motion and failed media loads.

## Reference and guidelines

The supplied screenshot of Foysal alam’s Dribbble concept (https://dribbble.com/shots/25667880-Hajj-Umrah-Agency-Website) informed composition only. Branding, text and photography are original/sourced separately. The four supplied Vercel guideline files were recovered and read. Relevant composition, server-first rendering, limited client boundaries, passive listeners, local imagery and accessible form guidance were applied. React’s experimental ViewTransition component was deliberately not enabled in the Vinext compatibility runtime; restrained CSS transitions and reduced-motion fallbacks avoid unsupported APIs.

## Verification completed

- Native Next.js production build and Sites/Vinext production build passed.
- Strict TypeScript checks passed.
- `node tests/verify.mjs`: 43 assertions covering valid/invalid data, origin/content-type/body limits, unconfigured endpoint, database success/rate-limit/error/network branches with mocked database responses, page destinations, service query links and local image presence.
- Responsive CSS was reviewed for desktop/tablet/mobile breakpoints, single-column small-screen forms, flexible grids, focus visibility and reduced motion.
- Browser-control capability was unavailable in this environment. No browser screenshot, visual viewport measurement, keyboard interaction or live Supabase database test is claimed. Use the deployed site as the responsive preview and complete the manual checks below.

## Before launch

- Confirm phone/WhatsApp, email, address (if publishing), final domain and optional approved logo.
- Confirm service availability, applicable visa requirements and enquiry handling responsibility.
- Configure Supabase, run migration, test real persistence and anonymous access denial.
- Complete privacy contact, retention policy and data request process; agree an operational monitoring process.
- Test at 375px, 768px and 1440px widths and 200% zoom; verify no horizontal overflow, visible focus, menu Escape, query preselection, FAQ behaviour and reduced motion.
- Use a licensed genuine orbital asset only if upgrading to 360°. No rates, approval guarantees or unverified processing times are published.

## Navigation reliability update
Navigation uses native anchors and the mobile menu uses native HTML details/summary, so both work without JavaScript. The enquiry form has a native POST fallback with a readable server response; copy/download enhancements appear only after JavaScript initializes. JavaScript-free submissions retain the same validation and backend availability checks.
