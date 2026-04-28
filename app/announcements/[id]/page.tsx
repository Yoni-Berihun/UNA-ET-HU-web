import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import Link from 'next/link';

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic';

export default async function AnnouncementPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const post = await prisma.heroPost.findUnique({
        where: { id },
    });

    if (!post) {
        notFound();
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#f5f5f8] dark:bg-[#0f0f23] transition-colors duration-200">
            <Navigation />

            <main className="flex-1 pt-24 pb-16 px-4 md:px-8">
                <article className="max-w-3xl mx-auto bg-white dark:bg-[#1a1a2e] rounded-2xl shadow-sm border border-[#dadae7] dark:border-gray-800 overflow-hidden">
                    {post.image && (
                        <div className={`w-full ${post.orientation === 'PORTRAIT' ? 'h-[500px] bg-slate-100 dark:bg-black/20' : 'h-[300px] md:h-[400px] relative bg-gray-100 dark:bg-black/20'}`}>
                            <img
                                src={post.image}
                                alt={post.title}
                                className={`w-full h-full ${post.orientation === 'PORTRAIT' ? 'object-contain' : 'object-cover'}`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 md:left-10 right-6">
                                <div className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-md border border-green-500/30 text-green-400 px-3 py-1 rounded-full mb-3">
                                    <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse"></span>
                                    <span className="text-xs font-bold uppercase tracking-wider">Announcement</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="p-6 md:p-10">
                        {!post.image && (
                            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 px-3 py-1 rounded-full mb-6">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-xs font-bold uppercase tracking-wider">Announcement</span>
                            </div>
                        )}

                        <h1 className="text-3xl md:text-4xl font-bold text-[#101018] dark:text-white mb-4 leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex items-center gap-4 text-sm text-[#5e5f8d] dark:text-gray-400 mb-8 border-b border-[#dadae7] dark:border-gray-800 pb-8">
                            <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                                <span>{new Date(post.createdAt).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</span>
                            </div>
                        </div>

                        <div className="prose prose-lg dark:prose-invert max-w-none text-[#5e5f8d] dark:text-gray-300">
                            {/* Simple line break handling since rich text isn't implemented yet */}
                            {post.content?.split('\n').map((paragraph, idx) => {
                                // Regex to find URLs
                                const urlRegex = /(https?:\/\/[^\s]+)/g;
                                const parts = paragraph.split(urlRegex);

                                return (
                                    <p key={idx} className="mb-4 leading-relaxed">
                                        {parts.map((part, i) => {
                                            if (part.match(urlRegex)) {
                                                return (
                                                    <a
                                                        key={i}
                                                        href={part}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary hover:underline break-words"
                                                    >
                                                        {part}
                                                    </a>
                                                );
                                            }
                                            return part;
                                        })}
                                    </p>
                                );
                            })}
                        </div>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
}
