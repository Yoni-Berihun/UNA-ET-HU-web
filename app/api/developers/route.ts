import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function normalizeHandle(value: unknown) {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  return trimmed.replace(/^@+/, '');
}

async function ensureDeveloperTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "developers" (
      "id" TEXT PRIMARY KEY,
      "full_name" TEXT NOT NULL,
      "title" TEXT NOT NULL,
      "mobile" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "image" TEXT,
      "linkedin_username" TEXT,
      "instagram_username" TEXT,
      "telegram_username" TEXT,
      "order" INTEGER NOT NULL DEFAULT 0,
      "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

export async function GET() {
  try {
    await ensureDeveloperTable();

    const developers = await prisma.developer.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });

    return NextResponse.json(developers);
  } catch (error) {
    console.error('Error fetching developers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch developers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDeveloperTable();

    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, title, mobile, email, image, linkedinUsername, instagramUsername, telegramUsername, order } = body as {
      fullName?: string;
      title?: string;
      mobile?: string;
      email?: string;
      image?: string;
      linkedinUsername?: string;
      instagramUsername?: string;
      telegramUsername?: string;
      order?: number;
    };

    if (!fullName || !title || !mobile || !email) {
      return NextResponse.json(
        { error: 'Full name, title, mobile, and email are required' },
        { status: 400 }
      );
    }

    const developer = await prisma.developer.create({
      data: {
        fullName,
        title,
        mobile,
        email,
        image: image || null,
        linkedinUsername: normalizeHandle(linkedinUsername),
        instagramUsername: normalizeHandle(instagramUsername),
        telegramUsername: normalizeHandle(telegramUsername),
        order: typeof order === 'number' ? order : 0,
      },
    });

    return NextResponse.json(developer, { status: 201 });
  } catch (error) {
    console.error('Error creating developer:', error);
    return NextResponse.json(
      { error: 'Failed to create developer' },
      { status: 500 }
    );
  }
}