import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AnnualReportsPage() {
  const reports = await prisma.annualReport.findMany({
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
  });

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white dark:bg-slate-950">
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              Annual Reports
            </h1>
            <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl">
              Download and read our yearly progress and impact.
            </p>
            <div className="mt-6">
              <Link
                href="/upcoming-events"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                See upcoming events
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {reports.length === 0 ? (
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-8 text-center text-slate-600 dark:text-slate-400">
                No reports yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((report) => (
                  <article
                    key={report.id}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-2">
                          {report.title}
                        </h2>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {report.year
                            ? `Year: ${report.year}`
                            : `Published: ${new Date(report.publishedAt).toLocaleDateString()}`}
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-slate-400">description</span>
                    </div>

                    {report.description && (
                      <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                        {report.description}
                      </p>
                    )}

                    <div className="mt-5 flex items-center justify-between">
                      <a
                        href={report.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                      >
                        View / Download
                        <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
