// ============================================================
// GIVORA — TRANSLATION SERVICE (EGYPTIAN LOCALIZATION READY)
// Provider-agnostic translation layer supporting Gemini, OpenAI,
// Google Cloud Translation, and DeepL.
// ============================================================

import type { Locale, TranslationStatus } from '@/types';

export type TranslationProvider = 'gemini' | 'openai' | 'google' | 'deepl' | 'none';

export interface TranslationResult {
  translatedText: string;
  sourceLanguage: Locale;
  targetLanguage: Locale;
  provider: TranslationProvider;
  status: TranslationStatus;
}

// ----------------------------------------------------------------
// System Prompt for Egyptian Dialect & Luxury Brand Tone
// ----------------------------------------------------------------
const EGYPTIAN_ARABIC_PROMPT = `You are an expert luxury copywriter and translator for Givora (جيفورا), a premium Egyptian gift and digital experiences platform.
When translating to Arabic:
- Always translate into natural, attractive, stylish Egyptian Arabic (العامية المصرية الراقية والودودة).
- Never use Saudi, Gulf, or overly stiff classical corporate Arabic.
- Do NOT use low-end street slang. Maintain a luxury, emotional, warm, modern tone.
- Examples: 'ضيف للسلة' (not 'أضف إلى السلة'), 'اتسوق دلوقتي' (not 'تسوق الآن'), 'اكتشف الهدايا' (not 'اكتشف منتجاتنا'), 'اطلب هديتك' (not 'اطلب الآن'), 'كلمنا' (not 'تواصل معنا').

When translating from Egyptian Arabic to English:
- Translate the marketing intent and elegance accurately into professional, international luxury English.
- Do NOT translate Egyptian idioms literally if they sound awkward in English. Preserve the emotional impact and intent.
- Return ONLY the translated string without quotes, explanations, or metadata.`;

// ----------------------------------------------------------------
// PROVIDER: Gemini API
// ----------------------------------------------------------------
async function translateWithGemini(
  text: string,
  from: Locale,
  to: Locale
): Promise<TranslationResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');

  const instruction = to === 'ar'
    ? 'Translate into elegant Egyptian Arabic (العامية المصرية الراقية).'
    : 'Translate into elegant international luxury English.';

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: EGYPTIAN_ARABIC_PROMPT }]
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: `${instruction}\n\n"${text}"` }]
          }
        ],
        generationConfig: {
          temperature: 0.3,
        }
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Gemini translation error');
  }

  const data = await response.json();
  const translatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!translatedText) throw new Error('Empty response from Gemini Translate');

  return {
    translatedText,
    sourceLanguage: from,
    targetLanguage: to,
    provider: 'gemini',
    status: 'auto',
  };
}

// ----------------------------------------------------------------
// PROVIDER: OpenAI API
// ----------------------------------------------------------------
async function translateWithOpenAI(
  text: string,
  from: Locale,
  to: Locale
): Promise<TranslationResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not configured');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: EGYPTIAN_ARABIC_PROMPT },
        { role: 'user', content: `Translate from ${from} to ${to}:\n\n"${text}"` }
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'OpenAI translation error');
  }

  const data = await response.json();
  const translatedText = data?.choices?.[0]?.message?.content?.trim();

  if (!translatedText) throw new Error('Empty response from OpenAI Translate');

  return {
    translatedText,
    sourceLanguage: from,
    targetLanguage: to,
    provider: 'openai',
    status: 'auto',
  };
}

// ----------------------------------------------------------------
// PROVIDER: Google Cloud Translation API v2
// ----------------------------------------------------------------
async function translateWithGoogle(
  text: string,
  from: Locale,
  to: Locale
): Promise<TranslationResult> {
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!apiKey) throw new Error('GOOGLE_TRANSLATE_API_KEY is not configured');

  const langMap: Record<Locale, string> = { ar: 'ar', en: 'en' };

  const response = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: langMap[from],
        target: langMap[to],
        format: 'text',
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || 'Google Translate API error');
  }

  const data = await response.json();
  const translatedText = data?.data?.translations?.[0]?.translatedText;

  if (!translatedText) throw new Error('Empty response from Google Translate');

  return {
    translatedText,
    sourceLanguage: from,
    targetLanguage: to,
    provider: 'google',
    status: 'auto',
  };
}

