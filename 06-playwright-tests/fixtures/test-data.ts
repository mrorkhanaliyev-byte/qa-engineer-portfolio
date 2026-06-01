/**
 * Test data fixtures — synced with the Cypress fixtures so the same
 * accounts and credentials are used across both suites.
 */
export const demoblaze = {
  valid: {
    username: 'qatestuser',
    password: 'Test1234',
    _note:
      "This user must be registered on https://www.demoblaze.com/. " +
      "If TC-LOGIN-002/003/005 fail with 'User does not exist', " +
      "sign up this account manually first.",
  },
  invalidPassword: {
    username: 'qatestuser',
    password: 'wrong_password_xyz',
  },
  nonExistent: {
    username: 'this_user_does_not_exist_xyzabc999',
    password: 'any_password',
  },
} as const

export const automationexercise = {
  valid: {
    name: 'Orkhan QA',
    email: 'qa_orkhan@test.com',
    password: 'Test@1234',
    _note:
      "This user must be registered on https://automationexercise.com/. " +
      "If TC-AE-LOGIN-002/003/009/010 fail with " +
      "'Your email or password is incorrect!', register the account " +
      "manually first via the Signup form.",
  },
  invalidPassword: {
    email: 'qa_orkhan@test.com',
    password: 'WrongPass_999',
  },
  nonExistent: {
    email: 'definitely_not_a_user_99999@example.com',
    password: 'AnyPassword1',
  },
  malformedEmail: {
    email: 'notanemail',
    password: 'SomePass123',
  },
} as const

/**
 * SauceDemo credentials are PUBLIC and fixed — no provisioning needed,
 * so the full authenticated checkout flow runs in CI. Password is
 * 'secret_sauce' for every user.
 */
export const saucedemo = {
  password: 'secret_sauce',
  standard: 'standard_user',
  lockedOut: 'locked_out_user',
  problem: 'problem_user',
  wrongPassword: 'definitely_wrong_password',
  buyer: {
    firstName: 'Orkhan',
    lastName: 'Aliyev',
    postalCode: 'AZ1000',
  },
} as const

/**
 * Auth-dependent tests can't run in CI (we have no way to provision
 * accounts there). Use the SKIP_AUTH constant to gate them:
 *
 *   test('TC-LOGIN-002 ...', async ({ page }) => {
 *     test.skip(SKIP_AUTH, 'Requires pre-registered user — skipped in CI')
 *     // ...
 *   })
 */
export const SKIP_AUTH = process.env.CI_SKIP_AUTH_TESTS === 'true'
