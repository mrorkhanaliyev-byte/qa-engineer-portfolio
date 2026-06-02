# 08 — Performance Testing with k6

Load, stress, and smoke testing the **[restful-booker](https://restful-booker.herokuapp.com/apidoc/index.html)** REST API with [Grafana **k6**](https://k6.io/) — the *same* API tested **functionally** in [04 — Postman + Newman](../04-postman-api-testing/).

That's the point of this section: testing one API on **two axes**.

> **Does it work?** → functional API tests (section 04)
> **Does it hold up?** → performance tests (this section)

[![k6 Performance](https://github.com/mrorkhanaliyev-byte/qa-engineer-portfolio/actions/workflows/k6.yml/badge.svg)](https://github.com/mrorkhanaliyev-byte/qa-engineer-portfolio/actions/workflows/k6.yml)

![k6](https://img.shields.io/badge/k6-7D64FF?logo=k6&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![CI](https://img.shields.io/badge/CI-GitHub_Actions-2088FF?logo=githubactions&logoColor=white)

---

## The three test types — and why each exists

Performance testing isn't one thing. Each script answers a different question:

| Script | Profile | Question it answers | Runs in CI? |
|---|---|---|---|
| [`smoke.js`](./tests/smoke.js) | 1 VU, 5 iterations | *"Does the system serve a single user cleanly?"* — the first gate before any bigger test | ✅ **Yes** |
| [`load.js`](./tests/load.js) | Ramp to 10 VUs, hold 1m | *"At expected concurrency, are latency and error rate acceptable?"* | ❌ No (run locally) |
| [`stress.js`](./tests/stress.js) | Step to 25 VUs | *"Where does it START to degrade?"* — find the ceiling for capacity planning | ❌ No (run locally) |

**A smoke test isn't a load test.** If the API can't serve *one* user without errors, there's no point measuring it under 10. Smoke runs on every deploy; load and stress are deliberate, occasional exercises.

---

## ⚠️ Ethics: this targets a free public server

restful-booker is a **free public demo** on a shared Heroku dyno. So:

- **VU counts are deliberately modest** (load peaks at 10, stress at 25). Load testing is *not* a licence to DoS infrastructure you don't own.
- **Only the smoke test runs in CI.** Running a 10-VU load test on every push would repeatedly hammer someone else's free server — that would be abusive. `load.js` and `stress.js` are run **locally and deliberately**.
- **The technique is what matters, not the absolute numbers.** Against owned staging infra you'd push to hundreds/thousands of VUs to find the real knee in the curve. The *profiles, metrics, and thresholds* here transfer directly; only the magnitude scales with the environment.

This restraint is itself part of the skill: a performance engineer who understands *blast radius*.

---

## What "pass/fail" means here — thresholds

A performance test is only a **gate** if it can fail the build. In k6 that's [thresholds](https://grafana.com/docs/k6/latest/using-k6/thresholds/): breach one and k6 exits non-zero → red CI.

**Correctness gates** (shared, in [`lib/config.js`](./lib/config.js)) apply to every scenario:

```js
http_req_failed: ['rate<0.01'],   // <1% of requests may fail at the HTTP level
checks:          ['rate>0.99'],   // ≥99% of functional checks must pass
```

**Latency budgets are set per-endpoint**, because a single endpoint shouldn't be allowed to hide regressions in the others. The load test uses **tagged thresholds**:

```js
'http_req_duration{name:GET /ping}':        ['p(95)<2000'],   // tiny, fast
'http_req_duration{name:GET /booking/:id}': ['p(95)<3000'],   // single record
'http_req_duration{name:GET /booking}':     ['p(95)<15000'],  // the 10 MB list — honestly loose
```

That `GET /booking` ceiling is deliberately generous, and the comment in the code says why (see the finding below). On owned infra with a paginated list, all three would be sub-second.

---

## Two real findings — surfaced *just by load-testing*

### 1. restful-booker defaults to **XML**, not JSON

k6 doesn't send an `Accept` header by default. Postman/Newman do. So the same endpoint that returned clean JSON in section 04 returned **XML** to k6 — and `res.json()` silently yielded nothing, failing every body assertion.

**Fix:** set `Accept: application/json` explicitly (`lib/config.js`). A genuine content-negotiation gotcha that only showed up because a *different client* (k6 vs Postman) hit the same API. Worth knowing for any API test.

### 2. Cold-start latency dominates the smoke test

The free Heroku dyno **sleeps when idle** and cold-starts on the first hit:

| | `GET /booking` p(95) | Why |
|---|---|---|
| **Smoke** (1 VU, cold dyno) | **~5 s** | dyno waking up + the full 10 MB list |
| **Load** (10 VUs, warm dyno) | **~340 ms** | dyno already warm, same endpoint |

Counter-intuitively, the API looked **slower under 1 user than under 10** — because the single user paid the cold-start tax. This is exactly the kind of thing performance testing exists to reveal, and it's why the smoke threshold for overall duration is generous (`p(95)<8000`) while the *controlled* write path is held tight (`create_booking_duration p(95)<3000`).

---

## Sample results

### Smoke — `k6 run tests/smoke.js` (1 VU, 5 iterations)

```
✓ ping is 201
✓ list is 200
✓ list is a non-empty array
✓ auth is 200 with token
✓ create is 200 with id
✓ read own booking is 200
✓ read own booking has firstname
✓ delete is 201

checks_total..................: 40    100.00% (40/40)
create_booking_duration p(95).: 162ms   ✓ <3000   (our controlled write path)
http_req_duration       p(95).: 5.13s   ✓ <8000   (cold-start + 10 MB list)
http_req_failed...............: 0.00%   ✓ <0.01
```

### Load — `k6 run tests/load.js` (ramp to 10 VUs, ~1m50s, warm dyno)

```
checks_total..................: 1308   100.00% (1308/1308)
http_reqs.....................: 981    (~8.8 req/s)
http_req_failed...............: 0.00%   ✓ <0.01
read_flow_errors..............: 0.00%   ✓ <0.05
GET /ping        p(95)........: 242ms   ✓ <2000
GET /booking/:id p(95)........: 223ms   ✓ <3000
GET /booking     p(95)........: 342ms   ✓ <15000
```

981 requests, **zero failures**, all per-endpoint budgets met.

---

## Designed to be a good citizen on a shared server

The scripts go out of their way **not** to pollute the public demo:

| Concern | How it's handled |
|---|---|
| Leftover test data | Smoke **creates its own booking, then deletes it** — never leaves orphans, never depends on other clients' volatile data |
| Polluting under load | `load.js` and `stress.js` are **read-only** — they exercise `GET` paths a browsing user hits, never `POST` hundreds of bookings |
| Flaky shared data | All `res.json()` calls are guarded (`safeJson` / `jsonIf200`) — a plain-text error page from the shared server returns `null` instead of throwing and aborting the VU |
| Abusive CI load | Only the 1-VU smoke test runs in CI; load/stress are local-only |
| Realistic shape | `sleep()` think-time between actions — load that looks like users, not a tight loop |

---

## Project structure

```
08-performance-k6/
├── README.md
├── package.json              # convenience npm wrappers (k6 is a standalone binary)
├── lib/
│   └── config.js             # BASE_URL, headers (incl. the Accept fix), shared thresholds, sample payload
└── tests/
    ├── smoke.js              # 1 VU  — CI gate (functional + latency on a single user)
    ├── load.js               # 10 VUs — read-only browse flow, tagged per-endpoint thresholds
    └── stress.js             # 25 VUs — find the degradation point (local only)
```

---

## Running locally

k6 is a **standalone binary** (Go), not an npm package — install it first:

```bash
# macOS
brew install k6
# Windows
winget install k6 --source winget        # or: choco install k6
# Linux (Debian/Ubuntu)
sudo gpg -k && \
  sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg \
    --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69 && \
  echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" \
    | sudo tee /etc/apt/sources.list.d/k6.list && \
  sudo apt-get update && sudo apt-get install k6
```

Then, from this folder:

```bash
k6 run tests/smoke.js      # fast gate — safe to run anytime
k6 run tests/load.js       # ~1m50s, 10 VUs — run deliberately
k6 run tests/stress.js     # ~1m50s, peaks at 25 VUs — run deliberately

# or via the npm wrappers
npm run smoke
npm run load
npm run stress
```

---

## CI

[`.github/workflows/k6.yml`](../.github/workflows/k6.yml) installs k6 with `grafana/setup-k6-action` and runs **only the smoke test** on every push/PR that touches:

- `08-performance-k6/**`
- `.github/workflows/k6.yml`

Path-scoped so it stays fast and only fires when the perf suite changes. The JSON summary is uploaded as an artifact (`k6-smoke-summary`) on every run.

---

## Why this section completes the story

The portfolio already proves I can verify an API's **behaviour** (section 04). This section proves I can verify its **performance characteristics** — and, just as importantly, that I know:

- the difference between smoke, load, and stress, and *when* to reach for each;
- how to make a perf test a **gate** (thresholds), not just a pretty report;
- how to set **per-endpoint** budgets so one slow endpoint can't mask regressions;
- how to test **responsibly** against infrastructure I don't own.

Same API, two lenses. That's what "full lifecycle" actually means.