// ----------------------------------------------------------------
// PROVIDER: DeepL API
// ----------------------------------------------------------------
async function translateWithDeepL(
  text: string,
  from: Locale,
  to: Locale
): Promise<TranslationResult> {
  const apiKey = process.env.DEEPL_API_KEY;
  const apiUrl = process.env.DEEPL_API_URL || 'https://api-free.deepl.com';
  if (!apiKey) throw new Error('DEEPL_API_KEY is not configured');

  const langMap: Record<Locale, string> = { ar: 'AR', en: 'EN' };

  const response = await fetch(`${apiUrl}/v2/translate`, {
    method: 'POST',
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: [text],
      source_lang: langMap[from],
      target_lang: langMap[to],
    }),
  });

  if (!response.ok) {
    const err = await response.text().catch(() => '');
    throw new Error(`DeepL API error: ${err}`);
  }

  const data = await response.json();
  const translatedText = data?.translations?.[0]?.text;

  if (!translatedText) throw new Error('Empty response from DeepL');

  return {
    translatedText,
    sourceLanguage: from,
    targetLanguage: to,
    provider: 'deepl',
    status: 'auto',
  };
}

// ----------------------------------------------------------------
// PROVIDER: None (Mock/Fallback)
// ----------------------------------------------------------------
async function translateWithNone(
  text: string,
  from: Locale,
  to: Locale
): Promise<TranslationResult> {
  // In development without API keys, return mock translation
  return {
    translatedText: `[${to.toUpperCase()}] ${text}`,
    sourceLanguage: from,
    targetLanguage: to,
    provider: 'none',
    status: 'auto',
  };
}

// ----------------------------------------------------------------
// MAIN TRANSLATE FUNCTION — Provider-agnostic entry point
// ----------------------------------------------------------------
export async function translate(
  text: string,
  from: Locale,
  to: Locale
): Promise<TranslationResult> {
  if (!text?.trim()) {
    return {
      translatedText: '',
      sourceLanguage: from,
      targetLanguage: to,
      provider: 'none',
      status: 'auto',
    };
  }

  if (from === to) {
    return {
      translatedText: text,
      sourceLanguage: from,
      targetLanguage: to,
      provider: 'none',
      status: 'auto',
    };
  }

  const provider = (process.env.TRANSLATION_PROVIDER || 'none') as TranslationProvider;

  switch (provider) {
    case 'gemini':
      return translateWithGemini(text, from, to);
    case 'openai':
      return translateWithOpenAI(text, from, to);
    case 'google':
      return translateWithGoogle(text, from, to);
    case 'deepl':
      return translateWithDeepL(text, from, to);
    case 'none':
    default:
      return translateWithNone(text, from, to);
  }
}

/**
 * Translate a LocalizedString field — fills in the missing language version.
 * Only translates if the target is missing or status is 'pending'/'failed'.
 * Never overwrites 'manual' translations unless forced.
 */
export async function autoTranslateField(
  existing: { ar?: string; en?: string; translationStatus?: TranslationStatus },
  sourceLocale: Locale,
  force: boolean = false
): Promise<{ ar: string; en: string; translationStatus: TranslationStatus; translationSource: 'auto' | 'manual' }> {
  const targetLocale: Locale = sourceLocale === 'ar' ? 'en' : 'ar';
  const sourceText = existing[sourceLocale] || '';
  const targetText = existing[targetLocale] || '';

  // Don't overwrite manual translations unless forced
  if (!force && existing.translationStatus === 'manual' && targetText) {
    return {
      ar: existing.ar || '',
      en: existing.en || '',
      translationStatus: 'manual',
      translationSource: 'manual',
    };
  }

  // Nothing to translate
  if (!sourceText) {
    return {
      ar: existing.ar || '',
      en: existing.en || '',
      translationStatus: 'pending',
      translationSource: 'auto',
    };
  }

  try {
    const result = await translate(sourceText, sourceLocale, targetLocale);
    return {
      ar: sourceLocale === 'ar' ? sourceText : result.translatedText,
      en: sourceLocale === 'en' ? sourceText : result.translatedText,
      translationStatus: 'auto',
      translationSource: 'auto',
    };
  } catch {
    return {
      ar: existing.ar || sourceText,
      en: existing.en || sourceText,
      translationStatus: 'failed',
      translationSource: 'auto',
    };
  }
}
