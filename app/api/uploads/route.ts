import { Buffer } from 'node:buffer';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const DEFAULT_BUCKET = 'uploads';

function getSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing Supabase server credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function normalizePrefix(value: FormDataEntryValue | null) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim().replace(/^\/+|\/+$/g, '');
}

async function ensurePublicBucket(storage: ReturnType<typeof getSupabaseAdminClient>['storage'], bucketName: string) {
  const { data: buckets, error: listError } = await storage.listBuckets();

  if (listError) {
    throw listError;
  }

  const existingBucket = buckets?.find((bucket) => bucket.name === bucketName);

  if (!existingBucket) {
    const { error: createError } = await storage.createBucket(bucketName, {
      public: true,
    });

    if (createError) {
      throw createError;
    }

    return;
  }

  if (!existingBucket.public) {
    const { error: updateError } = await storage.updateBucket(bucketName, {
      public: true,
    });

    if (updateError) {
      throw updateError;
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes((session.user as any).role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const fileEntry = formData.get('file');

    if (!(fileEntry instanceof File)) {
      return NextResponse.json({ error: 'A file is required' }, { status: 400 });
    }

    const sourceFileName = fileEntry.name.toLowerCase();
    const isPdf = fileEntry.type === 'application/pdf' || sourceFileName.endsWith('.pdf');
    const isImage = fileEntry.type.startsWith('image/') || /\.(png|jpe?g|gif|webp|avif|bmp|svg)$/i.test(sourceFileName);

    if (!isImage && !isPdf) {
      return NextResponse.json(
        { error: 'Only image and PDF uploads are supported' },
        { status: 400 }
      );
    }

    const bucketName =
      typeof formData.get('bucketName') === 'string' && formData.get('bucketName')
        ? String(formData.get('bucketName')).trim()
        : DEFAULT_BUCKET;
    const folder = normalizePrefix(formData.get('folder'));

    const fileExt = sourceFileName.split('.').pop() || (isPdf ? 'pdf' : 'bin');
    const objectFileName = `${crypto.randomUUID()}.${fileExt}`;
    const objectPath = folder ? `${folder}/${objectFileName}` : objectFileName;

    const supabase = getSupabaseAdminClient();
    await ensurePublicBucket(supabase.storage, bucketName);

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(objectPath, Buffer.from(await fileEntry.arrayBuffer()), {
        contentType: fileEntry.type || (isPdf ? 'application/pdf' : 'application/octet-stream'),
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(objectPath);

    return NextResponse.json({
      url: data.publicUrl,
      path: objectPath,
      bucketName,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to upload file',
      },
      { status: 500 }
    );
  }
}