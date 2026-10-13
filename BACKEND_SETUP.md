# IRHA backend — what is ready and what is needed

## Implemented

- Validated enquiry form and secure server-side POST endpoint.
- Database migration for private enquiries and durable rate limiting.
- Server-only Supabase credentials; public clients cannot read enquiries.
- A non-sensitive health endpoint and a local read-only configuration checker.
- Useful unconfigured state: validate, copy or download an enquiry draft without claiming submission.
- Correct service selection for enquiry and document-requirement buttons.

## Required to enable live enquiries

1. **Supabase project URL** — from your Supabase project settings.
2. **Supabase service-role server key** — enter this directly in the hosting environment settings as `SUPABASE_SERVICE_ROLE_KEY`. Do not send it in a screenshot or paste it into ordinary chat. This implementation uses the server key; it does not need a browser/anonymous key.
3. **Run both SQL files** in Supabase SQL Editor, in order: `001_enquiries.sql`, then `002_backend_health.sql`.
4. **Random rate-limit salt** — generate a long random value and set `ENQUIRY_RATE_LIMIT_SALT`; this is configuration we can generate, not a business detail you need to invent.
5. **Website origin** — set `NEXT_PUBLIC_SITE_URL` to the final domain. The private preview can be used while reviewing.

Environment names:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.example
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=enter-securely-in-host-settings
ENQUIRY_RATE_LIMIT_SALT=generate-a-long-random-value
```

For local development, copy `.env.example` to `.env.local`. Run `npm run check:backend` after filling the values. In the hosted Sites repository run the same script; it is independent of the frontend runtime.

Once configured: restart/redeploy, check `/api/health`, submit one test enquiry and confirm the record in the Supabase dashboard. Verify anonymous access is denied before collecting real customer data. No live credentials or live database test were available during implementation.

## Business information to confirm

- Current IRHA phone and WhatsApp number with country code, business email, and address if it should be published.
- Who will monitor and respond to enquiries. Initially this is done through the Supabase dashboard; no dedicated admin login/dashboard is included.
- Privacy contact, data retention period and deletion request process.
- Current availability, checklists and commercial terms. Previously supplied checklists are marked as requiring current confirmation.

## Optional email notifications (not part of the current submission flow)

If email alerts are wanted, confirm the recipient inbox, verified sending domain, and preferred transactional email provider. Provider credentials must be configured securely. Enquiries are currently stored in the database only; no emails or WhatsApp messages are sent automatically.

## Content incorporated

IRHA ANSARI TRAVELS; exclusive B2B services; 11+ years in visa processing and travel services; Managing Director Younus Malkani; staff support in Makkah; group/individual services with or without BRN coordination where available; long-stay/Iqama assistance enquiries; hotel/catering BRN; transport and enquiries about 2026–2027 model buses; service-first positioning and competitive tailored quotations.

Historic rates, expired promotions, fixed approval/issuance promises, and Malkani-only establishment/agreement details are intentionally not published.

## Navigation reliability update
Navigation uses native anchors and the mobile menu uses native HTML details/summary, so both work without JavaScript. The enquiry form has a native POST fallback with a readable server response; copy/download enhancements appear only after JavaScript initializes. JavaScript-free submissions retain the same validation and backend availability checks.
