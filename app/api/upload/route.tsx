import { NextResponse } from 'next/server';
import { hasCloud, cloudinary } from '@/lib/cloudinary';
import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

export const runtime = 'nodejs'; // ważne dla sharp (nie edge)

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    const folder = (form.get('folder') as string) || 'uploads'; // avatar / gallery / uploads

    if (!file) {
      return NextResponse.json({ ok: false, error: 'Brak pliku' }, { status: 400 });
    }

    // wczytanie bufora
    const arrayBuffer = await file.arrayBuffer();
    const input = Buffer.from(arrayBuffer);

    // obróbka: max 1600x1600, webp q=80
    const processed = await sharp(input)
      .rotate()               // auto orient
      .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    // nazwa pliku
    const id = crypto.randomBytes(8).toString('hex');
    const filename = `${id}.webp`;

    // PRODUKCJA (Vercel) → Cloudinary
    if (hasCloud) {
      const res: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'image',
            format: 'webp',
            public_id: id,
            overwrite: true,
          },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(processed);
      });

      return NextResponse.json({ ok: true, url: res.secure_url });
    }

    // LOKALNIE → zapis do public/uploads
    const uploadsDir = path.join(process.cwd(), 'public', folder);
    await fs.mkdir(uploadsDir, { recursive: true });
    const fullPath = path.join(uploadsDir, filename);
    await fs.writeFile(fullPath, processed);

    // publiczny URL
    const url = `/${folder}/${filename}`;
    return NextResponse.json({ ok: true, url });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: 'Upload nie powiódł się' }, { status: 500 });
  }
}

