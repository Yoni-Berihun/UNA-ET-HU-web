import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET: Fetch hero posts
// If Admin/SuperAdmin -> fetch ALL
// If Public/Member -> fetch only ACTIVE
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        const { searchParams } = new URL(request.url);
        const isAdmin =
            session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';

        // If query param 'public' is present, force public view (active only)
        const forcePublic = searchParams.get('public') === 'true';

        const where = (!isAdmin || forcePublic) ? { isActive: true } : {};

        const posts = await prisma.heroPost.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error fetching hero posts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch posts' },
            { status: 500 }
        );
    }
}

// POST: Create a new hero post (Admin only)
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (
            !session ||
            (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')
        ) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { title, content, image, isActive, orientation } = await request.json();

        if (!title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        const post = await prisma.heroPost.create({
            data: {
                title,
                content,
                image,
                isActive: isActive ?? true,
                orientation: orientation || 'LANDSCAPE',
            },
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error('Error creating hero post:', error);
        return NextResponse.json(
            { error: 'Failed to create post' },
            { status: 500 }
        );
    }
}
