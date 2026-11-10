import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function DELETE(request: NextRequest) {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

  if (!privateKey) {
    return NextResponse.json({ error: 'ImageKit is not configured.' }, { status: 503 });
  }

  try {
    const { fileId } = await request.json();

    if (!fileId) {
      return NextResponse.json({ error: 'fileId is required' }, { status: 400 });
    }

    const credentials = Buffer.from(`${privateKey}:`).toString('base64');

    const response = await fetch(`https://api.imagekit.io/v1/files/${fileId}`, {
      method: 'DELETE',
      headers: { Authorization: `Basic ${credentials}` },
    });

    if (!response.ok && response.status !== 204) {
      const error = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: error.message || 'Delete failed' },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('ImageKit delete error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
