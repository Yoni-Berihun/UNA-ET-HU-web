import Image from "next/image";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import EventFlipCard from "../components/innovation/EventFlipCard";

const heroBackdrop =
  "linear-gradient(120deg, rgba(6,10,18,0.90) 0%, rgba(8,17,31,0.82) 42%, rgba(8,17,31,0.92) 100%), url(https://images.unsplash.com/photo-1573164574572-cb89e39749b4?auto=format&fit=crop&w=2200&q=80)";

const debateTeamHeadImage =
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80";

const debateEvents = [
  {
    title: "UN Charter Moot Session",
    date: "May 18, 2026",
    summary:
      "Competitive chamber focused on Article 1 principles and conflict de-escalation arguments.",
    detail:
      "Delegates present structured legal and policy arguments tied to Charter obligations.\nA moderation panel scores clarity, citation quality, and diplomatic framing.\nBest speakers advance to the inter-university round.",
    badge: "Registration open",
    poster:
      "https://images.unsplash.com/photo-1528747008803-5f6f72f8f4c4?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Negotiation and Rebuttal Workshop",
    date: "June 9, 2026",
    summary:
      "Hands-on drills for rebuttal timing, coalition building, and procedural interventions.",
    detail:
      "Sessions focus on cross-examination strategy, caucus leadership, and amendment drafting.\nParticipants practice framing disagreement without losing diplomatic tone.\nMentors provide line-by-line feedback after each round.",
    badge: "Limited seats",
    poster:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Public Speaking Bootcamp",
    date: "July 12-13, 2026",
    summary:
      "Voice control, persuasive speech architecture, and evidence-based closing statements.",
    detail:
      "Day one covers argument architecture and speaking under time pressure.\nDay two runs full simulations with panel scoring and peer critique.\nCertificates are awarded based on consistency and improvement.",
    badge: "Coming soon",
    poster:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80",
  },
] as const;

const stats = [
  { value: "42", label: "FORMAL DEBATES" },
  { value: "15", label: "MOTION PACKS" },
  { value: "88%", label: "SPEAKER IMPROVEMENT" },
];

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
            <p className="mt-1 text-base text-slate-400">Dr. Jane Doe</p>

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
                <div className="aspect-[4/5] w-full">
                  <Image
                    src={debateTeamHeadImage}
                    alt="Head of the Debate Team"
                    width={720}
                    height={900}
                    className="h-full w-full object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 420px"
                  />
                </div>
                <figcaption className="border-t border-white/10 bg-[#111d2f] px-5 py-4">
                  <p className="text-sm font-semibold text-white">Dr. Jane Doe</p>
                  <p className="text-xs text-slate-400">Head of Debate Team</p>
                  <div className="mt-3 space-y-1 text-xs text-slate-300">
                    <p>
                      <span className="font-semibold text-white">Email:</span>{" "}
                      <a className="text-primary hover:underline" href="mailto:debate@unaethu.org">
                        debate@unaethu.org
                      </a>
                    </p>
                    <p>
                      <span className="font-semibold text-white">Phone:</span>{" "}
                      <a className="text-primary hover:underline" href="tel:+251900000000">
                        +251 900 000 000
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

        <section
          id="events"
          className="border-t border-white/10 bg-gradient-to-b from-[#08111f] to-[#10213b] py-16 sm:py-24"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Debate program calendar
            </h2>
            <div className="mt-12 grid auto-rows-fr gap-8 md:grid-cols-3 md:items-stretch">
              {debateEvents.map((event) => (
                <EventFlipCard key={event.title} {...event} />
              ))}
            </div>
          </div>
        </section>

        <section id="milestones" className="border-t border-white/10 bg-[#111d2f] py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="inline-flex items-center rounded-md border border-blue-300/35 bg-blue-300/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-300">
              Performance snapshot
            </p>
            <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6">
              {stats.map((s) => (
                <div key={s.label} className="text-center sm:text-left">
                  <p className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                    {s.value}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

