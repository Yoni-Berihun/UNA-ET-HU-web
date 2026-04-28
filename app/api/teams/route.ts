import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Minimal teams list for admin dropdowns
export async function GET(_request: NextRequest) {
  try {
    const teams = await prisma.team.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  }
}
