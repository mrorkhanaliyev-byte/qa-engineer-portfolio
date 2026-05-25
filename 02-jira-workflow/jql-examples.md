# JQL Examples — Organized by When You Actually Use Them

A QA engineer who knows JQL is dramatically faster than one who clicks through filters. These are the queries I rely on grouped by *when* they get used, not by what clause they contain.

> The portfolio project key is `AQA`. Replace if your sandbox uses a different one.

---

## 1. Daily Triage (start-of-day queries)

### What's on my plate right now?
```jql
assignee = currentUser()
  AND project = AQA
  AND status NOT IN (Closed, "Won't Fix", Done)
ORDER BY priority DESC, updated DESC
```
Open tickets I own, hottest first. The first thing I look at every morning.

### What landed in my queue overnight?
```jql
assignee = currentUser()
  AND updated >= -1d
ORDER BY updated DESC
```
Anything updated in the last 24 hours — comments, transitions, fields changed.

### What needs my verification today? (resolved by dev, not yet closed by QA)
```jql
status = Resolved
  AND project = AQA
ORDER BY resolved ASC
```
Oldest first so I clear the verification queue FIFO.

---

## 2. Sprint Planning

### What's in the current sprint?
```jql
sprint IN openSprints() AND project = AQA
ORDER BY rank
```

### What rolled over from the last sprint? (incomplete carryover)
```jql
sprint IN closedSprints()
  AND sprint IN openSprints()
  AND project = AQA
```
Issues that were in the previous sprint AND are still in the current one — i.e. didn't finish on time.

### What's in the backlog and ready to pull in?
```jql
project = AQA
  AND status = "To Do"
  AND sprint IS EMPTY
  AND "Story Points" IS NOT EMPTY
ORDER BY priority DESC, rank
```
Estimated work outside any sprint — candidates for the next planning meeting.

---

## 3. Release Readiness

### Open blockers / criticals across the project
```jql
project = AQA
  AND priority IN (Highest, High)
  AND status NOT IN (Closed, Resolved, "Won't Fix")
```
Run this 24h before any release. If it returns rows, push the release.

### Bugs filed against the current release version
```jql
project = AQA
  AND issuetype = Bug
  AND affectedVersion = "1.0"
  AND status NOT IN (Closed, "Won't Fix")
```
Replace `"1.0"` with the version you're shipping. Helps the release ticket get its definitive bug count.

### Tickets completed in the last sprint (for release notes)
```jql
project = AQA
  AND status = Closed
  AND resolved >= -14d
ORDER BY issuetype, resolved DESC
```

---

## 4. Quality Metrics & Trends

### Reopen rate — bugs that came back from `Closed`
```jql
project = AQA
  AND issuetype = Bug
  AND status CHANGED FROM Closed TO Reopened AFTER -90d
```
A high count of these is a **leading indicator of test coverage gaps**. Bring it to retro.

### Long-running bugs (>30 days open)
```jql
project = AQA
  AND issuetype = Bug
  AND status NOT IN (Closed, "Won't Fix")
  AND created <= -30d
ORDER BY created ASC
```
Tickets nobody owns, nobody schedules. Surface them weekly.

### Issues touched by me this month (personal velocity)
```jql
project = AQA
  AND (
    assignee WAS currentUser() AFTER -30d
    OR reporter = currentUser() AND created >= -30d
  )
ORDER BY updated DESC
```

### Bugs by component (where does our code break most?)
```jql
project = AQA
  AND issuetype = Bug
  AND status NOT IN (Closed, "Won't Fix")
```
Then on the result page → group by *Component*. Top-3 components = next sprint's testing focus.

---

## 5. Test Gaps & QA-Specific

### Bugs with no test case linked (test coverage gap)
```jql
project = AQA
  AND issuetype = Bug
  AND status = Closed
  AND issueLinkType != "is tested by"
```
Every closed bug should have at least one regression test. If this query returns rows, those bugs are candidates to regress next release.

### Stale "In Review" — PRs sitting too long
```jql
project = AQA
  AND status = "In Review"
  AND updated <= -3d
```
Code review SLA breaches. Surface in standup.

### Stories without acceptance criteria in the description
```jql
project = AQA
  AND issuetype = Story
  AND description !~ "Acceptance Criteria"
  AND status NOT IN (Closed, Done)
```
Crude but effective — picks up stories that didn't get groomed properly.

---

## 6. Personal Bookmarks (save these as Filters in Jira)

Top 3 saved filters I'd recommend a QA engineer pin to their dashboard:

| Filter name | JQL |
|---|---|
| **My open work** | `assignee = currentUser() AND project = AQA AND status NOT IN (Closed, "Won't Fix")` |
| **Verify queue** | `status = Resolved AND project = AQA ORDER BY resolved ASC` |
| **Release blockers** | `project = AQA AND priority IN (Highest, High) AND status != Closed` |

---

## JQL gotchas

- Strings with spaces need double quotes: `"In Review"` not `In Review`
- Use `WAS` not `=` for historical state checks: `assignee WAS currentUser()`
- `CHANGED FROM X TO Y AFTER -30d` requires Jira to have history; works on Cloud and recent DC versions
- `EMPTY` and `IS EMPTY` for null checks (NOT `= null`)
- Field names with spaces use double quotes: `"Story Points"`, `"Epic Link"`
