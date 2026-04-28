import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

function isValidEmail(email: string) {
  // Simple pragmatic check (server-side). Avoids rejecting valid-but-rare emails too aggressively.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// POST: subscribe to newsletter (public)
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawEmail = typeof body.email === 'string' ? body.email : '';
    const email = rawEmail.trim().toLowerCase();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    await prisma.newsletterSubscriber.create({
      data: { email },
    });

    return NextResponse.json({ message: 'Subscribed' }, { status: 201 });
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        // Already subscribed
        return NextResponse.json({ message: 'Already subscribed' }, { status: 200 });
      }
    }

    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
