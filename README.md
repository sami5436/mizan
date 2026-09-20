# Mizan

A gold jewelry price calculator. It splits any quote into raw gold value, making
charge, tax, and the markup sitting on top, in five currencies and two languages.

Live rates come from GoldAPI.io. Everything else runs in the browser, with no
account, no backend database, and nothing stored on a server.

## What it does

* **Fair price** — weight, karat, and a rate produce an expected total, then
  compares a shop's quote against it with a green, amber, red band.
* **Compare shops** — several quotes scored against the same gold value and the
  same expected total, side by side.
* **Reverse check** — enter what a shop charges and see the premium hidden
  inside it, per gram and as a percentage.
* **Rates** — one 24K market price per gram, with 18K, 21K, and 22K derived from
  purity ratios.

## Project structure

```
src/
  app/
    layout.tsx               Fonts, metadata, Open Graph tags, viewport
    page.tsx                 Server page, JSON-LD, renders the calculator
    globals.css              Design tokens and the few base styles
    icon.svg                 Favicon
    opengraph-image.tsx      1200x630 social card, built at build time
    api/gold-price/route.ts  Live rate endpoint, the only vendor specific file
  lib/                       All calculation and formatting logic, no JSX
    precision.ts             Rounding, parsing, safe division
    gold.ts                  Karat purity and rate derivation
    calculator.ts            Forward calculation and the status bands
    reverse.ts               Reverse calculation
    compare.ts               Shop by shop comparison
    currency.ts              Currency table and formatters
    i18n.ts                  English and Arabic dictionaries
    form.ts                  Form shapes, demo values, validation
    storage.ts               localStorage reads and writes
    prefs-store.ts           Language and currency as an external store
    __tests__/               Unit tests for every calculation
  components/                UI only, all state flows from GoldCalculator.tsx
```

The rule the codebase follows: `src/lib` never imports from `src/components`.
Anything numeric is a pure function that can be tested without rendering.

## Calculation formulas

```
Price per gram (karat)  = 24K market price x (karat / 24)
Raw gold value          = weight x price per gram
Making charge           = weight x charge per gram
                          or raw gold value x (charge percent / 100)
Subtotal                = raw gold value + making charge
Tax                     = subtotal x (tax percent / 100)
Expected total          = subtotal + tax
Markup amount           = quoted price - raw gold value
Markup percent          = (markup amount / raw gold value) x 100
Difference vs expected  = quoted price - expected total
Price per gram, all in  = (quoted price or expected total) / weight
```

Reverse check:

```
Total before tax        = shop total / (1 + tax percent / 100)
Implied premium         = total before tax - raw gold value
Premium per gram        = implied premium / weight
Premium percent         = (implied premium / raw gold value) x 100
```

Status bands, measured as a percentage above the expected total:

| Band  | Range                    |
| ----- | ------------------------ |
| Green | up to +5%                |
| Amber | +5% to +15%              |
| Red   | above +15%               |

It is arithmetic on the numbers entered, presented as a comparison and nothing
more.

## Running locally

```bash
npm install
cp .env.example .env.local     # then paste a key from goldapi.io/dashboard
npm run dev                    # http://localhost:3000
npm test                       # calculation unit tests, no test framework needed
npm run build                  # production build
```

Without `GOLD_API_KEY` the app still works; the rate field is filled in by hand
and the fetch button reports that live pricing is not configured.

## Connecting a different gold price API

One file: `src/app/api/gold-price/route.ts`. Replace the upstream `fetch` and
the `readProviderPrice` helper, keep returning the `GoldPriceQuote` shape from
`src/lib/gold-price-source.ts`, and nothing in the UI has to change.

Responses are cached for six hours (`CACHE_SECONDS`) so a free tier quota is not
burned by page views. Only the 24K price is ever requested; the other karats are
derived locally from purity, so one call covers the whole rate table.

## Changing the pricing logic

| To change                          | Edit                                       |
| ---------------------------------- | ------------------------------------------ |
| Any formula                        | `src/lib/calculator.ts`                    |
| Reverse premium math               | `src/lib/reverse.ts`                       |
| Shop comparison math               | `src/lib/compare.ts`                       |
| Karat purity, supported karats     | `src/lib/gold.ts`                          |
| Green, amber, red thresholds       | `STATUS_THRESHOLDS` in `calculator.ts`     |
| Rounding and decimal handling      | `src/lib/precision.ts`                     |
| Currencies and decimal places      | `src/lib/currency.ts`                      |
| Wording in either language         | `src/lib/i18n.ts`                          |
| Validation rules and limits        | `src/lib/form.ts`                          |

Update the matching test in `src/lib/__tests__/calculations.test.ts` and run
`npm test`.
