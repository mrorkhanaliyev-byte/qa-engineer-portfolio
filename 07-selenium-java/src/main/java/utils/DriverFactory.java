package utils;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;

import java.time.Duration;

/**
 * Creates a fresh WebDriver instance per test based on the
 * {@code -Dbrowser=} system property (chrome | firefox).
 *
 * <p>Why a factory rather than a single static driver: parallel test
 * execution in TestNG needs one driver per test thread. The factory
 * pattern is the cleanest way to guarantee that.
 *
 * <p>WebDriverManager handles downloading the matching ChromeDriver /
 * geckodriver — no manual driver downloads or PATH wrangling needed.
 */
public final class DriverFactory {

    private DriverFactory() {
        // Utility class — no instances.
    }

    public static WebDriver create() {
        String browser = System.getProperty("browser", "chrome").toLowerCase();
        return switch (browser) {
            case "firefox" -> firefox();
            case "chrome"  -> chrome();
            default        -> throw new IllegalArgumentException(
                    "Unsupported browser: " + browser + " (supported: chrome, firefox)");
        };
    }

    private static WebDriver chrome() {
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        // Headless mode is opt-in via -Dheadless=true so local debug
        // runs default to a visible window.
        if (Boolean.parseBoolean(System.getProperty("headless", "false"))) {
            options.addArguments("--headless=new");
        }
        options.addArguments("--window-size=1440,900");
        WebDriver driver = new ChromeDriver(options);
        applyTimeouts(driver);
        return driver;
    }

    private static WebDriver firefox() {
        WebDriverManager.firefoxdriver().setup();
        FirefoxOptions options = new FirefoxOptions();
        if (Boolean.parseBoolean(System.getProperty("headless", "false"))) {
            options.addArguments("-headless");
        }
        WebDriver driver = new FirefoxDriver(options);
        applyTimeouts(driver);
        return driver;
    }

    private static void applyTimeouts(WebDriver driver) {
        // Tuned for real production sites that occasionally lag.
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(30));
        driver.manage().window().setSize(
                new org.openqa.selenium.Dimension(1440, 900));
    }
}
