import Image from "next/image";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import Link from "next/link";

const heroBackdrop =
  "linear-gradient(120deg, rgba(6,10,18,0.90) 0%, rgba(8,17,31,0.82) 42%, rgba(8,17,31,0.92) 100%), url(https://images.unsplash.com/photo-1573164574572-cb89e39749b4?auto=format&fit=crop&w=2200&q=80)";

const debateTeamHeadImage =
  "/images/deb.jpg";
const debateHeadLinkedIn = "https://www.linkedin.com/in/rose-kassa-4238b4263?utm_source=share_via&utm_content=profile&utm_medium=member_ios";

function DebateAboutTeam() {
  return (
    <section id="about" className="bg-[#08111f] pb-16 pt-24 sm:pb-24 sm:pt-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-start gap-10 md:grid-cols-2 md:gap-12 lg:gap-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              About the team
            </p>
            <p className="mt-4 text-lg font-semibold text-white">Head of Debate Team</p>
            <p className="mt-1 text-base text-slate-400">Megdelawit Demsew</p>

            <div className="mt-8 space-y-4 text-justify text-[15px] leading-relaxed text-slate-300 sm:text-base">
              <p>
                The Debate Team prepares delegates for high-pressure negotiation, structured rebuttal,
                and evidence-based public speaking grounded in the UN Charter and diplomatic norms.
              </p>
              <p>
                Through workshops and chamber simulations, members sharpen research discipline,
                procedural fluency, and coalition strategy—while maintaining respectful,
                solutions-focused dialogue.
              </p>
            </div>
          </div>

          <div className="flex justify-center md:sticky md:top-24 md:justify-end">
            <figure className="relative w-full max-w-md">
              <div
                className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary/40 to-transparent opacity-60 blur-xl"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#111d2f] shadow-2xl shadow-black/40">
                <div className="group relative aspect-[4/5] w-full">
                  <Image
                    src={debateTeamHeadImage}
                    alt="Head of the Debate Team"
                    width={720}
                    height={900}
                    className="h-full w-full object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 420px"
                  />

                  <a
                    href={debateHeadLinkedIn}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-black/65 px-4 py-3 text-sm font-bold text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100"
                  >
                    <span className="inline-flex h-2 w-2 rounded-full bg-primary" />
                    LinkedIn
                  </a>
                </div>

                <figcaption className="border-t border-white/10 bg-[#111d2f] px-5 py-4">
                  <p className="text-sm font-semibold text-white">Megdelawit Demsew</p>
                  <p className="text-xs text-slate-400">Head of Debate Team</p>
                  <div className="mt-3 space-y-1 text-xs text-slate-300">
                    <p>
                      <span className="font-semibold text-white">Email:</span>{" "}
                      <a className="text-primary hover:underline" href="mailto:megdelawitdemsew@gmail.com">
                        megdelawitdemsew@gmail.com
                      </a>
                    </p>
                    <p>
                      <span className="font-semibold text-white">Phone:</span>{" "}
                      <a className="text-primary hover:underline" href="tel:0923345893">
                        +251 923 345 893
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
  );
}

export default function DebatePage() {
  return (
    <>
      <Navigation />
      <main className="bg-[#08111f] text-white">
        <section
          id="team"
          className="relative overflow-hidden border-b border-white/10 pb-16 pt-28 sm:pb-24 sm:pt-32"
          style={{ backgroundImage: heroBackdrop, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_15%_10%,rgba(0,161,219,0.25),transparent)]"
            aria-hidden
          />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <p className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-100">
              Debate Team
            </p>
            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl">
              Diplomacy Through{" "}
              <span className="text-primary [text-shadow:0_0_30px_rgba(0,161,219,0.45)]">
                Evidence, Procedure,
              </span>{" "}
              and Principled Speech
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
              Our chamber prepares delegates for high-pressure negotiations, formal
              committee speaking, and Charter-grounded rebuttal strategy. Every round
              trains clarity, discipline, and diplomatic confidence.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-[0_0_24px_rgba(0,163,255,0.35)] transition hover:bg-primary/90"
              >
                Join Debate Team
              </Link>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <article className="rounded-2xl border border-white/15 bg-[#0d1b2c]/75 p-5 backdrop-blur-sm">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  Policy Framing
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  Build arguments around Charter articles, precedent, and realistic state interests.
                </p>
              </article>
              <article className="rounded-2xl border border-white/15 bg-[#0d1b2c]/75 p-5 backdrop-blur-sm">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  Rebuttal Discipline
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  Practice concise responses, procedural motions, and coalition positioning.
                </p>
              </article>
              <article className="rounded-2xl border border-white/15 bg-[#0d1b2c]/75 p-5 backdrop-blur-sm">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  Speaker Growth
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  Structured feedback cycles to improve delivery, logic flow, and composure.
                </p>
              </article>
            </div>
          </div>
        </section>

        <DebateAboutTeam />
      </main>
      <Footer />
    </>
  );
}

