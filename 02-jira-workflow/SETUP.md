# Setup Guide — Jira Cloud Sandbox

This guide walks through standing up a free Jira Cloud workspace, importing this portfolio's bug reports, and capturing the screenshots referenced from the section README.

Total time: **~30 minutes**, of which 5 are clicks and 25 are waiting for screenshots to look the way you want.

---

## 1. Create a free Jira Cloud workspace (5 min)

1. Open https://www.atlassian.com/software/jira/free
2. Click **Get it free**
3. Sign in with your Google account (fastest) or sign up with an email
4. Workspace URL: pick something like `<your-handle>-qa.atlassian.net`
5. When prompted "What do you want to use this for?" → choose **Software development** (gives you Scrum boards, sprints, JQL out of the box)

> Free tier: up to 10 users, unlimited projects, full JQL. Plenty for portfolio work.

---

## 2. Create the project (3 min)

1. Top right → **Create project**
2. Template: **Scrum** (Software development → Scrum) — gives sprint boards, the most common QA setup
3. Project name: `QA Engineer Portfolio`
4. Project key: `AQA` (acronym keeps issue IDs short: `AQA-1`, `AQA-2`, ...)
5. Project type: **Team-managed** (simpler permissions; fine for a personal sandbox)
6. Click **Create**

---

## 3. Import the seed tickets (5 min)

The CSV in this folder pre-populates 3 bug reports (matching our `/01-manual-testing/bug-reports/*`) plus 2 stories/tasks so the board doesn't look empty.

1. From the project, top right → **Project settings** (gear icon) → **Issue types** (just verify Bug + Story + Task exist; they do by default)
2. Top right → **More** (`···`) → **Import issues**
   - On newer Jira UIs: top right of your **profile menu** → **System** → **External System Import** → **CSV**
3. Upload `bugs-import.csv` from this folder
4. Map the columns when prompted:
   - `Summary` → Summary
   - `Issue Type` → Issue Type
   - `Priority` → Priority
   - `Severity` → leave unmapped (or create a custom field "Severity" first if you want it)
   - `Status` → Status
   - `Description` → Description
   - `Labels` → Labels (semicolon-separated)
   - `Reporter` → Reporter (default: you)
5. Choose **Begin import**
6. After import, open the **Backlog** view and confirm all 5 issues are there

---

## 4. (Optional) Customize the workflow (5 min)

The default Jira workflow has `To Do → In Progress → Done`. For a richer demonstration, switch to a custom workflow matching [`workflow-diagram.md`](./workflow-diagram.md):

1. **Project settings** → **Issues** → **Workflow**
2. Click the workflow → **Edit**
3. Add states: `In Review`, `Resolved`, `Reopened`, `Won't Fix`
4. Wire transitions per the Mermaid diagram
5. Save and publish

> For portfolio purposes, even the default workflow is enough — the screenshots are the point.

---

## 5. Set up a Scrum sprint (3 min)

1. **Backlog** view → **Create sprint** → name it `Sprint 1`
2. Drag the 5 imported issues onto the sprint
3. Click **Start sprint** → keep defaults (2 weeks)
4. Now the **Board** view shows your active sprint

---

## 6. Capture the screenshots (10 min)

Save each screenshot in the [`screenshots/`](./screenshots/) folder with the exact filename listed below. The section README already references these names, so they'll render as soon as you commit them.

| # | Filename | Where to find it | What to capture |
|---|---|---|---|
| 1 | `sprint-board.png` | **Board** view of Sprint 1 | Whole board with columns + issues. Drag one issue into "In Progress" first so the board doesn't look static. |
| 2 | `bug-lifecycle.png` | Open `AQA-1` (the first bug) → top transition bar | The transition dropdown showing all available next states (Open / In Progress / In Review / Resolved). Demonstrates the custom workflow. |
| 3 | `backlog.png` | **Backlog** view | Issues outside the sprint plus the active sprint section. Shows you understand backlog grooming. |
| 4 | `dashboard.png` | **Dashboards** → **Create dashboard** → add gadgets: *Created vs Resolved Chart*, *Issues by Priority*, *Average Age* | A populated QA dashboard — exec-friendly view. |
| 5 | `jql-search.png` | **Filters** → **Advanced issue search** → paste a JQL from [`jql-examples.md`](./jql-examples.md) | Search bar showing the query + result list. Proves JQL fluency. |

### Screenshot tips

- Use a clean browser window — close DevTools, hide bookmarks bar
- Light theme renders better in README previews than dark theme
- Crop to the panel that matters; avoid wasting space on the global nav
- Compress with [TinyPNG](https://tinypng.com/) — keep files under 300 KB each

---

## 7. Commit the screenshots

```bash
cd qa-engineer-portfolio
git add 02-jira-workflow/screenshots/
git commit -m "docs(jira): add real Jira sandbox screenshots"
git push origin main && git push gitlab main
```

The section README will start showing them automatically — no other changes needed.

---

## Troubleshooting

- **"CSV import not available"** — Some account types only show CSV import via the global System Admin. Look at top right profile → **System** → **External System Import** → **CSV**.
- **"Severity field doesn't exist"** — Jira free tier doesn't ship a `Severity` field. Either skip it on import, or create a custom field via *Project settings → Issues → Fields → Add custom field*.
- **"My workflow changes won't save"** — Team-managed projects only allow workflow edits if no issues are currently in the states being modified. Move issues to a safe state first.
- **"Can't see Dashboards"** — On free tier, Dashboards live at `your-domain.atlassian.net/jira/dashboards` (separate from the project sidebar).
