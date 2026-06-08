package pages.saucedemo;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

/**
 * SauceDemo — Cart Page Object.
 *
 * <p>{@code /cart.html} — lists selected items, allows removal, and is the
 * jumping-off point to checkout. Mirrors the Cypress / Playwright CartPage.
 */
public class CartPage {

    private final WebDriver driver;
    private final WebDriverWait wait;

    // ---- Selectors ------------------------------------------------
    private static final By CART_ITEMS       = By.className("cart_item");
    private static final By ITEM_NAMES       = By.className("inventory_item_name");
    private static final By CHECKOUT_BUTTON  = By.cssSelector("[data-test=\"checkout\"]");
    private static final By CONTINUE_SHOPPING = By.cssSelector("[data-test=\"continue-shopping\"]");

    private static By removeButton(String slug) {
        return By.cssSelector("[data-test=\"remove-" + slug + "\"]");
    }

    public CartPage(WebDriver driver) {
        this.driver = driver;
        this.wait   = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    // ---- Actions --------------------------------------------------

    public CartPage removeItem(String slug) {
        By removeBtn = removeButton(slug);
        for (int attempt = 1; attempt <= 3; attempt++) {
            WebElement btn = wait.until(ExpectedConditions.elementToBeClickable(removeBtn));
            if (attempt == 1) {
                btn.click();
            } else {
                ((JavascriptExecutor) driver).executeScript("arguments[0].click();", btn);
            }
            try {
                new WebDriverWait(driver, Duration.ofSeconds(3))
                        .until(ExpectedConditions.invisibilityOfElementLocated(removeBtn));
                return this;
            } catch (TimeoutException dropped) {
                // remove click swallowed in headless — retry via JS
            }
        }
        throw new IllegalStateException("Could not remove item: " + slug);
    }

    public CartPage checkout() {
        for (int attempt = 1; attempt <= 3; attempt++) {
            WebElement btn = wait.until(ExpectedConditions.elementToBeClickable(CHECKOUT_BUTTON));
            if (attempt == 1) {
                btn.click();
            } else {
                ((JavascriptExecutor) driver).executeScript("arguments[0].click();", btn);
            }
            try {
                new WebDriverWait(driver, Duration.ofSeconds(3))
                        .until(ExpectedConditions.urlContains("/checkout-step-one.html"));
                return this;
            } catch (TimeoutException dropped) {
                // checkout click swallowed in headless — retry via JS
            }
        }
        throw new IllegalStateException("Could not start checkout");
    }

    public CartPage continueShopping() {
        driver.findElement(CONTINUE_SHOPPING).click();
        return this;
    }

    // ---- Assertions / Queries -------------------------------------

    public int itemCount() {
        return driver.findElements(CART_ITEMS).size();
    }

    public List<String> itemNames() {
        return driver.findElements(ITEM_NAMES).stream()
                .map(WebElement::getText)
                .collect(Collectors.toList());
    }

    public boolean containsItem(String name) {
        return itemNames().contains(name);
    }
}
