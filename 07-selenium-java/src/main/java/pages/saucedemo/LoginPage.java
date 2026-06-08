package pages.saucedemo;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

/**
 * SauceDemo (Swag Labs) — Login Page Object.
 *
 * <p>Counterpart to:
 * <ul>
 *   <li>Cypress: {@code 05-cypress-tests/cypress/pages/saucedemo/LoginPage.js}</li>
 *   <li>Playwright: {@code 06-playwright-tests/pages/saucedemo/LoginPage.ts}</li>
 * </ul>
 * Same flow, three frameworks — diff them side-by-side.
 *
 * <p>Why SauceDemo is the CI-runnable site (unlike Demoblaze, which needs a
 * pre-registered account): its credentials are <b>public and fixed</b>, so the
 * full authenticated journey — login → cart → checkout → confirmation — runs in
 * CI with no provisioning. That's why the Selenium GitHub Actions workflow runs
 * the SauceDemo classes (no {@code -DskipAuth} needed).
 *
 * <p>SauceDemo exposes stable {@code data-test} attributes on every control, so
 * the locators here are robust — no brittle CSS or text matching.
 */
public class LoginPage {

    public static final String BASE_URL = "https://www.saucedemo.com/";

    private final WebDriver driver;
    private final WebDriverWait wait;

    // ---- Selectors ------------------------------------------------
    private static final By USERNAME_INPUT = By.cssSelector("[data-test=\"username\"]");
    private static final By PASSWORD_INPUT = By.cssSelector("[data-test=\"password\"]");
    private static final By LOGIN_BUTTON   = By.cssSelector("[data-test=\"login-button\"]");
    private static final By ERROR_MESSAGE  = By.cssSelector("[data-test=\"error\"]");

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.wait   = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    // ---- Actions --------------------------------------------------

    public LoginPage visit() {
        driver.get(BASE_URL);
        wait.until(ExpectedConditions.visibilityOfElementLocated(USERNAME_INPUT));
        return this;
    }

    /**
     * Fill credentials and submit. Either field may be {@code null} to
     * exercise the empty-field error paths.
     */
    public LoginPage loginAs(String username, String password) {
        if (username != null) {
            driver.findElement(USERNAME_INPUT).sendKeys(username);
        }
        if (password != null) {
            driver.findElement(PASSWORD_INPUT).sendKeys(password);
        }
        driver.findElement(LOGIN_BUTTON).click();
        return this;
    }

    // ---- Assertions / Queries -------------------------------------

    public boolean isUsernameFieldVisible() {
        return driver.findElement(USERNAME_INPUT).isDisplayed();
    }

    public boolean isPasswordFieldVisible() {
        return driver.findElement(PASSWORD_INPUT).isDisplayed();
    }

    public boolean isLoginButtonVisible() {
        return driver.findElement(LOGIN_BUTTON).isDisplayed();
    }

    /** True once the browser has navigated to the inventory page. */
    public boolean isOnInventory() {
        return wait.until(ExpectedConditions.urlContains("/inventory.html"));
    }

    /** Text of the red error banner — waits for it to appear first. */
    public String getErrorText() {
        return wait.until(
                ExpectedConditions.visibilityOfElementLocated(ERROR_MESSAGE)
        ).getText();
    }

    public boolean isStillOnLogin() {
        return driver.getCurrentUrl().equals(BASE_URL);
    }
}
