# Social Integration Deployment Guide  
Apify actors + Supabase (back-end) + React (front-end)

---

## 1  Prerequisites

| Tool / Service | Purpose | Quick Link |
|---------------|---------|-----------|
| **Apify account** | Runs the scrapers (“actors”). | https://apify.com |
| **Apify API token** | Auth for all Edge Function → Apify calls. | Apify → Settings → Integrations |
| **Supabase project** | DB, Edge Functions, Storage, Auth. | https://supabase.com |
| **Supabase CLI** (`supabase`) | Deploy SQL, functions, schedules, secrets. | `npm i -g supabase` |
| **Node ≥ 18 & npm** | Build / run the React front-end. | |
| **Git** | Pull / commit code, migrations, functions. | |

> Keep `APIFY_TOKEN` secret — never commit it.

---

## 2  Database Schema

Single-table strategy: all metrics live in `social_metrics` (one row per **creator + platform**).  
Additional tables keep account handles and job tracking.

```
supabase/migrations/20250625_social_media_integration.sql
```

Objects created:

* `creators_social_accounts` – handle + actor config  
* `social_jobs` – each Apify run  
* `social_metrics` – normalized snapshot (JSONB `platform_data` for extras)  
* `admin_operations` – audit log  
* `social_platform_type`, `social_job_status` (enum)  
* `v_creator_social_overview` – latest snapshot per account

Apply locally:

```bash
git pull
supabase db reset             # wipes & seeds local
# or prod:
# supabase db push            # runs pending migrations
```

---

## 3  Secrets

```bash
supabase secrets set APIFY_TOKEN="YOUR_REAL_APIFY_TOKEN"
```

*(runs once per environment)*

---

## 4  Edge Functions (serverless)

| Function | Trigger | What it does |
|----------|---------|--------------|
| `connect-social-account` | HTTP (frontend) | Validates handle, inserts/updates `creators_social_accounts`, *triggers Apify run(s)*, inserts `social_jobs`. |
| `poll-apify-jobs` | CRON 5 min | Checks Apify run status, fetches dataset, **normalizes & upserts** into `social_metrics`, updates job + account status. |
| `schedule-social-refreshes` | CRON 4 h | Finds accounts whose `next_run` ≤ NOW, kicks off new Apify runs, writes new `social_jobs`, updates `next_run`. |
| `refresh-all-social-accounts` | Admin HTTP | Force-sets `next_run = NOW` for a batch (rate-limited). |

### Deploy / update

```bash
# link CLI to project once
supabase link --project-ref YOUR_PROJECT_REF

supabase functions deploy connect-social-account        --no-verify-jwt
supabase functions deploy poll-apify-jobs               --no-verify-jwt
supabase functions deploy schedule-social-refreshes     --no-verify-jwt
supabase functions deploy refresh-all-social-accounts   --no-verify-jwt
```

---

## 5  Cron schedules

```bash
# poll Apify every 5 min
supabase functions schedule create poll-apify-cron \
  --function-name poll-apify-jobs \
  --schedule "*/5 * * * *" \
  --description "Poll Apify jobs"

# schedule refresh finder every 4 h
supabase functions schedule create social-refresh-cron \
  --function-name schedule-social-refreshes \
  --schedule "0 */4 * * *" \
  --description "Schedule social data refresh"
```

Check:

```bash
supabase functions schedule list
```

---

## 6  Apify actor mapping

| Platform | Primary actor | Secondary / detailed actor |
|----------|---------------|----------------------------|
| instagram | `apify/instagram-profile-scraper` | — |
| tiktok    | `apify/tiktok-scraper` | `clockworks/tiktok-profile-scraper` |
| youtube   | `apify/youtube-channel-scraper` | `streamers/youtube-channel-scraper` |
| linkedin  | `apify/linkedin-profile-scraper` | `ahmed-khaled/linkedin-engagement-scraper` |
| twitter   | `apify/twitter-scraper` | — |

Dual-actor platforms get both runs; Edge logic merges datasets before writing `social_metrics`.

---

## 7  Front-end integration

1. **Env vars**

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

2. **Components added**

* `src/components/creator/SocialPlatformConnectApify.tsx` – connect UI  
* `src/components/creator/SocialMetricsCards.tsx` – metrics display  
* `src/pages/creator/SocialAccounts.tsx` – page wrapper  
* Sidebar link & routes updated.

3. **Build**

```bash
npm ci
npm run build
# deploy /dist with Vercel / Netlify / S3 / Cloudflare …
```

---

## 8  One-shot deploy script (optional)

```bash
scripts/deploy-social-integration.sh
```

Runs: migrations → edge deploy → schedules → secret set → smoke test.

---

## 9  Smoke-test checklist

1. Creator navigates to **Social Accounts** → connects Instagram handle.  
2. Toast “Connection Started” appears; DB `creators_social_accounts.status = running`.  
3. Wait ≤ 5 min → `social_metrics` row appears; UI card shows followers.  
4. Supabase Logs: no errors for `poll-apify-jobs`.  
5. Cron `social-refresh-cron list` shows next run scheduled.

---

## 10  Troubleshooting

| Problem | Likely cause | Fix |
|---------|--------------|-----|
| 500 “APIFY_TOKEN not set” | Secret missing | `supabase secrets set APIFY_TOKEN=...` |
| Edge function returns **403** | Missing `Authorization` header from frontend | pass `access_token` in request |
| Account stuck in *running* | `poll-apify-jobs` schedule missing or failing | check `supabase functions logs poll-apify-jobs` |
| Apify error *page-not-found* | Actor ID not URL-encoded | function now replaces `/` with `~` |
| Metrics `null` | Actor JSON changed | adjust transformer in `poll-apify-jobs` |
| Too many Apify CUs | Lower refresh frequency `REFRESH_INTERVAL_HOURS` |

---

## 11  FAQ

**Do creators need to log in to social platforms?**  
No. Actors scrape public data; creators only supply handles/URLs.

**How often is data refreshed?**  
Every 7 days (4 h scheduler just *decides* which accounts are due).

**Where is engagement rate stored?**  
`social_metrics.engagement_rate` (percentage, already calculated).

**Can I add another platform?**  
Add enum value, actor mapping, transformer in `poll-apify-jobs`, update front-end list.

---

## 12  Back-out / Delete

```bash
-- remove cron
supabase functions schedule delete poll-apify-cron
supabase functions schedule delete social-refresh-cron

-- (optional) drop tables
drop table social_metrics, social_jobs, creators_social_accounts cascade;
```

---

Deployment complete — happy shipping 🚀
