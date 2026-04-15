import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      console.error('[signup] Missing DATABASE_URL');
      return NextResponse.json(
        { error: 'Database is not configured (DATABASE_URL missing)' },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => null);
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body?.password === 'string' ? body.password : '';
    const fullName = typeof body?.fullName === 'string' ? body.fullName.trim() : '';

    // Validation
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        role: 'MEMBER',
      },
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: 'User created successfully', user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    const isProd = process.env.NODE_ENV === 'production';

    // Log actionable connection hints without leaking credentials.
    try {
      const url = new URL(process.env.DATABASE_URL || '');
      const pgbouncer = url.searchParams.get('pgbouncer');
      console.error('[signup] DB target:', {
        host: url.hostname,
        port: url.port || '(default)',
        pgbouncer,
        sslmode: url.searchParams.get('sslmode'),
      });
    } catch {
      // ignore URL parse failures
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('[signup] PrismaClientKnownRequestError', {
        code: error.code,
        meta: error.meta,
        message: error.message,
      });

      // Common: unique constraint (email)
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          error: 'Failed to create user',
          ...(isProd
            ? {}
            : {
                details: {
                  code: error.code,
                  meta: error.meta,
                  message: error.message,
                },
              }),
        },
        { status: 500 }
      );
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
      console.error('[signup] PrismaClientInitializationError', {
        message: error.message,
      });
      return NextResponse.json(
        {
          error:
            'Database connection failed. Check DATABASE_URL / DIRECT_URL and Supabase pooler settings.',
          ...(isProd ? {} : { details: { message: error.message } }),
        },
        { status: 500 }
      );
    }

    console.error('[signup] Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user', ...(isProd ? {} : { details: String(error) }) },
      { status: 500 }
    );
  }
}
