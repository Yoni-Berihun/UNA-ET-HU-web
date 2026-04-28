"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

// --- Components ---

interface GalleryImage {
    id: string;
    url: string;
    caption: string | null;
    width: number;
    height: number;
    category: string | null;
    eventDate?: string | null;
    createdAt: string;
}

function GalleryHeader({
    categories,
    activeCategory,
    setActiveCategory,
}: {
    categories: string[];
    activeCategory: string;
    setActiveCategory: (c: string) => void;
}) {
    return (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                            Community <span className="text-primary italic font-serif">Yearbook</span>
                        </h1>
                        <p className="mt-4 text-lg text-muted-foreground">
                            A visual journey through our {"chapter's"} impact. From diplomatic debates to
                            community grassroots movements, this is the story of our collective action.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === category
                                    ? "bg-primary text-primary-foreground text-white"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80 bg-gray-100 dark:bg-gray-800"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
function GalleryGrid({ activeCategory, images }: { activeCategory: string, images: GalleryImage[] }) {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const filteredImages = activeCategory === "All"
        ? images
        : images.filter(img => img.category === activeCategory);

    const getHeightClass = (img: GalleryImage) => {
        const w = img.width || 1;
        const h = img.height || 1;
        const ratio = h / w;
        if (ratio >= 1.25) return 'h-96';
        if (ratio >= 0.9) return 'h-72';
        return 'h-48';
    };

    return (
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Masonry Grid */}
                <div className="columns-2 md:columns-3 gap-4 space-y-4">
                    {filteredImages.map((image) => (
                        <div
                            key={image.id}
                            className="break-inside-avoid relative group overflow-hidden rounded-xl"
                        >
                            <div
                                className={`relative ${getHeightClass(image)}`}
                            >
                                <Image
                                    src={image.url || "/placeholder.svg"}
                                    alt={image.caption || "Gallery image"}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    onError={(e) => {
                                        const img = e.currentTarget as unknown as HTMLImageElement;
                                        img.src = "/placeholder.svg";
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex items-end justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-white text-sm font-semibold line-clamp-1">
                                                {image.caption || 'Untitled'}
                                            </p>
                                            <p className="text-white/80 text-xs">
                                                {new Date(image.eventDate || image.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <a
                                            href={`/api/gallery/download?url=${encodeURIComponent(image.url)}&filename=${encodeURIComponent(image.caption || "gallery-image")}`}
                                            className="shrink-0 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 text-xs font-semibold text-white transition-colors"
                                        >
                                            Download
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More */}
                <div className="flex justify-center mt-12">
                    <Button variant="outline" className="gap-2 bg-transparent text-black dark:text-white border-black/20 dark:border-white/20">
                        <ChevronDown className="h-4 w-4" />
                        Show More Activities
                    </Button>
                </div>

                {/* Scroll to Top */}
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 p-3 bg-primary text-primary-foreground text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors z-50"
                    aria-label="Scroll to top"
                >
                    <ArrowUp className="h-5 w-5" />
                </button>
            </div>
        </section>
    );
}

// --- Main Page Component ---

export default function GalleryPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/gallery');
                if (!res.ok) throw new Error('Failed to load gallery');
                const data = await res.json();
                if (isMounted) setImages(data);
            } catch (e) {
                console.error(e);
                if (isMounted) setImages([]);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        load();
        return () => { isMounted = false; };
    }, []);

    const categories = useMemo(() => {
        const set = new Set<string>();
        for (const img of images) {
            if (img.category) set.add(img.category);
        }
        return ['All', ...Array.from(set)];
    }, [images]);

    return (
        <>
            <Navigation />
            <main>
                <GalleryHeader categories={categories} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

                {loading ? (
                    <section className="pb-20 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-7xl mx-auto text-center text-muted-foreground">Loading...</div>
                    </section>
                ) : (
                    <GalleryGrid activeCategory={activeCategory} images={images} />
                )}
            </main>
            <Footer />
        </>
    );
}
