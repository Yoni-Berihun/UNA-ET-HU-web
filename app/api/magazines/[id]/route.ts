import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const magazine = await prisma.magazine.findUnique({
            where: {
                id,
            },
        });

        if (!magazine) {
            return NextResponse.json(
                { error: 'Magazine not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(magazine);
    } catch (error) {
        console.error('Error fetching magazine:', error);
        return NextResponse.json(
            { error: 'Failed to fetch magazine' },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { title, description, coverImage, embedCode, pdfUrl } = body;

        const magazine = await prisma.magazine.update({
            where: {
                id,
            },
            data: {
                title,
                description,
                coverImage,
                embedCode,
                pdfUrl,
            },
        });

        return NextResponse.json(magazine);
    } catch (error) {
        console.error('Error updating magazine:', error);
        return NextResponse.json(
            { error: 'Failed to update magazine' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await prisma.magazine.delete({
            where: {
                id,
            },
        });

        return NextResponse.json({ message: 'Magazine deleted successfully' });
    } catch (error) {
        console.error('Error deleting magazine:', error);
        return NextResponse.json(
            { error: 'Failed to delete magazine' },
            { status: 500 }
        );
    }
}
