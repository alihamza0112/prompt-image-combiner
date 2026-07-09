// Translation abstraction.
//
// This file is the single integration point for adding real translation
// (OpenAI, Gemini, Google Cloud Translation, Microsoft Translator, DeepL, etc.)
// without touching any UI code. Swap the body of `translateText` with a call
// to your provider — the UI already assumes an async (text, from, to) contract.
//
// The `from`/`to` codes are BCP-47 language tags matching the recognition
// language dropdown (e.g. "en-US", "ur-PK"). Most providers accept the base
// tag ("en", "ur") — use `baseLang()` when calling them.

export const baseLang = (tag: string) => tag.split("-")[0].toLowerCase();

export type TranslateResult = {
  text: string;
  translated: boolean; // false = returned as-is (no provider configured)
};

export async function translateText(
  text: string,
  from: string,
  to: string,
): Promise<TranslateResult> {
  const clean = text.trim();
  if (!clean) return { text: "", translated: false };
  if (baseLang(from) === baseLang(to)) return { text, translated: false };

  // No translation provider is wired up yet. Plug one in here — the UI
  // will automatically start showing translated output once this returns
  // { translated: true, text: <translated> }.
  //
  // Example (server function calling Lovable AI Gateway / OpenAI / DeepL):
  //   const res = await translateOnServer({ data: { text, from, to } });
  //   return { text: res.text, translated: true };

  return { text, translated: false };
}
