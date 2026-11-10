import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const runtime = 'nodejs';

export async function GET() {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/0dvd2f7nv';

  if (!privateKey || !publicKey) {
    return NextResponse.json(
      { error: 'ImageKit credentials are not configured in environment variables.' },
      { status: 503 }
    );
  }

  const token = crypto.randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 2400; // 40 min
  const toSign = token + expire;

  const signature = crypto
    .createHmac('sha1', privateKey)
    .update(toSign)
    .digest('hex');

  return NextResponse.json({
    token,
    expire,
    signature,
    publicKey,
    urlEndpoint,
  });
}
