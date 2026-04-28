import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PUT update gallery image (Admin/Super Admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes((session.user as any).role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { url, caption, width, height, category, eventDate } = body as {
      url?: string;
      caption?: string | null;
      width?: number;
      height?: number;
      category?: string | null;
      eventDate?: string | null;
    };

    const existing = await prisma.galleryImage.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    let parsedEventDate: Date | null | undefined = undefined;
    if (eventDate !== undefined) {
      if (eventDate === null || eventDate === '') {
        parsedEventDate = null;
      } else {
        const d = new Date(eventDate);
        if (Number.isNaN(d.valueOf())) {
          return NextResponse.json({ error: 'Invalid eventDate' }, { status: 400 });
        }
        parsedEventDate = d;
      }
    }

    const image = await prisma.galleryImage.update({
      where: { id },
      data: {
        url: url ?? undefined,
        caption: caption ?? undefined,
        width: typeof width === 'number' ? width : undefined,
        height: typeof height === 'number' ? height : undefined,
        category: category ?? undefined,
        eventDate: parsedEventDate,
      },
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error('Error updating gallery image:', error);
    return NextResponse.json(
      { error: 'Failed to update gallery image' },
      { status: 500 }
    );
  }
}

// DELETE gallery image (Admin/Super Admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['ADMIN', 'SUPER_ADMIN'].includes((session.user as any).role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.galleryImage.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    await prisma.galleryImage.delete({ where: { id } });

    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return NextResponse.json(
      { error: 'Failed to delete gallery image' },
      { status: 500 }
    );
  }
}
