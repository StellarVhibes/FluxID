# Making FluxID data survive restarts on Render

## The problem

The backend stores usage events, feedback, and wallet/protocol history. By
default these are append-only JSONL files on the local filesystem:

| File | Written by |
|------|-----------|
| `events.jsonl` | `metrics.service.ts` (wallet connects, score runs) |
| `feedback.jsonl` | `metrics.service.ts` (user feedback) |
| `wallet_history.jsonl` | `history.service.ts` (per-wallet score history) |
| `protocol_history.jsonl` | `history.service.ts` (Protocol Intelligence cohort) |

By default they live in `<cwd>/data` — see `FLUXID_DATA_DIR` in
`metrics.service.ts` and `history.service.ts`.

On Render, that default location is on the **ephemeral filesystem**. It is
wiped:

- on every deploy (each push rebuilds a fresh container), and
- on free-tier **cold starts** — the instance sleeps after ~15 min idle and
  starts clean when it wakes.

When that happens the store is empty, so `/admin/stats` and `/admin/feedback`
honestly return all-zeros. That's what made the admin panel look like the
Refresh button was wiping data — it wasn't; the underlying files were gone.

The frontend keeps the last good snapshot on an empty refresh, but that's only
cosmetic. **To actually stop losing data, the store must live somewhere that
survives restarts.** Two ways to do that:

- **Option A — Upstash Redis (free, recommended).** No paid plan, no code
  change, works on Render's free tier. The metrics service auto-switches to
  Redis when its two env vars are present.
- **Option B — Render persistent disk (needs a paid instance).**

---

## Option A — Upstash Redis (free, recommended)

`metrics.service.ts` already supports this. When both env vars below are set it
writes usage events and feedback to Upstash Redis instead of local files; when
they're unset it falls back to JSONL. **No redeploy of code needed — just add
the env vars.**

### 1. Create a free Redis database

1. Go to <https://console.upstash.com> and sign up (free).
2. **Create Database** → any name → pick a region close to your Render region.
3. Open the database → **REST API** section → copy:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

### 2. Add them to Render

1. Backend service → **Settings → Environment → Add Environment Variable**.
2. Add both:
   ```
   UPSTASH_REDIS_REST_URL   = https://<your-db>.upstash.io
   UPSTASH_REDIS_REST_TOKEN = <your-token>
   ```
3. Save. Render redeploys. On boot the logs will show
   `Metrics store: Upstash Redis (durable)` — that confirms it switched.

### 3. Verify

```bash
# record an event
curl -X POST https://<your-backend>/events \
  -H 'content-type: application/json' \
  -d '{"type":"wallet_connect","wallet":"GABC...","network":"testnet"}'

# confirm it's counted
curl https://<your-backend>/admin/stats
```

Then trigger a manual redeploy (or let the instance cold-start) and hit
`/admin/stats` again — the count should **persist** instead of resetting to
zero. That's the durable proof you need for the 10+ wallet-interactions
screenshot.

> Free-tier Upstash allows a generous daily command quota — far more than a
> demo/campaign needs. Usage events and feedback are tiny.

---

## Option B — Render persistent disk (paid instance)

If you're already on a paid Render instance, a mounted disk also works and
keeps the JSONL files.

1. Backend service → **Settings → Disks → Add Disk**:
   - **Name:** `fluxid-data` (any name)
   - **Mount Path:** `/var/data`
   - **Size:** `1 GB` (JSONL is tiny)
2. **Settings → Environment** → add:
   ```
   FLUXID_DATA_DIR = /var/data
   ```
   Must match the mount path exactly. The backend does `mkdir -p` on startup.
3. Save and redeploy. Verify with the same curl steps as Option A.

> Persistent disks require a **paid instance type** — free-tier services can't
> attach one. That's why Option A (Upstash) is the recommended free path.

---

## One caveat — payment requests

`payment.service.ts` writes `.payment-requests.json` to `process.cwd()`
directly, **not** to Redis or `FLUXID_DATA_DIR`. These are short-lived payment
challenges (they expire via TTL), so losing them on restart is low-impact — a
user just requests a fresh challenge. Neither option above changes this, and
none is required for the metrics/feedback durability fix.
