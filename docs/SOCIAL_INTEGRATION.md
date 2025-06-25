# Social Media Integration Guide  
Using Apify Scrapers with **OpenSocials**

---

## 1 · Overview
Creators can now link their Instagram, TikTok, YouTube, and LinkedIn profiles without any OAuth headaches.  
Instead of wrestling with every platform’s API, we trigger pre-built **Apify actors** that scrape public metrics and push the results into Supabase.

Key wins  
• No business-verification or token refresh flow  
• Unified data model for all platforms  
• Fully server-side – front-end stays lean  

---

## 2 · High-Level Architecture

```
Creator UI ──► connect-social-account (Edge Fn)
               │
               ▼
        Apify Run API  ◄── schedule-social-refreshes (cron)
               │
               ▼
   poll-apify-jobs (Edge Fn)
               │
               ▼
        social_metrics  (DB)
               │
               ▼
        React Metrics Cards
```

1. **Creator UI** calls `connect-social-account` with platform + handle.  
2. Edge function schedules an Apify run and writes a `social_jobs` row.  
3. `poll-apify-jobs` cron checks Apify, transforms raw JSON and stores a snapshot in `social_metrics`.  
4. `schedule-social-refreshes` cron keeps every account up-to-date (12 h IG, 24 h others).  
5. The React dashboard reads from view `v_creator_social_overview`.

---

## 3 · Platform ↔ Actor Map

| Platform   | Recommended Actor (slug)                                    |
|------------|-------------------------------------------------------------|
| Instagram  | `powerful_bachelor/instagram-profile-scraper-pro`           |
| TikTok     | `clockworks/tiktok-profile-scraper`                         |
| YouTube    | `streamers/youtube-channel-scraper`                         |
| LinkedIn   | `ahmed-khaled/linkedin-engagement-scraper`                  |

All actors return JSON; the Edge transformer normalises into:

```
followers, engagement_rate, views_avg, likes_avg, comments_avg,
posts_30d, last_post_date, posts_per_week, is_verified, …
```

---

## 4 · Setup

### 4.1 Prerequisites
* Supabase CLI ≥ 1.162  
* Node 18 LTS (for local development)  
* **APIFY_TOKEN** – create in Apify dashboard  

### 4.2 Database Migration
Apply `supabase/migrations/20250625_social_media_integration.sql`  
This creates:
- `creators_social_accounts`
- `social_jobs`
- `social_metrics`
- view `v_creator_social_overview`

```bash
supabase db push
```

### 4.3 Environment Secrets

```bash
supabase secrets set APIFY_TOKEN="paste-token-here"
```

### 4.4 Deploy Edge Functions

```bash
supabase functions deploy connect-social-account --no-verify-jwt
supabase functions deploy poll-apify-jobs        --no-verify-jwt
supabase functions deploy schedule-social-refreshes --no-verify-jwt
```

### 4.5 Schedule Cron Jobs

```bash
supabase functions schedule create poll-apify-cron \
  --function-name poll-apify-jobs \
  --schedule "*/5 * * * *"

supabase functions schedule create social-refresh-cron \
  --function-name schedule-social-refreshes \
  --schedule "0 */4 * * *"
```

---

## 5 · Using the Feature

### 5.1 Creator Flow
1. Navigate to **Creator → Social Accounts**.  
2. Select a platform and paste `@handle` or profile URL.  
3. Click **Connect**.  
4. Status badge shows **Pending → Running → Connected**.  
5. Metrics appear in **Analytics** within ~1 min.

### 5.2 Brand / Admin View
The same metrics are surfaced wherever you query `v_creator_social_overview`, enabling matchmaking algorithms or admin dashboards.

---

## 6 · Refreshing & Quotas

| Platform  | Interval | Avg CU / run* |
|-----------|----------|---------------|
| IG        | 12 h     | 0.15          |
| TikTok    | 24 h     | 0.10          |
| YouTube   | 24 h     | 0.05          |
| LinkedIn  | 24 h     | 0.10          |

\*CU = Apify compute unit. Adjust in `schedule-social-refreshes` if costs rise.

---

## 7 · Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Account stuck in **failed** | Actor blocked by platform | Verify handle is public, try again. |
| No metrics after 10 min | poll-cron not running | Check Supabase logs / cron schedule. |
| “APIFY_TOKEN not set” | Secret missing | `supabase secrets set APIFY_TOKEN=…` |
| Growth values `N/A` | Need baseline snapshot | Wait 24 h for second snapshot. |

---

## 8 · Customising

* **Add new platform**  
  1. Pick/Write an Apify actor.  
  2. Add slug to `PLATFORM_ACTORS`.  
  3. Create transformer in `poll-apify-jobs`.

* **Change refresh cadence**  
  Edit `REFRESH_INTERVALS` map in `schedule-social-refreshes`.

* **Expose more metrics**  
  Extend `social_metrics` table + transformer logic + UI cards.

---

## 9 · Resources

* Apify docs – https://docs.apify.com  
* Supabase edge functions – https://supabase.com/docs/functions  
* OpenSocials source – `/supabase/functions/` & `/src/components/creator/`

---

Happy scraping 🚀
