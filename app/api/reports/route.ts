import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET: public list of annual reports
export async function GET() {
  try {
    const reports = await prisma.annualReport.findMany({
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

// POST: create annual report (Admin/Super Admin)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const description = typeof body.description === 'string' ? body.description : null;
    const year = typeof body.year === 'number' ? body.year : (typeof body.year === 'string' && body.year ? Number(body.year) : null);
    const fileUrl = typeof body.fileUrl === 'string' ? body.fileUrl.trim() : '';
    const publishedAtRaw = typeof body.publishedAt === 'string' ? body.publishedAt : null;

    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    if (!fileUrl) return NextResponse.json({ error: 'PDF URL is required' }, { status: 400 });

    let publishedAt: Date | undefined = undefined;
    if (publishedAtRaw) {
      const d = new Date(publishedAtRaw);
      if (Number.isNaN(d.valueOf())) {
        return NextResponse.json({ error: 'Invalid publishedAt' }, { status: 400 });
      }
      publishedAt = d;
    }

    const report = await prisma.annualReport.create({
      data: {
        title,
        description: description?.trim() ? description : null,
        year: year && !Number.isNaN(year) ? year : null,
        fileUrl,
        publishedAt,
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
  }
}
