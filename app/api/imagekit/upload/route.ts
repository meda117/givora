import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;

  if (!privateKey || !publicKey) {
    return NextResponse.json(
      { error: 'ImageKit credentials not configured.' },
      { status: 503 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || '/givora';
    const fileName = (formData.get('fileName') as string) || file?.name || 'upload';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const token = crypto.randomUUID();
    const expire = Math.floor(Date.now() / 1000) + 2400;
    const signature = crypto
      .createHmac('sha1', privateKey)
      .update(token + expire)
      .digest('hex');

    const uploadForm = new FormData();
    uploadForm.append('file', file);
    uploadForm.append('fileName', fileName);
    uploadForm.append('folder', folder);
    uploadForm.append('publicKey', publicKey);
    uploadForm.append('signature', signature);
    uploadForm.append('expire', expire.toString());
    uploadForm.append('token', token);
    uploadForm.append('useUniqueFileName', 'true');

    const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      body: uploadForm,
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || 'ImageKit upload failed' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      url: data.url,
      fileId: data.fileId,
      filePath: data.filePath,
      name: data.name,
      size: data.size,
      fileType: data.fileType,
      width: data.width,
      height: data.height,
    });
  } catch (error) {
    console.error('ImageKit upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
