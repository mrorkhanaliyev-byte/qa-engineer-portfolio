# 07 — Selenium WebDriver Framework (Java)

A **hybrid test automation framework** built with Selenium WebDriver, Java, TestNG, and Maven — demonstrating production-grade automation architecture.

> **Status:** Will be built after completing my Selenium/Java coursework. Placeholder structure included for portfolio completeness.

## Framework Features

- **Page Object Model** — clean separation of test logic and UI selectors
- **Hybrid driver factory** — supports Chrome, Firefox, Edge via config
- **TestNG** — annotations, groups, parallel execution, data providers
- **Maven** — dependency management and build lifecycle
- **Log4j2** — structured logging
- **Allure** — reporting with screenshots on failure
- **Cross-environment config** — dev / staging / prod via `config.properties`

## Project Structure

```
07-selenium-java/
├── pom.xml
├── testng.xml
├── src/
│   ├── main/java/
│   │   ├── base/
│   │   │   └── BaseTest.java          # WebDriver setup, teardown, screenshots
│   │   ├── pages/
│   │   │   ├── LoginPage.java
│   │   │   ├── ProductsPage.java
│   │   │   └── CheckoutPage.java
│   │   └── utils/
│   │       ├── ConfigReader.java      # Reads config.properties
│   │       ├── DriverFactory.java     # Returns the right WebDriver
│   │       └── ScreenshotUtil.java
│   └── test/java/
│       └── tests/
│           ├── LoginTests.java
│           ├── CartTests.java
│           └── CheckoutTests.java
└── src/test/resources/
    ├── config.properties
    └── testdata/users.json
```

## Page Object Example (planned)

```java
public class LoginPage extends BasePage {

    @FindBy(id = "user-name")
    private WebElement username;

    @FindBy(id = "password")
    private WebElement password;

    @FindBy(id = "login-button")
    private WebElement loginButton;

    @FindBy(css = "[data-test='error']")
    private WebElement errorMessage;

    public LoginPage(WebDriver driver) {
        super(driver);
        PageFactory.initElements(driver, this);
    }

    public ProductsPage loginAs(String user, String pass) {
        username.sendKeys(user);
        password.sendKeys(pass);
        loginButton.click();
        return new ProductsPage(driver);
    }

    public String getErrorMessage() {
        return errorMessage.getText();
    }
}
```

## Running

```bash
cd 07-selenium-java

# Run all tests
mvn clean test

# Run a specific TestNG suite
mvn clean test -DsuiteXmlFile=testng-smoke.xml

# Run against a specific browser
mvn clean test -Dbrowser=firefox

# Generate Allure report
mvn allure:report
```

## CI

`.github/workflows/selenium.yml` runs the smoke suite on every push using GitHub-hosted runners with headless Chrome.
