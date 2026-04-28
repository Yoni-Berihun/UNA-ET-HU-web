import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type Developer = {
  id: string;
  fullName: string;
  title: string;
  mobile: string;
  email: string;
  image: string | null;
  linkedinUsername: string | null;
  instagramUsername: string | null;
  telegramUsername: string | null;
  order: number;
};

function normalizeHandle(handle: string | null) {
  if (!handle) return null;
  const trimmed = handle.trim().replace(/^@+/, '');
  return trimmed || null;
}

function socialUrl(platform: 'linkedin' | 'instagram' | 'telegram', handle: string | null) {
  const normalized = normalizeHandle(handle);
  if (!normalized) return null;

  if (platform === 'linkedin') return `https://www.linkedin.com/in/${normalized}`;
  if (platform === 'instagram') return `https://www.instagram.com/${normalized}`;
  return `https://t.me/${normalized}`;
}

async function ensureDeveloperTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "developers" (
      "id" TEXT PRIMARY KEY,
      "full_name" TEXT NOT NULL,
      "title" TEXT NOT NULL,
      "mobile" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "image" TEXT,
      "linkedin_username" TEXT,
      "instagram_username" TEXT,
      "telegram_username" TEXT,
      "order" INTEGER NOT NULL DEFAULT 0,
      "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

export default async function DevelopersPage() {
  let developers: Developer[] = [];
  let loadError = false;

  try {
    await ensureDeveloperTable();

    developers = await prisma.developer.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    });
  } catch (error) {
    loadError = true;
    console.error('Failed to load developers:', error);
  }

  return (
    <div className="min-h-screen bg-[#eef3f9] dark:bg-[#0f1220] flex flex-col">
      <Navigation />

      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
          <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mb-3">
            <span className="font-semibold text-[#101018] dark:text-white text-lg">About</span>
            <span>|</span>
            <span>About developers</span>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {loadError ? (
              <div className="col-span-full rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/20 p-10 text-center text-amber-800 dark:text-amber-200 shadow-sm">
                Developer profiles are temporarily unavailable.
                <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                  The content source could not be loaded right now.
                </div>
              </div>
            ) : developers.length === 0 ? (
              <div className="col-span-full rounded-xl border border-[#dadae7] dark:border-gray-700 bg-white dark:bg-[#1a1a2e] p-10 text-center text-[#5e5f8d] dark:text-gray-400 shadow-sm">
                No developers have been added yet.
              </div>
            ) : (
              developers.map((developer: Developer) => (
                <article
                  key={developer.id}
                  className="relative rounded-lg border border-[#dadae7] dark:border-gray-700 bg-white dark:bg-[#1a1a2e] shadow-sm overflow-hidden"
                >
                  <div className="h-[3px] bg-sky-500" />
                  <div className="px-5 pt-6 pb-5 flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-900 border-4 border-slate-100 dark:border-slate-800 shadow-sm -mt-10">
                      {developer.image ? (
                        <img src={developer.image} alt={developer.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary text-white text-2xl font-bold">
                          {developer.fullName
                            .split(' ')
                            .filter(Boolean)
                            .map((part) => part[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                      )}
                    </div>

                    <h2 className="mt-5 text-[28px] leading-tight font-bold text-[#101018] dark:text-white">
                      {developer.fullName}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      {developer.title}
                    </p>

                    <div className="w-full mt-6 pt-4 border-t border-[#dadae7] dark:border-gray-800 space-y-3 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-[#101018] dark:text-white">Mobile:</span>
                        <a href={`tel:${developer.mobile}`} className="text-sky-600 dark:text-sky-400 hover:underline text-right break-all">
                          {developer.mobile}
                        </a>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-[#101018] dark:text-white">Email:</span>
                        <a href={`mailto:${developer.email}`} className="text-sky-600 dark:text-sky-400 hover:underline text-right break-all">
                          {developer.email}
                        </a>
                      </div>
                    </div>

                    <div className="w-full mt-5 flex items-center justify-end gap-2">
                      {socialUrl('linkedin', developer.linkedinUsername) && (
                        <a
                          href={socialUrl('linkedin', developer.linkedinUsername) || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-full px-3 py-2 text-xs font-semibold text-white bg-[#0a66c2] hover:bg-[#084d92] transition-colors"
                        >
                          LinkedIn
                        </a>
                      )}
                      {socialUrl('instagram', developer.instagramUsername) && (
                        <a
                          href={socialUrl('instagram', developer.instagramUsername) || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-full px-3 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] hover:opacity-90 transition-opacity"
                        >
                          Instagram
                        </a>
                      )}
                      {socialUrl('telegram', developer.telegramUsername) && (
                        <a
                          href={socialUrl('telegram', developer.telegramUsername) || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-full px-3 py-2 text-xs font-semibold text-white bg-[#229ED9] hover:bg-[#1b85ba] transition-colors"
                        >
                          Telegram
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}