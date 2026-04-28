

import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function MagazineViewerPage({ params }: PageProps) {
    const { id } = await params;

    // Fetch magazine immediately
    const magazine = await prisma.magazine.findUnique({
        where: { id },
    });

    if (!magazine) {
        notFound();
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#f5f5f8] dark:bg-[#0f0f23]">
            <Navigation />

            <main className="flex-1 flex flex-col py-8">
                {/* Header Section */}
                <div className="max-w-7xl mx-auto px-4 w-full mb-8">
                    <Link
                        href="/magazine"
                        className="inline-flex items-center text-sm font-medium text-[#5e5f8d] dark:text-gray-400 hover:text-primary transition-colors mb-6"
                    >
                        <span className="material-symbols-outlined text-[20px] mr-1">arrow_back</span>
                        Back to Magazines
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-[#101618] dark:text-white mb-2">
                                {magazine.title}
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-[#5e5f8d] dark:text-gray-400">
                                <span>Published: {new Date(magazine.publishedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reader Section */}
                <div className="flex-1 w-full bg-white dark:bg-[#1a1d23] border-y border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="max-w-7xl mx-auto w-full h-[800px] p-4 flex justify-center">
                        <div
                            className="w-full h-full rounded-xl overflow-hidden shadow-2xl bg-gray-100 dark:bg-black/20"
                            dangerouslySetInnerHTML={{ __html: magazine.embedCode }}
                        />
                    </div>
                </div>

                {/* Description or Comments could go here */}
                {magazine.description && (
                    <div className="max-w-3xl mx-auto px-4 py-12 text-center">
                        <p className="text-lg text-[#5e5f8d] dark:text-gray-300 leading-relaxed">
                            {magazine.description}
                        </p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
