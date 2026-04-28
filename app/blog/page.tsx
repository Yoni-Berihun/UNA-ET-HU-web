'use client';

import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Link from 'next/link';
import { useEffect, useMemo, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

type PostListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  featuredImage: string | null;
  author: string;
  date: string | null;
  likes: number;
  comments: number;
  orientation?: string;
};

type PostsResponse = {
  items: PostListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const PAGE_SIZE = 4;

function BlogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [postsData, setPostsData] = useState<PostsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEmpty, setShowEmpty] = useState(false);

  // Single source of truth: URL query params
  const search = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'all';
  const page = parseInt(searchParams.get('page') || '1', 10) || 1;

  // Available categories (could also be fetched dynamically)
  const categories = useMemo(
    () => [
      { id: 'all', label: 'All' },
      { id: 'Diplomacy', label: 'Diplomacy' },
      { id: 'SDG', label: 'SDG Goals' },
      { id: 'Climate Action', label: 'Climate Action' },
      { id: 'Youth & Education', label: 'Youth & Education' },
    ],
    [],
  );

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPosts() {
      try {
        // Keep showing previous items while fetching new ones to avoid a misleading empty state flash
        setLoading(true);
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('pageSize', String(PAGE_SIZE));
        if (search) params.set('search', search);
        if (category && category !== 'all') params.set('category', category);

        const res = await fetch(`/api/posts?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data: PostsResponse = await res.json();
        setPostsData(data);
        setShowEmpty(data.total === 0);
      } catch (error) {
        if ((error as any).name !== 'AbortError') {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
    return () => controller.abort();
  }, [search, category, page]);

  const handleCategoryClick = (id: string) => {
    const qp = new URLSearchParams(searchParams);
    if (id && id !== 'all') qp.set('category', id);
    else qp.delete('category');
    qp.delete('page');
    router.push(qp.toString() ? `/blog?${qp.toString()}` : '/blog');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qp = new URLSearchParams(searchParams);
    qp.delete('page');
    router.push(qp.toString() ? `/blog?${qp.toString()}` : '/blog');
  };

  const handleSearchChange = (value: string) => {
    const qp = new URLSearchParams(searchParams);
    if (value) qp.set('q', value);
    else qp.delete('q');
    qp.delete('page');
    router.push(qp.toString() ? `/blog?${qp.toString()}` : '/blog');
  };

  const totalPages = postsData?.totalPages ?? 1;
  const items = postsData?.items ?? [];
  const featured = items[0];
  const rest = items.slice(1);

  return (
    <>
      <Navigation />
      <main className="max-w-[1200px] mx-auto px-6 py-10">
        {/* Search & Filter Bar */}
        <div className="mb-10 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight dark:text-white leading-[1.1]">
              The Journal
            </h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl">
              In-depth analysis on sustainability, diplomacy, and the evolving landscape of
              global policy from UNA-ET-HU.
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    category === cat.id
                      ? 'bg-primary text-white'
                      : 'bg-[#f7f9fb] dark:bg-[#2d3238] hover:bg-gray-200 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="w-full md:w-auto md:min-w-[260px]">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search articles, topics, keywords..."
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/60"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Loading / Empty state */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          </div>
        )}

        {showEmpty && (
          <div className="py-16 text-center text-slate-500 dark:text-slate-400">
            <p className="text-lg font-semibold mb-2">No articles found</p>
            <p className="text-sm">
              Try adjusting your search keywords or selecting a different category.
            </p>
          </div>
        )}

        {!loading && items.length > 0 && (
          <>
            {/* Featured Card */}
            {featured && (
              <section className="mb-12">
                <Link
                  href={`/blog/${featured.slug}`}
                  className={`group block relative bg-[#f7f9fb] dark:bg-[#2d3238] rounded-xl overflow-hidden shadow-sm flex flex-col ${
                    featured.orientation === 'PORTRAIT' ? 'lg:flex-row-reverse' : 'lg:flex-row'
                  } min-h-[420px] hover:shadow-xl transition-shadow`}
                >
                  <div className={`lg:w-3/5 relative overflow-hidden ${featured.orientation === 'PORTRAIT' ? 'aspect-square lg:h-auto lg:w-1/3' : ''}`}>
                    <div className="absolute inset-0 bg-primary/10 mix-blend-multiply transition-opacity group-hover:opacity-0" />
                    <div
                      className={`w-full h-full bg-center ${featured.orientation === 'PORTRAIT' ? 'bg-contain bg-no-repeat bg-slate-100 dark:bg-slate-900' : 'bg-cover'} transition-transform duration-700 group-hover:scale-105`}
                      style={{
                        backgroundImage: `url("${featured.featuredImage ||
                          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop'
                          }")`,
                      }}
                    />
                  </div>
                  <div className="lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider rounded">
                        {featured.category}
                      </span>
                      {featured.date && (
                        <span className="text-gray-400 dark:text-gray-500 text-xs font-medium">
                          {featured.date}
                        </span>
                      )}
                    </div>
                    <h2 className="text-3xl font-extrabold leading-tight mb-4 group-hover:text-primary transition-colors dark:text-white">
                      {featured.title}
                    </h2>
                    {featured.excerpt && (
                      <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed line-clamp-3 md:line-clamp-4 lg:line-clamp-6">
                        {featured.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="text-xs uppercase tracking-[0.16em] text-slate-400">
                          Author
                        </span>
                        <span className="text-sm font-bold dark:text-white">
                          {featured.author}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-base">
                            favorite
                          </span>
                          {featured.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-base">
                            chat_bubble
                          </span>
                          {featured.comments}
                        </span>
                        <span className="flex items-center gap-1 text-primary font-semibold">
                          Read article
                          <span className="material-symbols-outlined text-base">
                            arrow_forward
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </section>
            )}

            {/* Grid of remaining posts */}
            {rest.length > 0 && (
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group bg-white dark:bg-[#2d3238] rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col hover:shadow-xl transition-shadow"
                  >
                    <div
                      className={`w-full ${post.orientation === 'PORTRAIT' ? 'aspect-square bg-contain bg-no-repeat bg-slate-100 dark:bg-slate-900' : 'aspect-video bg-cover'
                        } bg-center group-hover:scale-[1.03] transition-transform duration-500`}
                      style={{
                        backgroundImage: `url("${post.featuredImage ||
                          'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop'
                          }")`,
                      }}
                    />
                    <div className="p-6 flex flex-col grow">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-primary text-[10px] font-bold uppercase tracking-widest">
                          {post.category}
                        </span>
                        {post.date && (
                          <>
                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                            <span className="text-gray-400 text-xs">{post.date}</span>
                          </>
                        )}
                      </div>
                      <h3 className="text-xl font-bold mb-3 leading-snug dark:text-white line-clamp-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 md:line-clamp-4 lg:line-clamp-6 mb-4">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="mt-auto pt-4 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-700 dark:text-slate-200">
                            {post.author}
                          </span>
                          <span className="uppercase tracking-[0.18em] text-[10px]">
                            Read article
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[18px]">
                              favorite
                            </span>
                            {post.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[18px]">
                              chat_bubble
                            </span>
                            {post.comments}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </section>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-10 border-t border-slate-100 dark:border-slate-800 pt-6">
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Page <span className="font-semibold">{page}</span> of{' '}
                  <span className="font-semibold">{totalPages}</span> •{' '}
                  <span className="font-semibold">{postsData?.total ?? 0}</span> articles
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const qp = new URLSearchParams(searchParams);
                      const next = Math.max(1, page - 1);
                      if (next === 1) qp.delete('page');
                      else qp.set('page', String(next));
                      router.push(qp.toString() ? `/blog?${qp.toString()}` : '/blog');
                    }}
                    disabled={page === 1}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                    Prev
                  </button>
                  <button
                    onClick={() => {
                      const qp = new URLSearchParams(searchParams);
                      const next = Math.min(totalPages, page + 1);
                      if (next === 1) qp.delete('page');
                      else qp.set('page', String(next));
                      router.push(qp.toString() ? `/blog?${qp.toString()}` : '/blog');
                    }}
                    disabled={page === totalPages}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Next
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <BlogContent />
    </Suspense>
  );
}