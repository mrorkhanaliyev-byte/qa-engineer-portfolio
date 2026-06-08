package pages.saucedemo;

import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

/**
 * SauceDemo — Inventory (Products) Page Object.
 *
 * <p>The product grid shown after login: item listing, the sort dropdown,
 * add-to-cart, and the cart badge / link. Mirrors the Cypress and Playwright
 * {@code InventoryPage} objects.
 */
public class InventoryPage {

    private final WebDriver driver;
    private final WebDriverWait wait;

    // ---- Selectors ------------------------------------------------
    private static final By INVENTORY_ITEMS = By.className("inventory_item");
    private static final By ITEM_NAMES       = By.className("inventory_item_name");
    private static final By ITEM_PRICES      = By.className("inventory_item_price");
    private static final By SORT_DROPDOWN    = By.cssSelector("[data-test=\"product-sort-container\"]");
    private static final By CART_BADGE = By.className("shopping_cart_badge");
    private static final By CART_LINK  = By.className("shopping_cart_link");

    // Add/remove buttons are keyed by a slugified product name, e.g.
    // [data-test="add-to-cart-sauce-labs-backpack"] / [data-test="remove-..."].
    private static By addToCartButton(String slug) {
        return By.cssSelector("[data-test=\"add-to-cart-" + slug + "\"]");
    }

    private static By removeButton(String slug) {
        return By.cssSelector("[data-test=\"remove-" + slug + "\"]");
    }

    public InventoryPage(WebDriver driver) {
        this.driver = driver;
        this.wait   = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    // ---- Actions --------------------------------------------------

    /**
     * Select a sort option by its &lt;option&gt; value:
     * {@code az} = Name A→Z, {@code za} = Name Z→A,
     * {@code lohi} = Price low→high, {@code hilo} = Price high→low.
     */
    public InventoryPage sortBy(String value) {
        new Select(driver.findElement(SORT_DROPDOWN)).selectByValue(value);
        return this;
    }

    /**
     * Add a product to the cart, confirming the add registered (the button
     * flips to "Remove"), and retrying if the click was lost.
     *
     * <p>SauceDemo's React buttons can drop a click before their handler is
     * fully wired under load, so we verify the outcome and re-click instead of
     * trusting a single fire — which also keeps the cart-badge read reliable.
     */
    public InventoryPage addToCart(String slug) {
        By removeBtn = removeButton(slug);
        for (int attempt = 1; attempt <= 3; attempt++) {
            if (!driver.findElements(removeBtn).isEmpty()) {
                return this; // already in the cart
            }
            wait.until(ExpectedConditions.elementToBeClickable(addToCartButton(slug))).click();
            try {
                new WebDriverWait(driver, Duration.ofSeconds(3))
                        .until(ExpectedConditions.visibilityOfElementLocated(removeBtn));
                return this;
            } catch (TimeoutException dropped) {
                // click was lost before React wired up — retry
            }
        }
        throw new IllegalStateException("Add-to-cart did not register for: " + slug);
    }

    public InventoryPage openCart() {
        driver.findElement(CART_LINK).click();
        wait.until(ExpectedConditions.urlContains("/cart.html"));
        return this;
    }

    // ---- Assertions / Queries -------------------------------------

    public int itemCount() {
        return driver.findElements(INVENTORY_ITEMS).size();
    }

    /** Cart-badge count, or 0 when the badge is absent (empty cart). */
    public int cartBadgeCount() {
        List<WebElement> badges = driver.findElements(CART_BADGE);
        return badges.isEmpty() ? 0 : Integer.parseInt(badges.get(0).getText().trim());
    }

    /** Rendered prices as doubles, in display order (for sort assertions). */
    public List<Double> prices() {
        return driver.findElements(ITEM_PRICES).stream()
                .map(el -> Double.parseDouble(el.getText().replace("$", "")))
                .collect(Collectors.toList());
    }

    /** Rendered product names, in display order (for sort assertions). */
    public List<String> names() {
        return driver.findElements(ITEM_NAMES).stream()
                .map(WebElement::getText)
                .collect(Collectors.toList());
    }
}
