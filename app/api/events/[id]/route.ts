import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PUT: Update event (Admin/Super Admin)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.conference.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const body = await request.json().catch(() => ({}));

    const title = typeof body.title === 'string' ? body.title.trim() : undefined;
    const description = typeof body.description === 'string' ? body.description : undefined;
    const location = typeof body.location === 'string' ? body.location : undefined;
    const image = typeof body.image === 'string' ? body.image : undefined;
    const status = typeof body.status === 'string' ? body.status : undefined;
    const applyLink = body.applyLink !== undefined
      ? (typeof body.applyLink === 'string' && body.applyLink.trim() ? body.applyLink.trim() : null)
      : undefined;

    const dateRaw = body.date !== undefined ? (typeof body.date === 'string' ? body.date : null) : undefined;
    let date: Date | undefined = undefined;
    if (dateRaw !== undefined) {
      if (!dateRaw) {
        return NextResponse.json({ error: 'Date is required' }, { status: 400 });
      }
      const d = new Date(dateRaw);
      if (Number.isNaN(d.valueOf())) {
        return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
      }
      date = d;
    }

    const event = await prisma.conference.update({
      where: { id },
      data: {
        title,
        description,
        location,
        image,
        status,
        date,
        applyLink: applyLink as any,
      } as any,
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

// DELETE: Delete event (Admin/Super Admin)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.conference.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await prisma.conference.delete({ where: { id } });
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
