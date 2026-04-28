import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// PUT: Update a hero post
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // Params is a Promise
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (
            !session ||
            (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')
        ) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { title, content, image, isActive, orientation } = await request.json();

        const post = await prisma.heroPost.update({
            where: { id },
            data: {
                title,
                content,
                image,
                isActive,
                orientation,
            },
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error('Error updating hero post:', error);
        return NextResponse.json(
            { error: 'Failed to update post' },
            { status: 500 }
        );
    }
}

// DELETE: Delete a hero post
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (
            !session ||
            (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')
        ) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await prisma.heroPost.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting hero post:', error);
        return NextResponse.json(
            { error: 'Failed to delete post' },
            { status: 500 }
        );
    }
}
