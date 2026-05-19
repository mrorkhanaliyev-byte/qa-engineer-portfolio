# 02 — Jira Workflow

Real screenshots and documentation of how I use **Jira** to manage a QA workflow end-to-end.

## What This Demonstrates

- Sprint planning and backlog grooming
- Bug lifecycle: `Open → In Progress → In Review → Resolved → Closed → Reopened`
- Story linking (test → user story → epic)
- Custom dashboards for QA metrics
- JQL queries for everyday triage

## Contents

| File | Description |
|---|---|
| `screenshots/sprint-board.png` | Active sprint board with stories, sub-tasks, and bug links |
| `screenshots/bug-lifecycle.png` | Single bug walked through every workflow state |
| `screenshots/dashboard.png` | QA dashboard: open bugs by severity, test execution status |
| `workflow-diagram.png` | Custom Jira workflow diagram I designed for the project |

## JQL Queries I Use Daily

```jql
# All open bugs assigned to me, sorted by priority
assignee = currentUser() AND issuetype = Bug AND status != Done ORDER BY priority DESC

# Bugs found in the current sprint
sprint in openSprints() AND issuetype = Bug

# Blocker / Critical bugs across the project
priority in (Blocker, Critical) AND status != Closed

# Bugs reopened more than once (potential test gaps)
issuetype = Bug AND status changed FROM "Closed" TO "Reopened" AFTER -30d
```

## Bug Severity vs Priority

| Severity | Priority | Example |
|---|---|---|
| Critical | Highest | Checkout fails for all users |
| Major | High | Discount code not applied |
| Minor | Medium | Tooltip overlaps button |
| Trivial | Low | Typo in footer |

> Note: The Jira instance shown is a personal sandbox at `https://<your-domain>.atlassian.net` used for portfolio demonstrations only. No real customer data is included.
