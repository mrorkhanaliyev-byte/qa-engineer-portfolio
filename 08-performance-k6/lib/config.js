// ============================================================
// Shared config + helpers for the k6 performance suite.
//
// Target: restful-booker (https://restful-booker.herokuapp.com)
// — the same REST API tested FUNCTIONALLY in 04-postman-api-testing.
// Here we test it under LOAD. Functional + performance on one API is
// the cohesive story: "does it work?" AND "does it hold up?".
//
// ⚠ ETHICS: restful-booker is a FREE public demo on a shared Heroku
// dyno. The VU counts here are deliberately modest — load testing is
// not a license to DoS infrastructure you don't own. A real engagement
// runs against a staging environment you control, at production-scale
// load. The numbers here demonstrate the TECHNIQUE responsibly.
// ============================================================

export const BASE_URL = 'https://restful-booker.herokuapp.com'

// Headers reused across requests.
//
// IMPORTANT — restful-booker content-negotiates and DEFAULTS TO XML.
// Without `Accept: application/json` it returns XML, and res.json()
// then yields nothing. (Newman/Postman send Accept automatically; k6
// does not, so we set it explicitly.) A genuinely useful API finding
// that surfaced just from load-testing it.
export const JSON_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
}

// For GET requests (no body) that still need a JSON response.
export const ACCEPT_JSON = { Accept: 'application/json' }

// Public admin credentials (documented on restful-booker's apidoc).
export const ADMIN = { username: 'admin', password: 'password123' }

/**
 * Correctness gates that apply to EVERY scenario regardless of how much
 * load it generates. A test FAILS (non-zero exit, red CI) if any of
 * these is breached — that's how a perf test becomes a gate, not just a
 * report. Latency budgets are deliberately NOT in here: a sensible
 * latency target depends on the endpoint and the environment, so each
 * test sets its own (see the tagged, per-endpoint thresholds in load.js).
 */
export const COMMON_THRESHOLDS = {
  // Less than 1% of requests may fail at the HTTP level.
  http_req_failed: ['rate<0.01'],
  // At least 99% of functional checks must pass.
  checks: ['rate>0.99'],
}

/**
 * A small sample payload for creating a booking. Kept tiny and only
 * used in the smoke test (one create+delete) so we don't pollute the
 * public server with load-test data.
 */
export function sampleBooking() {
  return JSON.stringify({
    firstname: 'k6',
    lastname: 'PerfTest',
    totalprice: 100,
    depositpaid: true,
    bookingdates: { checkin: '2026-06-01', checkout: '2026-06-05' },
    additionalneeds: 'Breakfast',
  })
}
