import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function UpdatesPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white dark:bg-slate-950">
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              Updates
            </h1>
            <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl">
              Browse annual reports and upcoming events.
            </p>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/annual-reports"
              className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-8 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                    Annual Reports
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    Download and read our yearly progress and impact.
                  </p>
                </div>
                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
                  description
                </span>
              </div>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Open Annual Reports
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </div>
            </Link>

            <Link
              href="/upcoming-events"
              className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-8 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                    Upcoming Events
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    Join our next activities and workshops.
                  </p>
                </div>
                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
                  event
                </span>
              </div>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Open Upcoming Events
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </div>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
