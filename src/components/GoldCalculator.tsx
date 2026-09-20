"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { calculateFairPrice } from "@/lib/calculator";
import { currencyDecimals, type CurrencyCode } from "@/lib/currency";
import {
  DEMO_FORM,
  DEMO_RATE_24K,
  EMPTY_FORM,
  EMPTY_REVERSE,
  emptyStore,
  validateFair,
  type FairFormState,
  type ReverseFormState,
  type StoreDraft,
} from "@/lib/form";
import { pricePerGram } from "@/lib/gold";
import { fetchGoldPrice } from "@/lib/gold-price-source";
import { createTranslator, direction, type Language } from "@/lib/i18n";
import { parsePositive, roundTo } from "@/lib/precision";
import {
  getPrefsSnapshot,
  getServerPrefsSnapshot,
  setPrefs,
  subscribePrefs,
} from "@/lib/prefs-store";
import { loadRate, saveRate, type StoredRate } from "@/lib/storage";
import { CompareTab } from "./CompareTab";
import { FairPriceTab } from "./FairPriceTab";
import { Header } from "./Header";
import { PrefsProvider } from "./prefs";
import { RatesPanel } from "./RatesPanel";
import { ReverseTab } from "./ReverseTab";

type Tab = "fair" | "compare" | "reverse";

const TABS: Array<{ id: Tab; key: "nav.fair" | "nav.compare" | "nav.reverse" }> = [
  { id: "fair", key: "nav.fair" },
  { id: "compare", key: "nav.compare" },
  { id: "reverse", key: "nav.reverse" },
];

const EMPTY_RATE: StoredRate = { value: "", source: "manual", at: null };

