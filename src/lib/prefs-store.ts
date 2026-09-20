import type { CurrencyCode } from "./currency.ts";
import type { Language } from "./i18n.ts";
import { loadCurrency, loadLanguage, saveCurrency, saveLanguage } from "./storage.ts";

export interface Prefs {
  language: Language;
  currency: CurrencyCode;
}

/**
 * Language and currency live outside React, in localStorage, so the app reads
 * them through `useSyncExternalStore`. The server renders the defaults and the
 * client swaps in the saved values on hydration, with no mismatch and no
 * second pass through an effect.
 */
const SERVER_SNAPSHOT: Prefs = { language: "en", currency: "KWD" };

let snapshot: Prefs | null = null;
const listeners = new Set<() => void>();

function current(): Prefs {
  if (snapshot === null) {
    snapshot = {
      language: loadLanguage() ?? SERVER_SNAPSHOT.language,
      currency: loadCurrency() ?? SERVER_SNAPSHOT.currency,
    };
  }
  return snapshot;
}

export function subscribePrefs(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getPrefsSnapshot(): Prefs {
  return current();
}

export function getServerPrefsSnapshot(): Prefs {
  return SERVER_SNAPSHOT;
}

export function setPrefs(patch: Partial<Prefs>): void {
  snapshot = { ...current(), ...patch };
  if (patch.language) saveLanguage(patch.language);
  if (patch.currency) saveCurrency(patch.currency);
  for (const listener of listeners) listener();
}
