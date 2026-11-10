import { NextRequest, NextResponse } from 'next/server';
import { translate } from '@/lib/translation/service';
import type { Locale } from '@/types';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, from, to } = body as { text: string; from: Locale; to: Locale };

    if (!text || !from || !to) {
      return NextResponse.json(
        { error: 'text, from, and to are required' },
        { status: 400 }
      );
    }

    const result = await translate(text, from, to);

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Translation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
