'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentYear = new Date().getFullYear();

  const onSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    const loadingToast = toast.loading('Subscribing...');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || 'Failed to subscribe', { id: loadingToast });
        return;
      }

      toast.success('Subscribed successfully!', { id: loadingToast });
      setEmail('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to subscribe', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-slate-900 border-t border-white/10 text-slate-200 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-24 h-24 md:w-40 md:h-40 flex items-center justify-center">
                <Image src="/UN_white_logo.svg" alt="UNA-ET-HU Logo" fill className="object-contain" />
              </div>
              <h1 className="text-l font-bold tracking-tight text-white uppercase">UNA-ET-HU</h1>
            </div>
            <p className="text-sm leading-relaxed mb-6 text-slate-300">
              The United Nations Association of Ethiopia - Hawassa University Chapter
              is committed to mobilizing youth for sustainable development.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-primary transition-colors" aria-label="Social Media">
                <span className="material-symbols-outlined">social_leaderboard</span>
              </a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors" aria-label="Email">
                <span className="material-symbols-outlined">alternate_email</span>
              </a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors" aria-label="Website">
                <span className="material-symbols-outlined">language</span>
              </a>
            </div>
          </div>

          <div>
            <h5 className="text-white font-bold mb-6">Quick Links</h5>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/about" className="text-slate-300 hover:text-white transition-colors">
                  Our History
                </Link>
              </li>
              <li>
                <Link href="/teams" className="text-slate-300 hover:text-white transition-colors">
                  Executive Board
                </Link>
              </li>
              <li>
                <Link href="/annual-reports" className="text-slate-300 hover:text-white transition-colors">
                  Annual Reports
                </Link>
              </li>
              <li>
                <Link href="/upcoming-events" className="text-slate-300 hover:text-white transition-colors">
                  Upcoming Events
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold mb-6">Teams</h5>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/mun" className="text-slate-300 hover:text-white transition-colors">
                  Model United Nations
                </Link>
              </li>
              <li>
                <Link href="/sdg" className="text-slate-300 hover:text-white transition-colors">
                  SDG Hub
                </Link>
              </li>
              <li>
                <Link href="/innovation" className="text-slate-300 hover:text-white transition-colors">
                  Innovation Team
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-slate-300 hover:text-white transition-colors">
                  Projects Team
                </Link>
              </li>
              <li>
                <Link href="/debate" className="text-slate-300 hover:text-white transition-colors">
                  Debate Team
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold mb-6">Newsletter</h5>
            <p className="text-sm mb-4 text-slate-300">Stay updated on our latest diplomatic events and SDG workshops.</p>
            <form className="flex flex-col gap-2" onSubmit={onSubscribe}>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="bg-white/10 border border-white/20 rounded-lg text-sm px-4 py-2 text-white placeholder:text-slate-400 focus:ring-primary focus:border-primary outline-none"
              />
              <button
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className="bg-primary hover:bg-primary/90 text-white text-sm font-bold py-2 rounded-lg transition-colors"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© {currentYear} United Nations Association Ethiopia - HU Chapter. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-end gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-white transition-colors">Contact Us</a>
            <Link
              href="/developers"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm shadow-primary/20 hover:bg-primary/90 transition-colors"
            >
              Developers
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}