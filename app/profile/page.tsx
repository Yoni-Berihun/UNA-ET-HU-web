import Navigation from '@/app/components/Navigation';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin?callbackUrl=/profile');
  }

  const role = session.user.role;
  const image = (session.user as any).image as string | null | undefined;

  return (
    <div className="min-h-screen bg-[#ffffff] dark:bg-[#21242c] flex flex-col">
      <Navigation />

      <main className="flex-1 flex flex-col items-center justify-start p-6">
        <div className="w-full max-w-[720px] mx-auto py-10">
          <h1 className="text-[#101618] dark:text-white text-2xl font-bold mb-6">
            My Profile
          </h1>

          <div className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1d23] w-full rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg shadow-md overflow-hidden">
                {image ? (
                  <img
                    src={image}
                    alt={session.user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getInitials(session.user.name)
                )}
              </div>

              <div className="min-w-0">
                <p className="text-[#101618] dark:text-white text-lg font-bold truncate">
                  {session.user.name}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm truncate">
                  {session.user.email}
                </p>
                <p className="mt-2 inline-flex items-center rounded-full bg-gray-100 dark:bg-[#2d3139] px-3 py-1 text-xs font-semibold text-[#101618] dark:text-white">
                  Role: {role}
                </p>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-100 dark:border-gray-800 pt-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You’re signed in. Use the menu in the top right to sign out.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
