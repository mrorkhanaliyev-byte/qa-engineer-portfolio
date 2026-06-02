// ============================================================
// STRESS TEST — where does the system START to degrade?
//
// A stress test deliberately pushes BEYOND expected load to find the
// point where latency climbs and errors appear. The goal isn't a
// pass/fail gate (you EXPECT degradation at the top end) — it's to
// learn the system's ceiling so capacity planning is grounded in data.
//
// ⚠ Kept deliberately modest (peaks at 25 VUs) because the target is a
// FREE public shared server. Against owned staging infra you'd push to
// hundreds/thousands of VUs to find the real knee in the curve. The
// PROFILE and METRICS here are what matter; the absolute numbers scale
// with the environment.
//
// This script is NOT run in CI (it would repeatedly load a shared
// public server). Run it locally, deliberately:
//   k6 run tests/stress.js
// ============================================================

import http from 'k6/http'
import { check, sleep } from 'k6'
import { Trend } from 'k6/metrics'
import { BASE_URL, ACCEPT_JSON } from '../lib/config.js'

const listDuration = new Trend('list_duration', true)

export const options = {
  // Step up in stages so we can see latency climb stage by stage,
  // then back down to observe recovery.
  stages: [
    { duration: '30s', target: 10 },  // warm up to normal load
    { duration: '30s', target: 25 },  // push beyond normal
    { duration: '30s', target: 25 },  // hold at the stressed level
    { duration: '20s', target: 0 },   // recover
  ],
  thresholds: {
    // We only ABORT if things get catastrophically bad — some
    // degradation under stress is expected and informative, not a fail.
    http_req_failed: ['rate<0.25'],
    http_req_duration: ['p(99)<10000'],
  },
}

export default function () {
  const res = http.get(`${BASE_URL}/booking`, { headers: ACCEPT_JSON, tags: { name: 'GET /booking' } })
  listDuration.add(res.timings.duration)
  check(res, { 'list responded 2xx': (r) => r.status >= 200 && r.status < 300 })

  // Shorter think-time than the load test — stress means more pressure.
  sleep(Math.random() + 0.5)
}