export function GoldCalculator() {
  const { language, currency } = useSyncExternalStore(
    subscribePrefs,
    getPrefsSnapshot,
    getServerPrefsSnapshot,
  );

  const [rate, setRate] = useState<StoredRate>(EMPTY_RATE);
  const [rateLoading, setRateLoading] = useState(false);
  const [rateError, setRateError] = useState<string | null>(null);

  const [tab, setTab] = useState<Tab>("fair");
  const [form, setForm] = useState<FairFormState>(EMPTY_FORM);
  const [reverse, setReverse] = useState<ReverseFormState>(EMPTY_REVERSE);
  const [stores, setStores] = useState<StoreDraft[]>([]);

  const t = useMemo(() => createTranslator(language), [language]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction(language);
  }, [language]);

  const loadRateForCurrency = useCallback(
    async (
      target: CurrencyCode,
      { force, signal }: { force?: boolean; signal?: () => boolean } = {},
    ) => {
      const stale = () => signal?.() ?? false;
      const stored = loadRate(target);

      if (stored && !force) {
        if (stale()) return;
        setRate(stored);
        setRateError(null);
        return;
      }

      if (stale()) return;
      setRate(stored ?? EMPTY_RATE);
      setRateLoading(true);
      setRateError(null);

      try {
        const quote = await fetchGoldPrice(target);
        const next: StoredRate = {
          value: String(quote.pricePerGram24k),
          source: "live",
          at: quote.fetchedAt,
        };
        saveRate(target, next);
        if (!stale()) setRate(next);
      } catch {
        if (!stored && !stale()) setRateError(t("rates.error"));
      } finally {
        if (!stale()) setRateLoading(false);
      }
    },
    [t],
  );

  // The rate is stored per currency, so switching currency swaps the rate too.
  useEffect(() => {
    let cancelled = false;
    // Fetching a rate is synchronization with an external system, not derived
    // state, and the cancel flag keeps a stale response from landing.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadRateForCurrency(currency, { signal: () => cancelled });
    return () => {
      cancelled = true;
    };
  }, [currency, loadRateForCurrency]);

  const changeLanguage = (next: Language) => setPrefs({ language: next });

  const changeCurrency = (next: CurrencyCode) => setPrefs({ currency: next });

  const setRateValue = (value: string) => {
    const next: StoredRate = { value, source: "manual", at: null };
    setRate(next);
    setRateError(null);
    saveRate(currency, next);
  };

  const price24k = parsePositive(rate.value) ?? 0;
  // Rounded to the currency's own decimals so the figure in the field matches
  // the rate table and the arithmetic behind it exactly.
  const ratePricePerGram = roundTo(
    pricePerGram(price24k, form.karat),
    currencyDecimals(currency),
  );
  const overridePrice = form.priceOverride === null ? null : parsePositive(form.priceOverride);
  const effectivePricePerGram = overridePrice ?? ratePricePerGram;

  const weight = parsePositive(form.weight) ?? 0;
  const errors = validateFair(form, ratePricePerGram);

  const result = calculateFairPrice({
    weightGrams: weight,
    pricePerGram: effectivePricePerGram,
    makingMode: form.makingMode,
    makingValue: parsePositive(form.makingValue) ?? 0,
    taxPercent: parsePositive(form.taxPercent) ?? 0,
    quotedPrice: parsePositive(form.quotedPrice),
  });

  const ready = weight > 0 && effectivePricePerGram > 0;

  const updateForm = (patch: Partial<FairFormState>) =>
    setForm((current) => ({ ...current, ...patch }));

  const resetAll = () => {
    setForm(EMPTY_FORM);
    setReverse(EMPTY_REVERSE);
    setStores([]);
  };

  // Demo quotes are derived from whatever rate is loaded, so the example stays
  // realistic whether gold is at 43 dinars a gram or 60.
  const applyDemo = () => {
    const demo = DEMO_FORM[currency];
    const decimals = currencyDecimals(currency);
    const basePrice = price24k > 0 ? price24k : (parsePositive(DEMO_RATE_24K[currency]) ?? 0);
    if (price24k <= 0) setRateValue(DEMO_RATE_24K[currency]);

    const perGram = roundTo(pricePerGram(basePrice, demo.karat), decimals);
    const preview = calculateFairPrice({
      weightGrams: parsePositive(demo.weight) ?? 0,
      pricePerGram: perGram,
      makingMode: demo.makingMode,
      makingValue: parsePositive(demo.makingValue) ?? 0,
      taxPercent: parsePositive(demo.taxPercent) ?? 0,
      quotedPrice: null,
    });

    const quoted = String(roundTo(preview.expectedTotal * 1.12, decimals));
    const rival = String(roundTo(preview.expectedTotal * 1.03, decimals));

    setForm({ ...demo, quotedPrice: quoted });
    setReverse({
      karat: demo.karat,
      weight: demo.weight,
      totalPrice: quoted,
      includedTaxPercent: demo.taxPercent,
    });
    setStores([
      { ...emptyStore(1), quotedTotal: quoted, statedMakingCharge: "" },
      { ...emptyStore(2), quotedTotal: rival, statedMakingCharge: "" },
    ]);
  };

  return (
    <PrefsProvider language={language} currency={currency}>
      <div className="flex min-h-dvh flex-col">
        <Header
          language={language}
          onLanguageChange={changeLanguage}
          currency={currency}
          onCurrencyChange={changeCurrency}
        />

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-16 pt-5 sm:px-6">
          <p className="mb-5 max-w-xl text-sm leading-relaxed text-muted">
            {t("brand.subtitle")}
          </p>

          <RatesPanel
            price24k={rate.value}
            onPrice24kChange={setRateValue}
            selectedKarat={form.karat}
            onKaratSelect={(karat) => {
              updateForm({ karat });
              setReverse((current) => ({ ...current, karat }));
            }}
            source={rate.source}
            fetchedAt={rate.at}
            loading={rateLoading}
            error={rateError}
            onFetch={() => void loadRateForCurrency(currency, { force: true })}
          />

          <nav className="mt-6 flex gap-1 border-b border-rule" aria-label="Sections">
            {TABS.map((item) => {
              const active = item.id === tab;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  aria-current={active ? "page" : undefined}
                  className={`focus-ring -mb-px border-b-2 px-3 py-2.5 text-[13px] font-medium transition-colors sm:px-4 sm:text-sm ${
                    active
                      ? "border-ink text-ink"
                      : "border-transparent text-muted hover:text-ink"
                  }`}
                >
                  {t(item.key)}
                </button>
              );
            })}
          </nav>

          <div className="mt-4">
            {tab === "fair" ? (
              <FairPriceTab
                form={form}
                onChange={updateForm}
                errors={errors}
                ratePricePerGram={ratePricePerGram}
                result={result}
                ready={ready}
                onReset={resetAll}
                onDemo={applyDemo}
              />
            ) : null}

            {tab === "compare" ? (
              <CompareTab
                stores={stores}
                karat={form.karat}
                ready={ready}
                context={{
                  weightGrams: weight,
                  goldValue: result.goldValue,
                  expectedTotal: result.expectedTotal,
                }}
                onAdd={() => setStores((current) => [...current, emptyStore(current.length + 1)])}
                onRemove={(id) => setStores((current) => current.filter((store) => store.id !== id))}
                onChange={(id, patch) =>
                  setStores((current) =>
                    current.map((store) => (store.id === id ? { ...store, ...patch } : store)),
                  )
                }
              />
            ) : null}

            {tab === "reverse" ? (
              <ReverseTab
                form={reverse}
                onChange={(patch) => setReverse((current) => ({ ...current, ...patch }))}
                price24k={price24k}
              />
            ) : null}
          </div>
        </main>

        <footer className="border-t border-rule bg-paper-deep">
          <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-6 sm:px-6">
            <p className="text-xs text-muted">{t("footer.note")}</p>
            <p className="label">{t("footer.disclaimer")}</p>
          </div>
        </footer>
      </div>
    </PrefsProvider>
  );
}
