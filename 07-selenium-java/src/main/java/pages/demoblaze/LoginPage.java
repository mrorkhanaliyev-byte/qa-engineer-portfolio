package pages.demoblaze;

import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

/**
 * Demoblaze — Login Page Object.
 *
 * <p>Counterpart to the Cypress version at:
 * {@code 05-cypress-tests/cypress/pages/demoblaze/LoginPage.js}
 * <br>And the Playwright version at:
 * {@code 06-playwright-tests/pages/demoblaze/LoginPage.ts}
 *
 * <p>Same flow, three frameworks — a reader can diff the same login
 * test across Cypress (JS), Playwright (TS), and Selenium (Java) to
 * see how the patterns translate.
 *
 * <p><b>Java-specific notes:</b>
 * <ul>
 *   <li>{@code By} locators are defined as {@code private static final}
 *       constants — single source of truth, easy to update if Demoblaze
 *       renames an id.</li>
 *   <li>Explicit waits via {@code WebDriverWait} are preferred over
 *       implicit waits inside actions. Implicit waits are set in
 *       {@link utils.DriverFactory} as a safety net for elements not
 *       explicitly waited for.</li>
 *   <li>Methods return {@code this} for fluent chaining, mirroring the
 *       Cypress/Playwright POMs.</li>
 * </ul>
 */
public class LoginPage {

    private final WebDriver driver;
    private final WebDriverWait wait;

    // ---- Selectors ------------------------------------------------
    private static final By HEADER_LOGIN_LINK = By.id("login2");
    private static final By LOGIN_MODAL        = By.id("logInModal");
    private static final By USERNAME_INPUT     = By.id("loginusername");
    private static final By PASSWORD_INPUT     = By.id("loginpassword");
    // Submit button has no id — wired via inline onclick.
    private static final By SUBMIT_BUTTON      =
            By.cssSelector("button[onclick=\"logIn()\"]");
    private static final By WELCOME_LABEL      = By.id("nameofuser");

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.wait   = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    // ---- Actions --------------------------------------------------

    public LoginPage visit() {
        driver.get("https://www.demoblaze.com/");
        wait.until(ExpectedConditions.visibilityOfElementLocated(HEADER_LOGIN_LINK));
        return this;
    }

    public LoginPage openLoginModal() {
        driver.findElement(HEADER_LOGIN_LINK).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(LOGIN_MODAL));
        wait.until(ExpectedConditions.visibilityOfElementLocated(USERNAME_INPUT));
        return this;
    }

    /**
     * Fill credentials and submit. Does NOT assert outcome — the test
     * decides whether success or an alert is expected.
     */
    public LoginPage loginAs(String username, String password) {
        if (username != null) {
            driver.findElement(USERNAME_INPUT).sendKeys(username);
        }
        if (password != null) {
            driver.findElement(PASSWORD_INPUT).sendKeys(password);
        }
        driver.findElement(SUBMIT_BUTTON).click();
        return this;
    }

    /**
     * Accept the next browser alert and return its text.
     * Used by negative tests that expect Demoblaze to surface
     * an "alert()" dialog (e.g. "Wrong password.").
     */
    public String acceptAlertAndGetText() {
        Alert alert = wait.until(ExpectedConditions.alertIsPresent());
        String text = alert.getText();
        alert.accept();
        return text;
    }

    // ---- Assertions / Queries -------------------------------------

    public boolean isWelcomeLabelVisible() {
        try {
            return wait.until(
                    ExpectedConditions.visibilityOfElementLocated(WELCOME_LABEL)
            ).isDisplayed();
        } catch (org.openqa.selenium.TimeoutException e) {
            return false;
        }
    }

    public String getWelcomeLabelText() {
        return driver.findElement(WELCOME_LABEL).getText();
    }

    public boolean isLoginModalOpen() {
        return driver.findElement(LOGIN_MODAL).isDisplayed();
    }
}
