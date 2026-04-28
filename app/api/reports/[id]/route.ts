import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PUT: update annual report (Admin/Super Admin)
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
    const existing = await prisma.annualReport.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const body = await request.json().catch(() => ({}));

    const title = typeof body.title === 'string' ? body.title.trim() : undefined;
    const description = typeof body.description === 'string' ? body.description : undefined;
    const year = body.year !== undefined ? (typeof body.year === 'number' ? body.year : Number(body.year)) : undefined;
    const fileUrl = typeof body.fileUrl === 'string' ? body.fileUrl.trim() : undefined;
    const publishedAtRaw = body.publishedAt !== undefined ? (typeof body.publishedAt === 'string' ? body.publishedAt : '') : undefined;

    let publishedAt: Date | undefined = undefined;
    if (publishedAtRaw !== undefined && publishedAtRaw) {
      const d = new Date(publishedAtRaw);
      if (Number.isNaN(d.valueOf())) {
        return NextResponse.json({ error: 'Invalid publishedAt' }, { status: 400 });
      }
      publishedAt = d;
    }

    const report = await prisma.annualReport.update({
      where: { id },
      data: {
        title,
        description,
        year: year === undefined || Number.isNaN(year) ? undefined : year,
        fileUrl,
        publishedAt,
      },
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
  }
}

// DELETE: delete annual report (Admin/Super Admin)
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
    const existing = await prisma.annualReport.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await prisma.annualReport.delete({ where: { id } });
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Error deleting report:', error);
    return NextResponse.json({ error: 'Failed to delete report' }, { status: 500 });
  }
}
