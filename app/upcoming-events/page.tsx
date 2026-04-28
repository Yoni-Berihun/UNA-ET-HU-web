import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function UpcomingEventsPage() {
  const events = await prisma.conference.findMany({
    where: { status: 'UPCOMING' },
    orderBy: { date: 'asc' },
  });

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white dark:bg-slate-950">
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              Upcoming Events
            </h1>
            <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl">
              Join our next activities and workshops.
            </p>
            <div className="mt-6">
              <Link
                href="/annual-reports"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                See annual reports
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/20">
          <div className="max-w-7xl mx-auto">
            {events.length === 0 ? (
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-8 text-center text-slate-600 dark:text-slate-400">
                No upcoming events yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map((event) => (
                  <article
                    key={event.id}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 overflow-hidden shadow-sm"
                  >
                    {event.image ? (
                      <div className="h-44 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                      </div>
                    ) : null}

                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h2 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-2">
                            {event.title}
                          </h2>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {new Date(event.date).toLocaleString()}
                            {event.location ? ` • ${event.location}` : ''}
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-slate-400">event</span>
                      </div>

                      <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 line-clamp-4">
                        {event.description}
                      </p>

                      {(event as any).applyLink ? (
                        <div className="mt-5">
                          <a
                            href={(event as any).applyLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary/90"
                          >
                            Apply now
                          </a>
                        </div>
                      ) : null}
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
