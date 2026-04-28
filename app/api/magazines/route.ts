import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
    try {
        const magazines = await prisma.magazine.findMany({
            orderBy: {
                publishedAt: 'desc',
            },
        });
        return NextResponse.json(magazines);
    } catch (error) {
        console.error('Error fetching magazines:', error);
        return NextResponse.json(
            { error: 'Failed to fetch magazines' },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        // Check if user is admin or super admin
        if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
            return NextResponse.json(
                { error: 'Unauthorized: Admin access required' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { title, description, coverImage, embedCode, pdfUrl } = body;

        if (!title || !embedCode) {
            return NextResponse.json(
                { error: 'Title and embed code are required' },
                { status: 400 }
            );
        }

        const magazine = await prisma.magazine.create({
            data: {
                title,
                description,
                coverImage,
                embedCode,
                pdfUrl,
            },
        });

        return NextResponse.json(magazine, { status: 201 });
    } catch (error) {
        console.error('Error creating magazine:', error);
        return NextResponse.json(
            { error: 'Failed to create magazine' },
            { status: 500 }
        );
    }
}
