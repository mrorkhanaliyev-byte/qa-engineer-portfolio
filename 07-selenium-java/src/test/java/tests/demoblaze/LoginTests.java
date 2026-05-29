package tests.demoblaze;

import base.BaseTest;
import org.testng.Assert;
import org.testng.annotations.Test;
import pages.demoblaze.LoginPage;

/**
 * Demoblaze — Login Flow tests (Selenium + TestNG).
 *
 * <p>Mirrors the Cypress spec ({@code 05-cypress-tests/cypress/e2e/
 * demoblaze/login.cy.js}) and the Playwright spec ({@code 06-playwright
 * -tests/tests/demoblaze/login.spec.ts}). Same TC IDs in all three
 * frameworks so a reader can compare the same test side-by-side.
 *
 * <p><b>Precondition for TC-LOGIN-002 / 003:</b> a registered user
 * {@code qatestuser / Test1234} must exist on demoblaze.com. The
 * suite skips them when system property {@code -DskipAuth=true}.
 */
public class LoginTests extends BaseTest {

    // Skip auth-dependent tests via -DskipAuth=true, same pattern as
    // CYPRESS_CI_SKIP_AUTH_TESTS in the JS suites.
    private static final boolean SKIP_AUTH =
            Boolean.parseBoolean(System.getProperty("skipAuth", "false"));

    private static final String VALID_USER = "qatestuser";
    private static final String VALID_PASS = "Test1234";

    // ----------------------------------------------------------
    // POSITIVE TEST CASES
    // ----------------------------------------------------------

    @Test
    public void tcLogin001_LoginModalOpensWithAllRequiredFields() {
        LoginPage page = new LoginPage(driver).visit().openLoginModal();
        Assert.assertTrue(page.isLoginModalOpen(),
                "Login modal should be visible after clicking the header link");
    }

    @Test
    public void tcLogin002_ValidCredentialsLogTheUserIn() {
        if (SKIP_AUTH) {
            throw new org.testng.SkipException(
                    "Requires pre-registered user — skipped when -DskipAuth=true");
        }
        LoginPage page = new LoginPage(driver)
                .visit()
                .openLoginModal()
                .loginAs(VALID_USER, VALID_PASS);

        Assert.assertTrue(page.isWelcomeLabelVisible(),
                "Welcome label should appear after successful login");
    }

    @Test
    public void tcLogin003_NavbarShowsWelcomeUsernameAfterLogin() {
        if (SKIP_AUTH) {
            throw new org.testng.SkipException(
                    "Requires pre-registered user — skipped when -DskipAuth=true");
        }
        LoginPage page = new LoginPage(driver)
                .visit()
                .openLoginModal()
                .loginAs(VALID_USER, VALID_PASS);

        Assert.assertTrue(page.isWelcomeLabelVisible());
        Assert.assertTrue(
                page.getWelcomeLabelText().contains(VALID_USER),
                "Navbar should contain the logged-in username");
    }

    // ----------------------------------------------------------
    // NEGATIVE TEST CASES
    // ----------------------------------------------------------

    @Test
    public void tcLogin004_EmptyFormSubmissionShowsAlertAndKeepsModalOpen() {
        LoginPage page = new LoginPage(driver).visit().openLoginModal();
        // Click submit without filling anything.
        page.loginAs(null, null);

        String alertText = page.acceptAlertAndGetText();
        Assert.assertTrue(alertText.toLowerCase().contains("fill out"),
                "Alert text should mention 'fill out'. Got: " + alertText);
        Assert.assertTrue(page.isLoginModalOpen(),
                "Modal should still be open after the dismissed alert");
    }

    @Test
    public void tcLogin005_WrongPasswordShowsWrongPasswordAlert() {
        LoginPage page = new LoginPage(driver)
                .visit()
                .openLoginModal()
                .loginAs(VALID_USER, "wrong_password_xyz");

        String alertText = page.acceptAlertAndGetText();
        Assert.assertTrue(alertText.contains("Wrong password"),
                "Alert should say 'Wrong password'. Got: " + alertText);
        Assert.assertFalse(page.isWelcomeLabelVisible(),
                "User should NOT be logged in after wrong password");
    }

    @Test
    public void tcLogin006_NonExistentUserShowsUserDoesNotExistAlert() {
        LoginPage page = new LoginPage(driver)
                .visit()
                .openLoginModal()
                .loginAs("this_user_does_not_exist_xyzabc999", "any_password");

        String alertText = page.acceptAlertAndGetText();
        Assert.assertTrue(alertText.contains("User does not exist"),
                "Alert should say 'User does not exist'. Got: " + alertText);
        Assert.assertFalse(page.isWelcomeLabelVisible());
    }
}
