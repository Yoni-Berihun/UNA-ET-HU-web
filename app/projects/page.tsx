import Image from "next/image";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import Link from "next/link";

const teamHeadImage =
  "/images/proj.png";
const projectsHeadLinkedIn = "https://www.linkedin.com/in/kibreab-abera-dilamo-681a40315?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app";

const projectHeroImage =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80";

function ProjectHero() {
  return (
    <header className="relative flex min-h-[600px] w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${projectHeroImage}')` }}
        />
      </div>

      <div className="relative z-20 mx-auto flex max-w-7xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            Delivering real-world impact
          </span>
        </div>

        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:max-w-4xl">
          Project <br />
          <span className="bg-gradient-to-r from-primary to-white bg-clip-text text-transparent">
            Team
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-gray-200 sm:text-xl">
          Turning ideas into measurable initiatives through planning, partnerships, and accountable
          delivery.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-7 py-3 text-sm font-bold text-white shadow-[0_0_24px_rgba(0,163,255,0.35)] transition hover:bg-primary/90"
          >
            Join Project Team
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function ProjectTeamPage() {
  return (
    <>
      <Navigation />
      <main className="bg-[#0a1118] text-white">
        <ProjectHero />

        <section id="team" className="bg-[#0a1118] pb-16 pt-28 sm:pb-24 sm:pt-32">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid items-start gap-10 md:grid-cols-2 md:gap-12 lg:gap-14">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Delivery and implementation
                </p>
                <p className="mt-4 text-lg font-semibold text-white">Head of Project Team</p>
                <p className="mt-1 text-base text-slate-400">Kibreab Abera</p>

                <div className="mt-8 space-y-4 text-justify text-[15px] leading-relaxed text-slate-300 sm:text-base">
                  <p>
                    The Project Team transforms policy ideas into practical action programs.
                    We plan initiatives that are realistic, measurable, and aligned with UN
                    Charter values and community priorities.
                  </p>
                  <p>
                    Our workflow combines design sprints, partnership mapping, and evidence
                    tracking to ensure every project can be implemented and sustained. From
                    pilot to rollout, we focus on responsible delivery.
                  </p>
                </div>
              </div>

              <div className="flex justify-center md:sticky md:top-24 md:justify-end">
                <figure className="relative w-full max-w-md">
                  <div
                    className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary/40 to-transparent opacity-60 blur-xl"
                    aria-hidden
                  />
                  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#121b26] shadow-2xl shadow-black/40">
                    <div className="group relative aspect-[4/5] w-full">
                      <Image
                        src={teamHeadImage}
                        alt="Head of Project Team"
                        width={720}
                        height={900}
                        className="h-full w-full object-cover object-top"
                        priority
                        sizes="(max-width: 768px) 100vw, 420px"
                      />

                      <a
                        href={projectsHeadLinkedIn}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-black/65 px-4 py-3 text-sm font-bold text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100"
                      >
                        <span className="inline-flex h-2 w-2 rounded-full bg-primary" />
                        LinkedIn
                      </a>
                    </div>

                    <figcaption className="border-t border-white/10 bg-[#121b26] px-5 py-4">
                      <p className="text-sm font-semibold text-white">Kibreab Abera</p>
                      <p className="text-xs text-slate-400">Head of Project Team</p>
                      <div className="mt-3 space-y-1 text-xs text-slate-300">
                        <p>
                          <span className="font-semibold text-white">Email:</span>{" "}
                          <a className="text-primary hover:underline" href="mailto:aberakibreab466@gmail.com">
                            aberakibreab466@gmail.com
                          </a>
                        </p>
                        <p>
                          <span className="font-semibold text-white">Phone:</span>{" "}
                          <a className="text-primary hover:underline" href="tel:+251916187145">
                            +251 916 187 145
                          </a>
                        </p>
                      </div>
                    </figcaption>
                  </div>
                </figure>
              </div>
            </div>
          </div>
        </section>

        <section id="registration" className="border-t border-white/10 bg-[#0a1118] py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-[#121b26] via-[#152a45]/80 to-[#0a1118] p-8 shadow-[0_0_60px_rgba(0,163,255,0.08)] sm:p-12">
              <div className="relative max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-300">
                  Join the project team
                </p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Propose and lead impact work
                </h2>
                <p className="mt-4 text-slate-300">
                  Share your project concept, target group, and proposed outcomes. Shortlisted
                  teams will enter the implementation mentorship cycle.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href="mailto:projects@unaethu.org?subject=Project%20Team%20Proposal"
                    className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-[0_0_24px_rgba(0,163,255,0.35)] transition hover:bg-primary/90"
                  >
                    Submit proposal
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

