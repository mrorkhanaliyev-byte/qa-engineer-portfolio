import { Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * Accessibility Auditor — wraps axe-core for the portfolio's specs.
 *
 * Why a wrapper instead of using AxeBuilder directly:
 *   * Centralizes WCAG tag selection (2.1 AA + best-practice) so
 *     every spec audits to the same standard
 *   * Adds structured result classification by impact severity
 *   * Lets us assert on "no critical violations" while still
 *     reporting serious / moderate / minor findings for tracking
 *
 * The portfolio's policy:
 *   * `critical` violations FAIL the test (hard blocker)
 *   * `serious` / `moderate` / `minor` are reported but tolerated.
 *     Real public sites (Automation Exercise, Demoblaze) have these.
 *     A test that fails on every minor warning is useless noise.
 *   * AUDIT-RESULTS.md captures the current baseline.
 */

export type AxeViolationImpact = 'critical' | 'serious' | 'moderate' | 'minor'

export interface AccessibilityResult {
  url: string
  totalViolations: number
  byImpact: Record<AxeViolationImpact, number>
  critical: AxeViolation[]
  serious: AxeViolation[]
  moderate: AxeViolation[]
  minor: AxeViolation[]
}

export interface AxeViolation {
  id: string
  impact: AxeViolationImpact
  description: string
  help: string
  helpUrl: string
  nodeCount: number
  /** First-affected element's selector — useful for triage */
  firstSelector: string
}

const WCAG_TAGS = [
  'wcag2a',
  'wcag2aa',
  'wcag21a',
  'wcag21aa',
  'best-practice',
]

/**
 * Run axe against the current page state and return a structured
 * AccessibilityResult. Caller asserts on whichever impact level
 * matters for their test.
 */
export async function auditPage(page: Page): Promise<AccessibilityResult> {
  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .analyze()

  const byImpact: Record<AxeViolationImpact, number> = {
    critical: 0,
    serious:  0,
    moderate: 0,
    minor:    0,
  }
  const buckets: Record<AxeViolationImpact, AxeViolation[]> = {
    critical: [],
    serious:  [],
    moderate: [],
    minor:    [],
  }

  for (const v of results.violations) {
    const impact = (v.impact ?? 'minor') as AxeViolationImpact
    byImpact[impact] = (byImpact[impact] ?? 0) + 1
    buckets[impact].push({
      id: v.id,
      impact,
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      nodeCount: v.nodes.length,
      firstSelector: v.nodes[0]?.target?.[0]?.toString() ?? '(unknown)',
    })
  }

  return {
    url: page.url(),
    totalViolations: results.violations.length,
    byImpact,
    critical: buckets.critical,
    serious:  buckets.serious,
    moderate: buckets.moderate,
    minor:    buckets.minor,
  }
}

/**
 * Pretty-print a one-line summary, e.g.
 *   [/login] 3 violations · 0 critical, 1 serious, 2 moderate, 0 minor
 */
export function summarize(result: AccessibilityResult): string {
  const u = new URL(result.url)
  const path = u.pathname + u.search
  const { critical, serious, moderate, minor } = result.byImpact
  return (
    `[${path}] ${result.totalViolations} violations · ` +
    `${critical} critical, ${serious} serious, ${moderate} moderate, ${minor} minor`
  )
}

/**
 * Render the violations of a single impact level as a compact list,
 * useful for piping into test output / CI logs.
 */
export function formatViolations(label: AxeViolationImpact, violations: AxeViolation[]): string {
  if (violations.length === 0) return ''
  const header = `  ${label.toUpperCase()} (${violations.length}):`
  const rows = violations.map(
    (v) => `    - [${v.id}] ${v.help} (×${v.nodeCount}, ${v.firstSelector})\n      ${v.helpUrl}`,
  )
  return [header, ...rows].join('\n')
}
