
import { PrismaClient } from '@prisma/client';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const revalidate = 0; // Disable caching to see updates immediately

export default async function MagazinePage() {
    const magazines = await prisma.magazine.findMany({
        orderBy: {
            publishedAt: 'desc',
        },
    });

    return (
        <div className="flex flex-col min-h-screen bg-[#f5f5f8] dark:bg-[#0f0f23]">
            <Navigation />

            <main className="flex-1 flex flex-col items-center py-12 px-2 md:px-4">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-5xl font-black text-[#101618] dark:text-white mb-4">
                        Magazine Issues
                    </h1>
                    <p className="text-[#5e5f8d] dark:text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
                        Explore our collection of digital magazines and publications for UNA-ET-HU.
                    </p>
                </div>

                <div className="w-full max-w-[1400px]">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
                        {magazines.length === 0 ? (
                            <div className="col-span-full py-20 text-center text-[#5e5f8d] dark:text-gray-400 bg-white dark:bg-[#1a1d23] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                                <span className="material-symbols-outlined text-4xl mb-4 opacity-50">menu_book</span>
                                <p>No magazines have been published yet.</p>
                            </div>
                        ) : (
                            magazines.map((magazine) => (
                                <div
                                    key={magazine.id}
                                    className="group flex flex-col bg-white dark:bg-[#1a1d23] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-800 h-full"
                                >
                                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 dark:bg-black/20">
                                        {magazine.coverImage ? (
                                            <img
                                                src={magazine.coverImage}
                                                alt={magazine.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-full text-gray-300 dark:text-gray-600">
                                                <span className="material-symbols-outlined text-[48px]">menu_book</span>
                                            </div>
                                        )}
                                        {/* Overlay with primary action */}
                                        <Link
                                            href={`/magazine/${magazine.id}`}
                                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                                        >
                                            <span className="bg-white/90 dark:bg-black/80 text-black dark:text-white px-4 py-2 rounded-full text-xs font-bold transform scale-90 group-hover:scale-100 transition-transform">
                                                Read Now
                                            </span>
                                        </Link>
                                    </div>

                                    <div className="p-3 flex flex-col flex-1">
                                        <div className="text-[10px] font-semibold tracking-wider text-primary mb-1 uppercase">
                                            {new Date(magazine.publishedAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                            })}
                                        </div>
                                        <h3 className="text-sm md:text-base font-bold text-[#101018] dark:text-white mb-2 line-clamp-2 leading-tight">
                                            {magazine.title}
                                        </h3>

                                        <div className="mt-auto pt-2 grid grid-cols-2 gap-2">
                                            <Link
                                                href={`/magazine/${magazine.id}`}
                                                className="flex items-center justify-center gap-1 bg-primary/10 hover:bg-primary/20 text-primary text-[10px] md:text-xs font-medium py-1.5 px-2 rounded-md transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-[14px]">auto_stories</span>
                                                Flipbook
                                            </Link>

                                            {magazine.pdfUrl ? (
                                                <a
                                                    href={magazine.pdfUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-[10px] md:text-xs font-medium py-1.5 px-2 rounded-md transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[14px]">picture_as_pdf</span>
                                                    PDF
                                                </a>
                                            ) : (
                                                <button
                                                    disabled
                                                    className="flex items-center justify-center gap-1 bg-gray-50 dark:bg-gray-800/50 text-gray-400 text-[10px] md:text-xs font-medium py-1.5 px-2 rounded-md cursor-not-allowed"
                                                >
                                                    <span className="material-symbols-outlined text-[14px]">picture_as_pdf</span>
                                                    PDF
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
