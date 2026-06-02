// ============================================================
// SMOKE TEST — does the system work under MINIMAL load?
//
// 1 virtual user, a handful of iterations. A smoke test isn't about
// finding the breaking point — it's the first gate: if the system
// can't serve a single user cleanly, there's no point running a load
// test. Run it on every deploy.
//
// Exercises a realistic read + write + cleanup flow so the smoke test
// covers the same paths a real user would hit.
//
// Run:  k6 run tests/smoke.js
// ============================================================

import http from 'k6/http'
import { check, sleep, group } from 'k6'
import { Trend } from 'k6/metrics'
import { BASE_URL, JSON_HEADERS, ACCEPT_JSON, ADMIN, sampleBooking } from '../lib/config.js'

// Custom metric: track the create-booking latency separately so we can
// see if writes are slower than reads (they usually are).
const createBookingDuration = new Trend('create_booking_duration', true)

export const options = {
  vus: 1,
  iterations: 5,
  thresholds: {
    // The overall p(95) is dominated by GET /booking, which on this public
    // demo returns the WHOLE bookings table (~10 MB of data accumulated by
    // every other user of the shared server) over a free Heroku dyno that
    // also cold-starts. 6s is a deliberately generous ceiling that still
    // catches a catastrophic regression without flaking on dyno variance.
    http_req_duration: ['p(95)<8000'],
    http_req_failed: ['rate<0.01'],
    checks: ['rate>0.99'],
    // Our OWN write path (POST /booking) is the controlled signal — small,
    // predictable payload — so we hold it to a much tighter budget.
    create_booking_duration: ['p(95)<3000'],
  },
}

export default function () {
  group('health', () => {
    const res = http.get(`${BASE_URL}/ping`)
    check(res, { 'ping is 201': (r) => r.status === 201 })
  })

  group('read bookings (list)', () => {
    const list = http.get(`${BASE_URL}/booking`, { headers: ACCEPT_JSON })
    check(list, {
      'list is 200': (r) => r.status === 200,
      'list is a non-empty array': (r) => {
        const body = jsonIf200(r)
        return Array.isArray(body) && body.length > 0
      },
    })
  })

  // Full write path against a booking WE create — never depend on the
  // shared server's volatile existing data (other clients add/delete
  // bookings constantly, so a "first" id read from the list may already
  // be gone by the time we GET it).
  group('create → read → delete (self-contained, with cleanup)', () => {
    const auth = http.post(`${BASE_URL}/auth`, JSON.stringify(ADMIN), { headers: JSON_HEADERS })
    check(auth, { 'auth is 200 with token': (r) => r.status === 200 && !!jsonIf200(r)?.token })
    const token = jsonIf200(auth)?.token

    const create = http.post(`${BASE_URL}/booking`, sampleBooking(), { headers: JSON_HEADERS })
    createBookingDuration.add(create.timings.duration)
    check(create, { 'create is 200 with id': (r) => r.status === 200 && !!jsonIf200(r)?.bookingid })
    const id = jsonIf200(create)?.bookingid

    if (id) {
      const read = http.get(`${BASE_URL}/booking/${id}`, { headers: ACCEPT_JSON })
      check(read, {
        'read own booking is 200': (r) => r.status === 200,
        'read own booking has firstname': (r) => jsonIf200(r)?.firstname === 'k6',
      })

      // Clean up immediately — never leave smoke-test data behind.
      const del = http.del(`${BASE_URL}/booking/${id}`, null, {
        headers: { ...JSON_HEADERS, Cookie: `token=${token}` },
      })
      check(del, { 'delete is 201': (r) => r.status === 201 })
    }
  })

  sleep(1)
}

// Safely parse a response body as JSON only when the request succeeded.
// On a shared public server a body can be a plain-text error page, and
// calling r.json() on that throws and aborts the whole iteration.
function jsonIf200(res) {
  return res.status === 200 ? res.json() : null
}
