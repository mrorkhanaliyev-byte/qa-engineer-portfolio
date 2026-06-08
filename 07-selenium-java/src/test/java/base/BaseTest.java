package base;

import org.openqa.selenium.WebDriver;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import utils.DriverFactory;

/**
 * Base class every per-method test extends. Owns the WebDriver lifecycle so
 * individual tests stay focused on what they're verifying.
 *
 * <p>Lives in {@code src/test/java} (not main) because it depends on TestNG,
 * which is a test-scoped dependency — test infrastructure belongs with tests.
 *
 * <p>Pattern: fresh driver per test method (heavier than per class, but no risk
 * of state leaking between tests — important for QA). Suites that must share one
 * logged-in session (e.g. SauceDemo {@code CheckoutTests}, to avoid the site's
 * login rate-limit) deliberately opt out and manage their own driver instead.
 */
public abstract class BaseTest {

    protected WebDriver driver;

    @BeforeMethod(alwaysRun = true)
    public void setUp() {
        driver = DriverFactory.create();
    }

    @AfterMethod(alwaysRun = true)
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
