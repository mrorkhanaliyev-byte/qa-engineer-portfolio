# 04 — API Testing with Postman + Newman

REST API test collection for **[Automation Exercise API](https://automationexercise.com/api_list)** — full coverage of all **14 documented endpoints** with positive cases, negative cases, contract validation, and a chained user-lifecycle scenario.

[![Newman API](https://github.com/mrorkhanaliyev-byte/qa-engineer-portfolio/actions/workflows/newman.yml/badge.svg)](https://github.com/mrorkhanaliyev-byte/qa-engineer-portfolio/actions/workflows/newman.yml)

![Postman](https://img.shields.io/badge/Postman-FF6C37?logo=postman&logoColor=white)
![Newman](https://img.shields.io/badge/Newman-CLI-orange)
![Node](https://img.shields.io/badge/Node-20.x-339933?logo=node.js&logoColor=white)
![CI](https://img.shields.io/badge/CI-GitHub_Actions-2088FF?logo=githubactions&logoColor=white)

---

## At a Glance

| | |
|---|---|
| Requests | 14 |
| Test assertions | 45+ |
| Folders | 5 (Health, Search, Auth, Method-Not-Allowed, User Lifecycle) |
| CI runtime | < 30 seconds |
| Cleanup | Automatic — user-lifecycle chain deletes its own test data |

---

## The Quirk Worth Documenting

The Automation Exercise API **always returns HTTP 200**, even for client errors (400, 404, 405). The real status lives in a `responseCode` field inside the JSON body:

```json
{
  "responseCode": 400,
  "message": "Bad request, search_product parameter is missing in POST request."
}
```

This is unusual and easy to get wrong if you only check `pm.response.to.have.status(200)`. Every test in this collection asserts **both** layers:

1. `pm.response.to.have.status(200)` — confirms the endpoint is reachable / DNS resolves
2. `body.responseCode === <expected>` — confirms the business-level outcome

That split is the right model. It distinguishes "the API is down" (HTTP != 200) from "the API returned a business error" (HTTP 200, `responseCode` 400 / 404 / 405).

---

## Folder Layout

| Folder | Endpoints | Purpose |
|---|---|---|
| **Health & Discovery** | `GET /productsList`, `GET /brandsList` | Smoke — public listings, no auth |
| **Search** | `POST /searchProduct` (valid + missing param) | Happy path + documented 400 |
| **Authentication** | `POST /verifyLogin` (4 variants) | Valid creds, missing email, wrong method (DELETE), unknown user |
| **Method Not Allowed** | `POST /productsList`, `PUT /brandsList` | Documented 405 responses |
| **User Lifecycle** (chained) | `POST /createAccount` → `GET /getUserDetailByEmail` → `PUT /updateAccount` → `DELETE /deleteAccount` | End-to-end CRUD on a single timestamped user |

### Why the lifecycle is chained

Creating a real user on AE leaves persistent state behind. Three protections keep the chain idempotent across CI runs:

1. **Per-run unique email** — `pre-request script` on `createAccount` generates `qa_chain_<timestamp>@portfolio.test`
2. **Environment variables carry the email** through the chain
3. **Cleanup step is unconditional** — `deleteAccount` runs even if earlier steps failed (each step has independent assertions)

Result: zero orphan accounts on AE after any run.

---

## Test Assertion Patterns

Every request uses a consistent assertion style so failures are easy to read:

```js
// 1. Network layer
pm.test('HTTP status is 200', () => {
  pm.response.to.have.status(200);
});

// 2. Business layer (AE-specific quirk)
pm.test('responseCode in body is 400', () => {
  const body = pm.response.json();
  pm.expect(body.responseCode).to.equal(400);
});

// 3. Contract layer (schema shape)
pm.test('Each product has id, name, price, brand, category', () => {
  const first = pm.response.json().products[0];
  pm.expect(first).to.include.keys('id', 'name', 'price', 'brand', 'category');
});

// 4. Semantic layer (the test actually means what it says)
pm.test('At least one result matches the keyword', () => {
  const body = pm.response.json();
  const keyword = pm.environment.get('searchKeyword').toLowerCase();
  pm.expect(body.products.some(p => p.name.toLowerCase().includes(keyword)))
    .to.be.true;
});
```

---

## Running Locally

### Option A — Newman CLI (fast feedback)

```bash
cd 04-postman-api-testing
npm install
npm test                # runs collection, CLI output only
npm run test:report     # also generates newman-reports/report.html
```

### Option B — Postman GUI (for iterating)

1. Open Postman desktop
2. **Import** → drag `collections/automation-exercise-api.postman_collection.json`
3. **Import** → drag `environments/automation-exercise.postman_environment.json`
4. Top right corner → select environment **"Automation Exercise — Default"**
5. Click any request → **Send**

The collection looks identical in both — Newman is just the headless runner over the same JSON.

---

## Precondition for One Test

`API 7 — POST /verifyLogin (valid credentials)` needs a pre-registered AE user matching `{{registeredEmail}}`. Same precondition as the [Cypress AE login spec](../05-cypress-tests/cypress/e2e/automationexercise/login.cy.js) — and the same handling: in CI we set `CI=true` and the test skips itself if the user isn't provisioned.

To register the user once:

1. Open https://automationexercise.com/login
2. Sign up with Email: `qa_orkhan@test.com`, Password: `Test@1234`
3. Fill in any valid address details

After that, the local run includes that test in its results.

---

## CI

[`.github/workflows/newman.yml`](../.github/workflows/newman.yml) runs the collection on every push to `main` and every PR that touches:

- `04-postman-api-testing/**`
- `.github/workflows/newman.yml`

Path-scoped triggers keep CI fast (~30s end-to-end). On every run, two artifacts are uploaded:

- **`newman-html-report`** — Mochawesome-style HTML for human reading
- **`newman-junit-report`** — JUnit XML for CI dashboards (e.g. SonarQube)

---

## Project Structure

```
04-postman-api-testing/
├── README.md
├── package.json
├── package-lock.json                              # committed for CI reproducibility
├── collections/
│   └── automation-exercise-api.postman_collection.json
├── environments/
│   └── automation-exercise.postman_environment.json
└── newman-reports/                                # gitignored — CLI output only
```

---

## Why This, Why Not That

| Choice | Reason |
|---|---|
| Hand-written JSON in version control | Reviewable in PRs; renders nicely on GitHub; importable into Postman GUI for editing |
| Folder grouping by *concern*, not by endpoint number | Reads like a contract document, not a flat dump |
| Both HTTP and `responseCode` assertions on every request | AE's quirk means a single check would miss real failures |
| Pre-request script for the user-lifecycle chain | Avoids hard-coded test data conflicts across runs |
| `--bail=false` in CI | One bad request shouldn't hide failures in unrelated requests |
| HTML + JUnit reports in CI | HTML for humans, JUnit for tooling |
| Environment variables for everything (`baseUrl`, creds, keyword) | Same collection runs against dev/staging by swapping the env file |
