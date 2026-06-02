// ============================================================
// LOAD TEST — does the system hold up under EXPECTED traffic?
//
// Ramps up to a steady number of concurrent users, holds, then ramps
// down. Simulates a normal busy period. The question it answers:
// "at our expected concurrency, are latency and error rate acceptable?"
//
// READ-ONLY by design: a load test should not pollute a shared public
// server with hundreds of bookings. We hammer the read endpoints
// (/ping, /booking list, /booking/{id}) that a browsing user hits —
// which is where the read-path bottlenecks actually show up.
//
// Run:  k6 run tests/load.js
// ============================================================

import http from 'k6/http'
import { check, sleep, group } from 'k6'
import { Rate } from 'k6/metrics'
import { BASE_URL, COMMON_THRESHOLDS, ACCEPT_JSON } from '../lib/config.js'

// Custom metric: business-level success rate (all checks in an iteration
// passed), distinct from the HTTP-level failure rate.
const readFlowErrors = new Rate('read_flow_errors')

export const options = {
  // Ramp profile: 30s up to 10 VUs, hold 1m, ramp down 20s.
  // Modest for a free public dyno — see the ethics note in lib/config.js.
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 10 },
    { duration: '20s', target: 0 },
  ],
  thresholds: {
    ...COMMON_THRESHOLDS,
    // Business-level success: <5% of browse iterations may fail end-to-end.
    read_flow_errors: ['rate<0.05'],
    // Per-endpoint latency budgets (tagged thresholds). The small, fast
    // endpoints get tight SLAs; GET /booking returns the WHOLE bookings
    // table (~10 MB on this shared demo) so it gets an honestly-loose
    // ceiling. On owned infra with a paginated list you'd hold all three
    // to sub-second budgets — the point here is that ONE pathological
    // endpoint shouldn't be allowed to hide regressions in the others.
    'http_req_duration{name:GET /ping}': ['p(95)<2000'],
    'http_req_duration{name:GET /booking/:id}': ['p(95)<3000'],
    'http_req_duration{name:GET /booking}': ['p(95)<15000'],
  },
}

export default function () {
  let ok = true

  group('browse bookings', () => {
    const list = http.get(`${BASE_URL}/booking`, { headers: ACCEPT_JSON, tags: { name: 'GET /booking' } })
    const items = list.status === 200 ? safeJson(list) : null
    const listOk = check(list, {
      'list 200': (r) => r.status === 200,
      'list non-empty': () => Array.isArray(items) && items.length > 0,
    })
    ok = ok && listOk

    if (listOk && items) {
      // Drill into a random booking, like a user clicking a result.
      const randomId = items[Math.floor(Math.random() * items.length)].bookingid
      const one = http.get(`${BASE_URL}/booking/${randomId}`, { headers: ACCEPT_JSON, tags: { name: 'GET /booking/:id' } })
      const oneOk = check(one, { 'detail 200': (r) => r.status === 200 })
      ok = ok && oneOk
    }
  })

  group('health', () => {
    const ping = http.get(`${BASE_URL}/ping`, { tags: { name: 'GET /ping' } })
    ok = ok && check(ping, { 'ping 201': (r) => r.status === 201 })
  })

  readFlowErrors.add(!ok)

  // Think-time between user actions keeps the load realistic rather
  // than an artificial tight loop.
  sleep(Math.random() * 2 + 1)
}

// Parse JSON defensively — under load a shared public server can return
// a plain-text error page, and r.json() on that throws and aborts the VU.
function safeJson(res) {
  try {
    return res.json()
  } catch (_) {
    return null
  }
}
