# 04 — API Testing with Postman

REST API test collection for **[Automation Exercise API](https://automationexercise.com/api_list)** — covering all 14 public endpoints with positive, negative, and contract validation.

## What's Inside

| Folder / File | Description |
|---|---|
| [collections/](./collections/) | Postman collection JSON (importable) |
| [environments/](./environments/) | Dev / Staging environment files |
| [newman-reports/](./newman-reports/) | HTML reports from CI runs |
| `.github/workflows/api-tests.yml` | GitHub Actions pipeline running Newman on push |

## Endpoints Covered

| # | Endpoint | Method | Tests |
|---|---|---|---|
| 1 | `/productsList` | GET | Schema, status, pagination |
| 2 | `/brandsList` | GET | Schema, status |
| 3 | `/searchProduct` | POST | Valid search, empty search, special chars |
| 4 | `/verifyLogin` | POST | Valid, invalid email, missing password |
| 5 | `/createAccount` | POST | Valid signup, duplicate email, missing fields |
| 6 | `/deleteAccount` | DELETE | Valid, non-existent account |
| 7 | `/updateAccount` | PUT | Valid update, invalid fields |
| ... | (full list in collection) | | |

## Test Patterns Used

### Status code validation
```js
pm.test("Status code is 200", () => {
  pm.response.to.have.status(200);
});
```

### JSON schema validation
```js
const schema = {
  type: "object",
  required: ["responseCode", "products"],
  properties: {
    responseCode: { type: "number" },
    products: { type: "array" }
  }
};
pm.test("Response matches schema", () => {
  pm.expect(tv4.validate(pm.response.json(), schema)).to.be.true;
});
```

### Chained requests with variables
```js
// In "Create Account" — save the user ID for later cleanup
const body = pm.response.json();
pm.environment.set("created_user_email", pm.request.body.email);
```

## Running with Newman

```bash
# Install Newman globally
npm install -g newman newman-reporter-htmlextra

# Run against dev environment
newman run collections/automation-exercise-api.postman_collection.json \
  -e environments/dev.postman_environment.json \
  -r htmlextra \
  --reporter-htmlextra-export newman-reports/report.html
```

## CI Integration

Every push to `main` triggers the GitHub Actions workflow `.github/workflows/api-tests.yml`, which:

1. Installs Newman
2. Runs the full collection against staging
3. Publishes the HTML report as a build artifact
4. Fails the build if any test fails
