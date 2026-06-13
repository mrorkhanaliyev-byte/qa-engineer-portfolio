# QA Engineer Portfolio

[English](./README.md) | **Azərbaycanca**

> Real e-ticarət tətbiqləri üzərində **tam QA həyat dövrünü** nümayiş etdirən başdan-başa Keyfiyyət Təminatı portfeli — manual test dizaynı və bug hesabatlarından tutmuş API testləri, verilənlər bazası validasiyası və bir neçə framework üzərində UI avtomatlaşdırmasına qədər.

[![Cypress E2E](https://github.com/mrorkhanaliyev-byte/qa-engineer-portfolio/actions/workflows/cypress.yml/badge.svg)](https://github.com/mrorkhanaliyev-byte/qa-engineer-portfolio/actions/workflows/cypress.yml)
[![Playwright Cross-Browser](https://github.com/mrorkhanaliyev-byte/qa-engineer-portfolio/actions/workflows/playwright.yml/badge.svg)](https://github.com/mrorkhanaliyev-byte/qa-engineer-portfolio/actions/workflows/playwright.yml)
[![Accessibility](https://github.com/mrorkhanaliyev-byte/qa-engineer-portfolio/actions/workflows/accessibility.yml/badge.svg)](https://github.com/mrorkhanaliyev-byte/qa-engineer-portfolio/actions/workflows/accessibility.yml)
[![Newman API](https://github.com/mrorkhanaliyev-byte/qa-engineer-portfolio/actions/workflows/newman.yml/badge.svg)](https://github.com/mrorkhanaliyev-byte/qa-engineer-portfolio/actions/workflows/newman.yml)
[![SQL Queries](https://github.com/mrorkhanaliyev-byte/qa-engineer-portfolio/actions/workflows/sql.yml/badge.svg)](https://github.com/mrorkhanaliyev-byte/qa-engineer-portfolio/actions/workflows/sql.yml)
[![k6 Performance](https://github.com/mrorkhanaliyev-byte/qa-engineer-portfolio/actions/workflows/k6.yml/badge.svg)](https://github.com/mrorkhanaliyev-byte/qa-engineer-portfolio/actions/workflows/k6.yml)
[![Selenium Java](https://github.com/mrorkhanaliyev-byte/qa-engineer-portfolio/actions/workflows/selenium.yml/badge.svg)](https://github.com/mrorkhanaliyev-byte/qa-engineer-portfolio/actions/workflows/selenium.yml)
[![GitLab CI](https://img.shields.io/badge/GitLab_CI-configured-FC6D26?logo=gitlab&logoColor=white)](https://gitlab.com/orkhanaliyev/qa-engineer-portfolio/-/blob/main/.gitlab-ci.yml)

> İki yerdə hostlanır: **[GitHub](https://github.com/mrorkhanaliyev-byte/qa-engineer-portfolio)** və **[GitLab](https://gitlab.com/orkhanaliyev/qa-engineer-portfolio)**. Bütün avtomatlaşdırılmış CI **GitHub Actions** üzərində işləyir (yeddi yol-əhatəli (path-scoped) workflow — brauzer E2E və headless Selenium daxil); manual-tetiklə işləyən **[`.gitlab-ci.yml`](./.gitlab-ci.yml)** isə sürətli headless suite-ləri (SQL, API, k6 smoke) GitLab CI-da güzgüləyir.

![Manual Testing](https://img.shields.io/badge/Manual_Testing-✓-success)
![Jira](https://img.shields.io/badge/Jira-0052CC?logo=jira&logoColor=white)
![SQL](https://img.shields.io/badge/SQL-4479A1?logo=mysql&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?logo=postman&logoColor=white)
![Cypress](https://img.shields.io/badge/Cypress-17202C?logo=cypress&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white)
![Selenium](https://img.shields.io/badge/Selenium-43B02A?logo=selenium&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?logo=openjdk&logoColor=white)
![k6](https://img.shields.io/badge/k6-7D64FF?logo=k6&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/CI-GitHub_Actions-2088FF?logo=githubactions&logoColor=white)

---

## Bu Portfel Haqqında

Bu repozitoriya iki e-ticarət tətbiqini başdan-başa test edən **QA mühəndisi** kimi işimi sənədləşdirir:

- **[Automation Exercise](https://automationexercise.com/)** — tam e-ticarət axını (UI + REST API)
- **[SauceDemo](https://www.saucedemo.com/)** — Swag Labs mağazası (UI fokuslu)

Hər bölmə ayrı bir QA sahəsini əhatə edir. Birlikdə bir hekayə danışırlar: **coverage dizayn edə bilən, bug tapan, onları aydın çatdıran və avtomatlaşdırma ilə reqressiyanın qarşısını alan bir tester.**

---

## İçindəkilər

| # | Bölmə | Fokus | Texnologiya |
|---|---|---|---|
| 01 | [Manual Testing](./01-manual-testing/) | Test planları, test case-lər, bug hesabatları, checklist-lər | Excel, Markdown |
| 02 | [Jira Workflow](./02-jira-workflow/) | Sprint board-ları, bug həyat dövrü, dashboard-lar | Jira |
| 03 | [SQL Queries](./03-sql-queries/) | Data validasiya sorğuları, join-lar, window funksiyaları | SQL |
| 04 | [API Testing](./04-postman-api-testing/) | REST API kolleksiyaları, env dəyişənləri, CI run-lar | Postman, Newman |
| 05 | [Cypress E2E](./05-cypress-tests/) | UI avtomatlaşdırma, Page Object Model | Cypress, JavaScript |
| 06 | [Playwright E2E](./06-playwright-tests/) | Cross-browser avtomatlaşdırma, fixture-lər | Playwright, TypeScript |
| 07 | [Selenium + Java](./07-selenium-java/) | TestNG framework, əl ilə yazılmış POM, SauceDemo + Demoblaze, headless-Chrome CI | Selenium 4, Java 17, TestNG, Maven |
| 08 | [Performance (k6)](./08-performance-k6/) | Smoke / load / stress, gate kimi threshold-lar, endpoint-lər üzrə büdcələr | k6, JavaScript |

Hər bölmənin işə salma təlimatları və ekran görüntüləri olan öz README-si var.

**Kəsişən (cross-cutting) sənədlər** bölmələri bir-birinə bağlayır:

- 🧭 **[Master Test Strategy](./TEST-STRATEGY.md)** — portfel boyu müdafiə-dərinliyi (defense-in-depth) keyfiyyət modeli: bütün 8 təbəqənin necə uyğunlaşması, risk-əsaslı coverage qərarları və CI gate arxitekturası
- 🔗 **[Requirements Traceability Matrix](./01-manual-testing/requirements-traceability-matrix.md)** — hər tələb → manual TC → avtomat test (CY/PW/SE/API/k6) → bug, bir görünüşdə (63 tələb)
- 📋 **[Test Plan](./01-manual-testing/test-plan.md)** · **[Cycle 1 Execution Summary](./01-manual-testing/test-execution-summary.md)** — hər dövr üçün plan və go/no-go tövsiyəsi ilə nəticələr

---

## Əsas Məqamlar (Highlights)

- **65 manual test case** — login, qeydiyyat, axtarış, səbət və checkout axınlarını əhatə edir
- **6 sənədləşdirilmiş bug hesabatı** — iki user-enumeration təhlükəsizlik tapıntısı (biri UI, biri API), production bankında 404 qırıq-link tapıntısı, WCAG accessibility uğursuzluğu, səbət-itməsi bug-ı və UX boşluq bug-ı — hər biri *fərqli* test təbəqəsindən üzə çıxıb
- **Master Test Strategy** — bütün 8 bölmənin bir yanaşmaya necə təbəqələndiyini (eyni tələbin manual / API / UI / təhlükəsizlik təbəqələrində yoxlanması), real risk-əsaslı coverage güzəştlərini və CI gate arxitekturasını göstərən portfel-boyu müdafiə-dərinliyi modeli
- **Requirements Traceability Matrix** — **63 tələbi** → test case-lərə → avtomat testlərə (Cypress / Playwright / Selenium / API / **k6**) → bug-lara bağlayır, üstəlik metrikalı və go/no-go tövsiyəli **Cycle 1 icra xülasəsi**
- **Smoke + reqressiya checklist-ləri** — P0/P1/P2 prioritetləşdirməsi ilə
- **Jira workflow** — fərdi bug-həyat-dövrü diaqramı (Mermaid), gündəlik istifadə üzrə qruplaşdırılmış 15+ JQL sorğusu, bug hesabatlarını real Jira ticket-lərinə import edən sürüklənə bilən CSV
- **Cypress E2E framework** — Page Object Model və Mochawesome reportu ilə — 7 sayt üzrə 12 spec (SauceDemo, Demoblaze, Automation Exercise login+səbət, **iki production bank** ABB Bank + Rabitabank, Tap.az, The Internet), **82 test case** — **sifariş təsdiqinə qədər tam SauceDemo alış axını** və The Internet meydançasında qabaqcıl **element-idarəetmə texnikaları** (iframe-lər, JS alert-lər, async wait-lər, fayl yükləmə, çox-pəncərə) daxil
- **Postman + Newman API suite** — **iki** API hədəfi: Automation Exercise-in 14 endpoint-i (həmişə-200 özəlliyi, zəncirvari istifadəçi həyat dövrü) **və** restful-booker REST API (token auth, tam CRUD POST/GET/PUT/PATCH/DELETE, real 403/404 mənfi case-lər) — 27 sorğu, 65+ assertion, ikisi də CI-da yaşıl
- **SQL validasiya suite** — SQLite e-ticarət sxemi, 19 sorğu (basic / join / subquery / window funksiyaları / QA validasiya), validasiya sorğularının üzə çıxardığı 5 qəsdən əkilmiş data-keyfiyyəti bug-ı, <10 saniyədə işləyir
- **Playwright cross-browser suite** — **TypeScript**-də — Cypress login + səbət + **tam SauceDemo checkout** axınlarını **Chromium, Firefox və WebKit (Safari)** üzərində paralel CI matrisində güzgüləyir; uğursuzluqda Trace Viewer artefaktları
- **Accessibility audit (WCAG 2.1 AA)** — `@axe-core/playwright` ilə — AE + Demoblaze üzrə 7 səhifə auditi, baseline-as-regression-gate (CI a11y borcunun artmasını tutur, hər kiçik xəbərdarlıqda sınmadan); tam tapıntılar [`AUDIT-RESULTS.md`](./06-playwright-tests/AUDIT-RESULTS.md)-də
- **Selenium 4 + Java 17 + TestNG framework** — əl ilə yazılmış POM (`By` konstantları + explicit wait-lər, PageFactory yox), iki sayt (**SauceDemo** login/inventory/səbət/**tam alış** + **Demoblaze** login), hər push-da **headless-Chrome CI**; eyni Demoblaze login axını yan-yana müqayisə üçün **3 dildə** (JS/TS/Java) mövcuddur. Qəsdən verilmiş **CI-scope qərarı** daxil: çoxaddımlı checkout throttle olunan public SauceDemo serverinə qarşı flaky-dir, ona görə CI deterministik altçoxluğu gate edir və tam alış lokal işləyir — *bloklayan gate-də flaky test, kiçik etibarlı testdən pisdir*
- **k6 ilə performans suite** — 04-cü bölmədə funksional test olunan **eyni restful-booker API**-yə qarşı smoke / load / stress skriptləri ("işləyir?" *və* "yük altında dayanır?"); **build-sındıran gate** kimi threshold-lar, **endpoint üzrə (tag-lı) gecikmə büdcələri** və sadəcə load testlə üzə çıxan iki real tapıntı (API `Accept` header olmadan **XML** qaytarır; pulsuz dyno-nun **cold-start**-ı onu 1 istifadəçidə 10-dan yavaş göstərir). Public serverdə nəzakətli qalmaq üçün CI-da yalnız smoke
- **GitHub Actions CI** — hər push-da Cypress, Playwright (×3 brauzer), Newman, SQL, k6 VƏ headless Selenium işlədir, reportları artefakt kimi yükləyir və bu README-də yeddi canlı yaşıl badge göstərir

---

## Necə İşə Salmalı

Hər avtomatlaşdırma framework-unun öz qovluğunda quraşdırma təlimatları var. Sürətli başlanğıc:

```bash
# Repozitoriyanı klonla
git clone https://github.com/mrorkhanaliyev-byte/qa-engineer-portfolio.git
cd qa-engineer-portfolio

# Cypress testlərini işə sal
cd 05-cypress-tests
npm install
npx cypress run

# Playwright testlərini işə sal
cd ../06-playwright-tests
npm install
npx playwright test

# Newman ilə API testlərini işə sal
cd ../04-postman-api-testing
newman run collections/automation-exercise-api.postman_collection.json
```

---

## Bir Baxışda Test Strategiyası

```
                   ┌─────────────────────────┐
                   │   Manual Exploration    │   ← kəşf et, coverage dizayn et
                   └───────────┬─────────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
       ┌──────▼──────┐  ┌──────▼──────┐  ┌─────▼──────┐
       │  Bug Report │  │ Test Cases  │  │  Checklist │   ← sənədləşdir
       │   (Jira)    │  │   (Excel)   │  │ (Markdown) │
       └──────┬──────┘  └──────┬──────┘  └─────┬──────┘
              │                │                │
              └────────────────┼────────────────┘
                               │
                   ┌───────────▼─────────────┐
                   │  Regression Automation  │   ← təkrarın qarşısını al
                   │ (Cypress / Playwright)  │
                   └───────────┬─────────────┘
                               │
                   ┌───────────▼─────────────┐
                   │     CI/CD on push       │   ← shift-left geribildirim
                   │   (GitHub Actions)      │
                   └─────────────────────────┘
```

---

## Haqqımda

**Orkhan Aliyev** — veb tətbiqlər üçün etibarlı, miqyaslana bilən test coverage qurmağa fokuslanan QA mühəndisi.

- 📧 mr.orkhan.aliyev@gmail.com
- 💼 [LinkedIn](https://www.linkedin.com/in/orkhan-aliyev-qa/)
- 🐙 [GitHub](https://github.com/mrorkhanaliyev-byte)
- 🦊 [GitLab](https://gitlab.com/orkhanaliyev)

---

## Lisenziya

[MIT Lisenziyası](./LICENSE) altında yayımlanıb — sərbəst oxumaq, təkrar istifadə etmək və öyrənmək üçün. Bu portfel təhsil və nümayiş məqsədlidir; test hədəfləri avtomatlaşdırılmış testə açıq icazə verən public demo saytlarıdır, production saytları isə (ABB, Rabitabank, Tap.az) yalnız oxu-rejimində (read-only) istifadə olunur.
