import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET gallery images (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const category = searchParams.get('category');

    const where: any = {};
    if (category && category !== 'All') {
      where.category = category;
    }

    const images = await prisma.galleryImage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
      { status: 500 }
    );
  }
}

// POST create gallery image (Admin/Super Admin)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes((session.user as any).role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { url, caption, width, height, category, eventDate } = body as {
      url?: string;
      caption?: string;
      width?: number;
      height?: number;
      category?: string;
      eventDate?: string;
    };

    if (!url) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    let parsedEventDate: Date | null = null;
    if (eventDate) {
      const d = new Date(eventDate);
      if (Number.isNaN(d.valueOf())) {
        return NextResponse.json({ error: 'Invalid eventDate' }, { status: 400 });
      }
      parsedEventDate = d;
    }

    const image = await prisma.galleryImage.create({
      data: {
        url,
        caption: caption || null,
        width: typeof width === 'number' ? width : undefined,
        height: typeof height === 'number' ? height : undefined,
        category: category || null,
        eventDate: parsedEventDate,
      },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error('Error creating gallery image:', error);
    return NextResponse.json(
      { error: 'Failed to create gallery image' },
      { status: 500 }
    );
  }
}
