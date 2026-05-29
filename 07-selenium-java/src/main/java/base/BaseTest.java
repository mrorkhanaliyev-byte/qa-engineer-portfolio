package base;

import org.openqa.selenium.WebDriver;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import utils.DriverFactory;

/**
 * Base class every test extends. Owns the WebDriver lifecycle so
 * individual tests stay focused on what they're verifying.
 *
 * <p>Pattern: fresh driver per test method (heavier than per class,
 * but no risk of state leaking between tests — important for QA).
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
