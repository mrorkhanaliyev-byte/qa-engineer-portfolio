package pages.saucedemo;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

/**
 * SauceDemo — Checkout Page Object.
 *
 * <p>Spans the two checkout steps and the completion page:
 * <ul>
 *   <li>{@code /checkout-step-one.html} → buyer info form</li>
 *   <li>{@code /checkout-step-two.html} → order overview + totals</li>
 *   <li>{@code /checkout-complete.html} → "Thank you for your order!"</li>
 * </ul>
 *
 * <p>This is the object that lets the Selenium suite cover a COMPLETE purchase
 * flow end-to-end in CI — the same flow the Cypress and Playwright suites
 * cover, now in Java for the three-framework comparison.
 */
public class CheckoutPage {

    private final WebDriver driver;
    private final WebDriverWait wait;

    // ---- Selectors ------------------------------------------------
    // Step one — buyer info
    private static final By FIRST_NAME   = By.cssSelector("[data-test=\"firstName\"]");
    private static final By LAST_NAME    = By.cssSelector("[data-test=\"lastName\"]");
    private static final By POSTAL_CODE  = By.cssSelector("[data-test=\"postalCode\"]");
    private static final By CONTINUE_BTN = By.cssSelector("[data-test=\"continue\"]");
    private static final By ERROR_MESSAGE = By.cssSelector("[data-test=\"error\"]");

    // Step two — overview
    private static final By FINISH_BUTTON  = By.cssSelector("[data-test=\"finish\"]");
    private static final By OVERVIEW_ITEMS = By.className("cart_item");

    // Complete
    private static final By COMPLETE_HEADER = By.cssSelector("[data-test=\"complete-header\"]");

    public CheckoutPage(WebDriver driver) {
        this.driver = driver;
        this.wait   = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    // ---- Actions --------------------------------------------------

    public CheckoutPage fillBuyerInfo(String firstName, String lastName, String postalCode) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(FIRST_NAME));
        if (firstName != null)  typeAndVerify(FIRST_NAME, firstName);
        if (lastName != null)   typeAndVerify(LAST_NAME, lastName);
        if (postalCode != null) typeAndVerify(POSTAL_CODE, postalCode);
        clickContinue();
        return this;
    }

    /**
     * Click Continue and confirm the app actually reacted, retrying if not.
     *
     * <p>Like the rest of SauceDemo's SPA, the Continue button's React handler
     * can be slow to attach under load, so a click is occasionally lost and the
     * page just sits on step one. A successful click produces one of two visible
     * outcomes: the URL advances to step two (valid form) OR an error banner
     * appears (a required field was missing). If neither happens within a few
     * seconds, the click was dropped — so we click again.
     */
    private void clickContinue() {
        for (int attempt = 1; attempt <= 3; attempt++) {
            wait.until(ExpectedConditions.elementToBeClickable(CONTINUE_BTN)).click();
            try {
                new WebDriverWait(driver, Duration.ofSeconds(3)).until(d ->
                        d.getCurrentUrl().contains("/checkout-step-two.html")
                                || !d.findElements(ERROR_MESSAGE).isEmpty());
                return; // the app responded
            } catch (TimeoutException dropped) {
                // click was lost before React wired up — retry
            }
        }
    }

    /**
     * Type into a controlled input and confirm the value stuck.
     *
     * <p>SauceDemo's checkout fields are React controlled inputs. In headless
     * Chrome, {@code sendKeys} intermittently races React's onChange and the
     * keystrokes are silently dropped — the field ends up empty and the form
     * bounces back with a "required" error (verified: a field filled on one run
     * and stayed empty on the next, and plain re-typing failed three times in a
     * row under load). So we type with {@code sendKeys} first (realistic input)
     * and, only if the value didn't commit, fall back to setting it the
     * React-aware way: the native value setter plus a dispatched {@code input}
     * event, which is exactly what React listens for. Deterministic either way.
     */
    private void typeAndVerify(By locator, String value) {
        WebElement field = wait.until(ExpectedConditions.elementToBeClickable(locator));
        field.clear();
        field.sendKeys(value);
        if (!valueCommitted(locator, value)) {
            setReactInputValue(field, value);
        }
        wait.until(ExpectedConditions.attributeToBe(locator, "value", value));
    }

    private boolean valueCommitted(By locator, String value) {
        try {
            new WebDriverWait(driver, Duration.ofSeconds(1))
                    .until(ExpectedConditions.attributeToBe(locator, "value", value));
            return true;
        } catch (TimeoutException e) {
            return false;
        }
    }

    /** Set a React controlled input's value via the native setter + input event. */
    private void setReactInputValue(WebElement field, String value) {
        ((JavascriptExecutor) driver).executeScript(
                "const el = arguments[0], v = arguments[1];" +
                "const setter = Object.getOwnPropertyDescriptor(" +
                "    window.HTMLInputElement.prototype, 'value').set;" +
                "setter.call(el, v);" +
                "el.dispatchEvent(new Event('input',  { bubbles: true }));" +
                "el.dispatchEvent(new Event('change', { bubbles: true }));",
                field, value);
    }

    public CheckoutPage finish() {
        wait.until(ExpectedConditions.elementToBeClickable(FINISH_BUTTON)).click();
        return this;
    }

    // ---- Assertions / Queries -------------------------------------

    public boolean isOnOverview() {
        return wait.until(ExpectedConditions.urlContains("/checkout-step-two.html"));
    }

    public int overviewItemCount() {
        return driver.findElements(OVERVIEW_ITEMS).size();
    }

    public String getErrorText() {
        return wait.until(
                ExpectedConditions.visibilityOfElementLocated(ERROR_MESSAGE)
        ).getText();
    }

    /** True when the confirmation page shows the success header. */
    public boolean isOrderComplete() {
        wait.until(ExpectedConditions.urlContains("/checkout-complete.html"));
        String header = wait.until(
                ExpectedConditions.visibilityOfElementLocated(COMPLETE_HEADER)
        ).getText();
        return header.contains("Thank you for your order!");
    }
}
