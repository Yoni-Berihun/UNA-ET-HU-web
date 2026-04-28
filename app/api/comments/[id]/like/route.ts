import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const session = await getServerSession(authOptions);
        const { id: commentId } = await params;

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = (session.user as any).id;

        // Check if user already liked the comment
        const existingLike = await prisma.like.findFirst({
            where: {
                userId,
                commentId,
            },
        });

        if (existingLike) {
            // Unlike
            await prisma.like.delete({
                where: {
                    id: existingLike.id,
                },
            });

            const likesCount = await prisma.like.count({ where: { commentId } });
            return NextResponse.json({ liked: false, likesCount });
        } else {
            // Like
            await prisma.like.create({
                data: {
                    userId,
                    commentId,
                },
            });

            const likesCount = await prisma.like.count({ where: { commentId } });
            return NextResponse.json({ liked: true, likesCount });
        }
    } catch (error) {
        console.error('Error toggling comment like:', error);
        return NextResponse.json(
            { error: 'Failed to toggle like' },
            { status: 500 },
        );
    }
}
