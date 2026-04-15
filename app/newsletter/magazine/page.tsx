import Link from "next/link";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";

export default function NewsletterMagazinePage() {
  return (
    <div className="min-h-screen bg-[#f5f5f8] dark:bg-[#0f0f23] flex flex-col">
      <Navigation />

      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-4 py-16 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Newsletter
          </p>
          <h1 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight text-[#101618] dark:text-white">
            Magazine
          </h1>
          <p className="mt-5 text-[#5e5f8d] dark:text-gray-300 leading-relaxed">
            This page is the destination for the Magazine link in the NewsLetter menu.
            If you already publish issues under the main Magazine route, use the button
            below.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/magazine"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-[0_0_24px_rgba(0,163,255,0.25)] transition hover:bg-primary/90"
            >
              View Magazine Issues
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-xl bg-white/80 dark:bg-white/10 px-6 py-3 text-sm font-bold text-[#101618] dark:text-white border border-gray-200 dark:border-white/15 transition hover:bg-white dark:hover:bg-white/15"
            >
              Read the Blog
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

