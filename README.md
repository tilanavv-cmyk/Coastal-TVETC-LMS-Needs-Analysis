# Edubyte × Coastal KZN TVET College
## Digital Learning & Digital Transformation Needs Analysis — Temporary Response Portal

This bundle is designed as a temporary, branded response platform for Coastal KZN TVET College.

### What is included
- `index.html` — multi-section respondent survey
- `admin.html` — lightweight response dashboard + CSV export
- `survey-config.js` — the questionnaire content
- `app.js` — navigation, autosave and submission logic
- `admin.js` — dashboard aggregation
- `netlify/functions/submit-survey.js` — secure submission endpoint
- `netlify/functions/admin-responses.js` — token-protected response endpoint
- `supabase-schema.sql` — database table
- `assets/edubyte-logo.png` — web-ready Edubyte logo
- `netlify.toml` — Netlify configuration

### Deployment
1. Create or select the Supabase project that will temporarily hold the responses.
2. In Supabase SQL Editor, run `supabase-schema.sql`.
3. Deploy this folder to Netlify.
4. In Netlify → Site configuration → Environment variables, add:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_TOKEN` (create a long random secret)
5. Redeploy.
6. Survey URL: the site root `/`
7. Admin dashboard: `/admin.html`

### Optional email acknowledgements
If you want Resend to acknowledge respondents and notify Edubyte, also add:
- `RESEND_API_KEY`
- `SURVEY_FROM_EMAIL` (must be a verified sender)
- `SURVEY_NOTIFY_EMAIL` (optional internal notification recipient)

### Privacy / security design
- Supabase service-role key is never exposed in browser code.
- No public database read/write policy is created.
- Survey submissions go through a Netlify Function.
- Admin response retrieval requires the `ADMIN_TOKEN`.
- Browser autosave uses localStorage only until final submission.
- For a temporary project, this is intentionally lightweight. For a permanent institutional deployment, replace the shared admin token with proper user authentication and define a formal retention policy.

### Local preview
Open `index.html` directly to preview the survey. In local file preview mode, the Submit button downloads a JSON copy instead of attempting to send data.

### Important source fidelity note
The portal follows the supplied 19-page questionnaire. It does not add a new standalone Marketing / Communications section beyond the questions already present in the source questionnaire.
