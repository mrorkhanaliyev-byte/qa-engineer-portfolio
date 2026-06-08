package tests.saucedemo;

import base.BaseTest;
import org.testng.Assert;
import org.testng.annotations.Test;
import pages.saucedemo.LoginPage;

/**
 * SauceDemo (Swag Labs) — Login Flow tests (Selenium + TestNG).
 *
 * <p>Mirrors the Cypress spec ({@code 05-cypress-tests/cypress/e2e/saucedemo/
 * login.cy.js}) and the Playwright spec ({@code 06-playwright-tests/tests/
 * saucedemo/login.spec.ts}) — same TC IDs in all three frameworks so a reader
 * can compare the same test side-by-side.
 *
 * <p>Unlike the Demoblaze suite, these need NO {@code -DskipAuth}: SauceDemo's
 * credentials are public and fixed, so every case — including the locked-out
 * path that demo sites rarely expose — runs in CI. This is the class the
 * GitHub Actions Selenium workflow runs headless on every push.
 */
public class LoginTests extends BaseTest {

    private static final String STANDARD_USER = "standard_user";
    private static final String LOCKED_USER   = "locked_out_user";
    private static final String PASSWORD       = "secret_sauce";
    private static final String WRONG_PASSWORD = "wrong_password_xyz";

    // ----------------------------------------------------------
    // POSITIVE
    // ----------------------------------------------------------

    @Test
    public void tcSauceLogin001_LoginPageRendersAllControls() {
        LoginPage page = new LoginPage(driver).visit();
        Assert.assertTrue(page.isUsernameFieldVisible(), "Username field should be visible");
        Assert.assertTrue(page.isPasswordFieldVisible(), "Password field should be visible");
        Assert.assertTrue(page.isLoginButtonVisible(),  "Login button should be visible");
    }

    @Test
    public void tcSauceLogin002_StandardUserReachesInventory() {
        LoginPage page = new LoginPage(driver)
                .visit()
                .loginAs(STANDARD_USER, PASSWORD);
        Assert.assertTrue(page.isOnInventory(),
                "standard_user should land on /inventory.html");
    }

    // ----------------------------------------------------------
    // NEGATIVE
    // ----------------------------------------------------------

    @Test
    public void tcSauceLogin003_LockedOutUserSeesLockoutError() {
        LoginPage page = new LoginPage(driver)
                .visit()
                .loginAs(LOCKED_USER, PASSWORD);
        Assert.assertTrue(page.getErrorText().contains("Sorry, this user has been locked out"),
                "Locked-out user should see the lockout error");
        Assert.assertTrue(page.isStillOnLogin(), "Should remain on the login page");
    }

    @Test
    public void tcSauceLogin004_WrongPasswordIsRejected() {
        LoginPage page = new LoginPage(driver)
                .visit()
                .loginAs(STANDARD_USER, WRONG_PASSWORD);
        Assert.assertTrue(page.getErrorText().contains("Username and password do not match"),
                "Wrong password should be rejected with a mismatch error");
        Assert.assertTrue(page.isStillOnLogin(), "Should remain on the login page");
    }

    @Test
    public void tcSauceLogin005_MissingUsernameIsRejected() {
        LoginPage page = new LoginPage(driver)
                .visit()
                .loginAs(null, PASSWORD);
        Assert.assertTrue(page.getErrorText().contains("Username is required"),
                "Missing username should be rejected");
    }

    @Test
    public void tcSauceLogin006_MissingPasswordIsRejected() {
        LoginPage page = new LoginPage(driver)
                .visit()
                .loginAs(STANDARD_USER, null);
        Assert.assertTrue(page.getErrorText().contains("Password is required"),
                "Missing password should be rejected");
    }
}
