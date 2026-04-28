'use client';

import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { useEffect, useState, use } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type PostDetail = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string;
  featuredImage: string | null;
  orientation?: string;
  publishedAt: string | null;
  author: {
    id: string;
    name: string;
    avatar: string | null;
  };
  likesCount: number;
  likedByUser: boolean;
  comments: Array<{
    id: string;
    content: string;
    createdAt: string;
    author: {
      id: string;
      name: string;
      avatar: string | null;
    };
    likesCount: number;
    likedByUser: boolean;
    replies: Array<{
      id: string;
      content: string;
      createdAt: string;
      author: {
        id: string;
        name: string;
        avatar: string | null;
      };
      likesCount: number;
      likedByUser: boolean;
    }>;
  }>;
};

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { data: session } = useSession();

  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPost() {
      try {
        setLoading(true);
        const res = await fetch(`/api/posts/by-slug/${slug}`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          if (res.status === 404) {
            router.replace('/blog');
            return;
          }
          throw new Error('Failed to load article');
        }
        const data: PostDetail = await res.json();
        setPost(data);
      } catch (error) {
        if ((error as any).name !== 'AbortError') {
          console.error(error);
          toast.error('Failed to load article');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
    return () => controller.abort();
  }, [slug, router]);

  const handleToggleLike = async () => {
    if (!post || likeLoading) return;
    if (!session?.user) {
      toast.error('Please sign in to like this article');
      return;
    }

    setLikeLoading(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/like`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to update like');
      const data = await res.json();
      setPost({
        ...post,
        likedByUser: data.liked,
        likesCount: data.likesCount,
      });
    } catch (error) {
      console.error(error);
      toast.error('Could not update like');
    } finally {
      setLikeLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !commentContent.trim() || commentLoading) return;
    if (!session?.user) {
      toast.error('Please sign in to comment');
      return;
    }

    setCommentLoading(true);
    const pending = toast.loading('Posting comment...');
    try {
      const res = await fetch(`/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentContent }), // No parentId for top-level
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to post comment');
      }
      setPost({
        ...post,
        comments: [data, ...post.comments], // Prepend new comment
      });
      setCommentContent('');
      toast.success('Comment posted', { id: pending });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to post comment', { id: pending });
    } finally {
      setCommentLoading(false);
    }
  };

  const handleReplySubmit = async (parentId: string) => {
    if (!post || !replyContent.trim() || replyLoading) return;
    if (!session?.user) {
      toast.error('Please sign in to reply');
      return;
    }

    setReplyLoading(true);
    const pending = toast.loading('Posting reply...');
    try {
      const res = await fetch(`/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyContent, parentId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to post reply');

      // Update post state with new reply
      const updatedComments = post.comments.map(c => {
        if (c.id === parentId) {
          return { ...c, replies: [...(c.replies || []), data] };
        }
        return c;
      });

      setPost({ ...post, comments: updatedComments });
      setReplyContent('');
      setReplyingTo(null);
      toast.success('Reply posted', { id: pending });
    } catch (error: any) {
      toast.error(error.message, { id: pending });
    } finally {
      setReplyLoading(false);
    }
  };

  const handleLikeComment = async (commentId: string, isReply = false, parentId?: string) => {
    if (!post || !session?.user) {
      toast.error('Please sign in to like comments');
      return;
    }

    // Optimistic update
    const updateLikeState = (comments: any[]): any[] => {
      return comments.map(c => {
        if (c.id === commentId) {
          return {
            ...c,
            likedByUser: !c.likedByUser,
            likesCount: c.likedByUser ? c.likesCount - 1 : c.likesCount + 1
          };
        }
        if (c.replies) {
          return { ...c, replies: updateLikeState(c.replies) };
        }
        return c;
      });
    };

    setPost({ ...post, comments: updateLikeState(post.comments) });

    try {
      const res = await fetch(`/api/comments/${commentId}/like`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to like comment');
      const data = await res.json();

      // Re-sync with server state to be sure
      const syncLikeState = (comments: any[]): any[] => {
        return comments.map(c => {
          if (c.id === commentId) {
            return {
              ...c,
              likedByUser: data.liked,
              likesCount: data.likesCount
            };
          }
          if (c.replies) {
            return { ...c, replies: syncLikeState(c.replies) };
          }
          return c;
        });
      };
      setPost(prev => prev ? ({ ...prev, comments: syncLikeState(prev.comments) }) : null);

    } catch (error) {
      console.error(error);
      toast.error('Failed to like comment');
      // Revert optimistic update (simplified by just refetching or ignoring for now)
    }
  };

  if (loading || !post) {
    return (
      <>
        <Navigation />
        <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString()
    : null;

  const likeLabel = post.likesCount === 1 ? 'like' : 'likes';

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white dark:bg-[#0b1220]">
        {/* Breadcrumb */}
        <div className="max-w-[1200px] mx-auto px-6 pt-8">
          <nav className="text-sm text-slate-500 dark:text-slate-400">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/blog" className="hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>

              {post?.category && (
                <>
                  <li className="select-none">/</li>
                  <li>
                    <Link
                      href={`/blog?category=${encodeURIComponent(post.category)}`}
                      className="hover:text-primary transition-colors"
                    >
                      {post.category}
                    </Link>
                  </li>
                </>
              )}

              {post?.title && (
                <>
                  <li className="select-none">/</li>
                  <li className="text-slate-700 dark:text-slate-200 line-clamp-1">
                    {post.title}
                  </li>
                </>
              )}
            </ol>
          </nav>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Article Content (8 cols) */}
            <article className="lg:col-span-8 flex flex-col">
              {/* Header Content */}
              <header className="mb-10">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#26282b] dark:text-white leading-[1.15] mb-6 tracking-tight">
                  {post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-y-4 gap-x-6 text-sm text-[#5e7d8d] border-b border-gray-100 dark:border-gray-800 pb-6">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-gray-800 bg-cover bg-center bg-gray-300"
                      style={{
                        backgroundImage: `url("${post.author.avatar ||
                          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
                          }")`,
                      }}
                    />
                    <span className="font-semibold text-[#26282b] dark:text-gray-200">
                      {post.author.name}
                    </span>
                  </div>
                  {publishedDate && (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">
                        calendar_today
                      </span>
                      <span>{publishedDate}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-4 ml-auto">
                    <button
                      onClick={handleToggleLike}
                      disabled={likeLoading}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${post.likedByUser
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {post.likedByUser ? 'favorite' : 'favorite'}
                      </span>
                      {post.likesCount} {likeLabel}
                    </button>
                  </div>
                </div>
              </header>

              {/* Featured Image */}
              {post.featuredImage && (
                <div className={`relative w-full ${post.orientation === 'PORTRAIT' ? 'aspect-[3/4] max-w-2xl mx-auto' : 'aspect-[16/9]'} mb-12 rounded-2xl overflow-hidden shadow-sm group`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 opacity-60" />
                  <div
                    className={`w-full h-full ${post.orientation === 'PORTRAIT' ? 'object-contain bg-slate-100 dark:bg-slate-900' : 'object-cover'} transition-transform duration-700 group-hover:scale-105 bg-cover bg-center`}
                    style={{
                      backgroundImage: `url("${post.featuredImage}")`,
                    }}
                  />
                </div>
              )}

              {/* Article Body */}
              <div className="prose prose-lg prose-slate dark:prose-invert max-w-none text-[#26282b] dark:text-gray-300 font-display">
                {post.excerpt && (
                  <p className="lead text-xl md:text-2xl leading-relaxed text-gray-600 dark:text-gray-300 font-medium mb-8">
                    {post.excerpt}
                  </p>
                )}
                <div
                  className="space-y-4 leading-loose"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>

              {/* Comments Section */}
              <section
                className="mt-16 pt-10 border-t border-gray-100 dark:border-gray-800 scroll-mt-24"
                id="comments"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    Discussion{' '}
                    <span className="bg-primary/10 text-primary text-sm px-2 py-1 rounded-md font-bold">
                      {post.comments.length}
                    </span>
                  </h3>
                  {session?.user ? (
                    <span className="text-xs text-[#5e7d8d] bg-[#f7f8f9] dark:bg-[#2a2d31] px-3 py-1 rounded-full flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      Logged in as {session.user.name}
                    </span>
                  ) : (
                    <Link
                      href="/auth/signin"
                      className="text-xs text-primary font-semibold hover:underline"
                    >
                      Sign in to join the discussion
                    </Link>
                  )}
                </div>

                {/* Comment Input */}
                <div className="bg-[#f7f8f9] dark:bg-[#2a2d31] p-6 rounded-xl mb-10 border border-transparent focus-within:border-primary/30 focus-within:ring-4 focus-within:ring-primary/5 transition-all">
                  <label htmlFor="comment" className="sr-only">
                    Leave a comment
                  </label>
                  <textarea
                    id="comment"
                    placeholder={
                      session?.user
                        ? 'Share your thoughts...'
                        : 'Sign in to leave a comment'
                    }
                    rows={3}
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    disabled={!session?.user || commentLoading}
                    className="w-full bg-white dark:bg-gray-800 border-0 rounded-lg p-4 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-0 resize-none text-base shadow-sm outline-none disabled:opacity-60"
                  />
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-xs text-[#5e7d8d]">
                      Be respectful and stay on topic.
                    </p>
                    <button
                      onClick={handleSubmitComment}
                      disabled={!session?.user || commentLoading || !commentContent.trim()}
                      className="bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-primary/20 transition-all hover:translate-y-[-1px] disabled:cursor-not-allowed"
                    >
                      {commentLoading ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </div>

                {/* Comment Thread */}
                <div className="space-y-8">
                  {post.comments.map((comment) => (
                    <div className="flex gap-4" key={comment.id}>
                      <div className="flex-shrink-0">
                        <div
                          className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 shadow-sm bg-cover bg-center bg-gray-300"
                          style={{
                            backgroundImage: `url("${comment.author.avatar ||
                              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
                              }")`,
                          }}
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="bg-white dark:bg-[#2a2d31] border border-gray-100 dark:border-gray-700 rounded-xl rounded-tl-none p-5 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="font-bold text-gray-900 dark:text-white">
                                {comment.author.name}
                              </span>
                              <span className="text-xs text-[#5e7d8d] ml-2">
                                {new Date(comment.createdAt).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
                            {comment.content}
                          </p>

                          {/* Comment Actions */}
                          <div className="flex items-center gap-4 text-xs font-semibold text-[#5e7d8d]">
                            <button
                              onClick={() => handleLikeComment(comment.id)}
                              className={`flex items-center gap-1 hover:text-primary transition-colors ${comment.likedByUser ? 'text-primary' : ''}`}
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                {comment.likedByUser ? 'favorite' : 'favorite'}
                              </span>
                              {comment.likesCount > 0 && <span>{comment.likesCount}</span>}
                              Like
                            </button>
                            <button
                              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                              className="flex items-center gap-1 hover:text-primary transition-colors"
                            >
                              <span className="material-symbols-outlined text-[16px]">reply</span>
                              Reply
                            </button>
                          </div>
                        </div>

                        {/* Reply Input */}
                        {replyingTo === comment.id && (
                          <div className="mt-4 ml-2 animate-in fade-in slide-in-from-top-2">
                            <textarea
                              placeholder="Write a reply..."
                              rows={2}
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              className="w-full bg-gray-50 dark:bg-gray-800 border-0 rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary mb-2"
                              autoFocus
                            />
                            <div className="flex items-center gap-2 justify-end">
                              <button
                                onClick={() => setReplyingTo(null)}
                                className="text-xs font-bold text-gray-500 hover:text-gray-700"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleReplySubmit(comment.id)}
                                disabled={replyLoading || !replyContent.trim()}
                                className="bg-primary text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-primary/90 disabled:opacity-50"
                              >
                                {replyLoading ? 'Replying...' : 'Reply'}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Nested Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-100 dark:border-gray-800 relative">
                            {comment.replies.map((reply) => (
                              <div className="flex gap-3" key={reply.id}>
                                <div className="w-8 h-8 rounded-full bg-cover bg-center bg-gray-300 flex-shrink-0"
                                  style={{ backgroundImage: `url("${reply.author.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'}")` }}
                                />
                                <div className="flex-grow bg-gray-50 dark:bg-[#202225] rounded-xl rounded-tl-none p-4">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-sm">{reply.author.name}</span>
                                    <span className="text-xs text-gray-400">{new Date(reply.createdAt).toLocaleDateString()}</span>
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{reply.content}</p>
                                  <button
                                    onClick={() => handleLikeComment(reply.id, true)}
                                    className={`flex items-center gap-1 text-xs font-semibold hover:text-primary transition-colors ${reply.likedByUser ? 'text-primary' : 'text-gray-500'}`}
                                  >
                                    <span className="material-symbols-outlined text-[14px]">
                                      {reply.likedByUser ? 'favorite' : 'favorite'}
                                    </span>
                                    {reply.likesCount > 0 && <span>{reply.likesCount}</span>}
                                    Like
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {post.comments.length === 0 && (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      No comments yet. Be the first to share your thoughts.
                    </p>
                  )}
                </div>
              </section>
            </article>

            {/* Right Column: Sidebar (4 cols) */}
            <aside className="lg:col-span-4 space-y-8 relative">
              <div className="sticky top-24 space-y-8">
                {/* Newsletter Mini */}
                <div className="bg-primary text-white rounded-xl p-6 text-center shadow-lg relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                  <div className="relative z-10">
                    <span className="material-symbols-outlined text-[32px] mb-2">mail</span>
                    <h3 className="font-bold text-lg mb-2">Stay Updated</h3>
                    <p className="text-sm text-blue-100 mb-4 leading-tight">
                      Join our community for the latest updates on UNA-ET-HU activities.
                    </p>
                    <button className="w-full py-2 bg-white text-primary font-bold rounded-lg hover:bg-blue-50 transition-colors text-sm">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}