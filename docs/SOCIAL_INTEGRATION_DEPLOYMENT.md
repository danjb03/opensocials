# Social Media Integration Deployment Guide (Apify + Supabase)

This guide explains how to deploy the Apify–powered social-media integration for OpenSocials.

---

## 1  Prerequisites

| Tool | Purpose | Docs / Download |
|------|---------|-----------------|
| **Apify account** | Runs the social-media scrapers (“actors”). | https://apify.com/ |
| **Apify API token** | Authenticates Edge Functions when calling Apify. | Apify → Settings → Integrations → API |
| **Supabase CLI** (`supabase`) | Deploys edge functions, schedules, and migrations. | https://supabase.com/docs/guides/cli |
| **Node ≥ 18 LTS / npm** | Builds the frontend. |
| **Git** | Pull latest code & migrations. |

> Keep the token secret. **Never** hard-code it in source control.

---

## 2  Database Schema

The integration adds five objects:

* `social_platform_type`, `social_job_status` (enum types)  
* `creators_social_accounts`, `social_jobs`, `social_metrics`, `admin_operations` (tables)  
* `v_creator_social_overview` (view)

All objects are defined in  
`supabase/migrations/20250625_social_media_integration.sql`.

### Apply migration

```bash
# pull latest code
git checkout main && git pull

# apply schema locally (for dev)
supabase db reset      # or supabase db push
# or in prod: use Supabase Dashboard → SQL editor → run file
```

---

## 3  Edge Functions

| Function | Role |
|----------|------|
| `connect-social-account` | Called by frontend. Validates handle, triggers Apify actor run(s), inserts job rows. |
| `poll-apify-jobs` | Runs every 5 min. Pulls finished Apify runs, transforms data, stores `social_metrics`. |
| `schedule-social-refreshes` | Cron (4 h). Picks accounts whose `next_run` is due and starts new Apify runs. |
| `refresh-all-social-accounts` | Admin-only HTTP endpoint to force-refresh everything (rate-limited). |

### Deploy / update functions

```bash
# 1. Set Supabase project keys
export SUPABASE_ACCESS_TOKEN=<your_personal_access_token>
supabase link --project-ref <PROJECT_REF>

# 2. Deploy each function (–no-verify-jwt for public endpoints)
supabase functions deploy connect-social-account --no-verify-jwt
supabase functions deploy poll-apify-jobs          --no-verify-jwt
supabase functions deploy schedule-social-refreshes --no-verify-jwt
supabase functions deploy refresh-all-social-accounts
```

> If this is your first deploy run `supabase login` to auth the CLI.

---

## 4  Project Secrets

```bash
# One-time: add Apify token to Supabase secrets
supabase secrets set APIFY_TOKEN=<your_real_apify_api_token>
```

---

## 5  Cron / Schedules

```bash
# Poll Apify every 5 minutes
supabase functions schedule create poll-apify-cron \
  --function-name poll-apify-jobs \
  --schedule "*/5 * * * *" \
  --description "Poll Apify jobs"

# Kick refresh finder every 4 hours
supabase functions schedule create social-refresh-cron \
  --function-name schedule-social-refreshes \
  --schedule "0 */4 * * *" \
  --description "Schedule social data refreshes"
```

Verify schedules:

```bash
supabase functions schedule list
```

---

## 6  Frontend Build & Deploy

```bash
# install & build
npm ci
npm run build    # output in /dist

# deploy /dist to your hosting (Vercel, Netlify, S3, etc.)
```

---

## 7  Smoke-Test Checklist

1. Log in as creator → **Connect Account** (`/creator/social-accounts`)  
   • expect toast “account connected”  
2. Wait ≤5 min → metrics appear in dashboard.  
3. In Supabase » Logs, confirm no errors from `poll-apify-jobs`.  
4. In DB → `social_metrics` one row exists for the account.

---

## 8  Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| `500` “APIFY_TOKEN not set” | Secret missing | `supabase secrets set APIFY_TOKEN=…` |
| `connect-social-account` returns *403 Unauthorized* | Creator not logged in or wrong token | Pass `supabase.auth.session().access_token` in header |
| Social account stuck in **pending/running** | Poll job schedule missing | Verify `poll-apify-cron` exists and logs show success |
| Job status **failed** | Actor exceeded rate-limit / captcha | Re-run, consider residential proxy add-on in Apify |
| Growth shows `N/A` | Need at least 2 snapshots | Wait 24 h+ or seed `followers_prev` columns |
| CORS error from frontend | Your domain not allowed | Add domain to Supabase » Auth » Settings **Allowed Origins** |

---

## 9  FAQ

**Q: Do creators need to log in to social platforms?**  
A: No. We scrape only public data with Apify actors; creators just provide their handle/profile URL.

**Q: How often is data refreshed?**  
A: Default 7 days (configurable in `schedule-social-refreshes` via `REFRESH_INTERVALS`).

**Q: Costs?**  
A: Apify charges compute units per run. Typical profile run uses 0.10 – 0.20 CU. Budget accordingly.

---

Deployment complete! Reach out in `#devops` if anything is unclear.  
Happy scraping 🚀
