import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET: Fetch events
// - Admin/SuperAdmin: all events
// - Public: UPCOMING only
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const forcePublic = searchParams.get('public') === 'true';

    const isAdmin =
      session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';

    const where = (!isAdmin || forcePublic) ? { status: 'UPCOMING' } : {};

    const events = await prisma.conference.findMany({
      where,
      orderBy: { date: 'asc' },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

// POST: Create event (Admin/Super Admin)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));

    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const description = typeof body.description === 'string' ? body.description : '';
    const location = typeof body.location === 'string' ? body.location : null;
    const image = typeof body.image === 'string' ? body.image : null;
    const status = typeof body.status === 'string' ? body.status : 'UPCOMING';
    const dateRaw = typeof body.date === 'string' ? body.date : '';
    const applyLink = typeof body.applyLink === 'string' && body.applyLink.trim() ? body.applyLink.trim() : null;

    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    if (!description) return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    if (!dateRaw) return NextResponse.json({ error: 'Date is required' }, { status: 400 });

    const date = new Date(dateRaw);
    if (Number.isNaN(date.valueOf())) {
      return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
    }

    const event = await prisma.conference.create({
      data: {
        title,
        description,
        date,
        location,
        image,
        status,
        applyLink,
      } as any,
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
