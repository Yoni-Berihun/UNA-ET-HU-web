import Image from "next/image";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import EventFlipCard from "../components/innovation/EventFlipCard";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";

const teamHeadImage =
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80";

const innovationHeroImage =
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1920&q=80";

const stats = [
  { value: "300+", label: "DELEGATES" },
  { value: "12", label: "COUNCILS" },
  { value: "24", label: "RESOLUTIONS" },
];

const upcomingEvents = [
  {
    title: "Spring MUN General Assembly",
    date: "May 14-16, 2026",
    summary:
      "Committee sessions, keynote panels, and a final plenary vote on draft resolutions.",
    detail:
      "Delegates represent member states across six committees with live crisis updates and drafting rooms.\nEvening receptions host alumni and partner universities. Certificates and awards close the assembly on Friday.\nAccessibility services and quiet rooms are available on request.",
    badge: "Registration open",
    poster:
      "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Innovation & Digital Diplomacy Lab",
    date: "June 4, 2026",
    summary:
      "Workshop on accessible web design, data storytelling, and Charter-aligned communications.",
    detail:
      "Morning sessions cover WCAG-focused UI patterns and multilingual content workflows.\nAfternoon labs pair teams with mentors to critique live sites and prototype one improvement.\nBring a laptop; materials and templates are provided. Limited seats to keep coach ratios high.",
    badge: "Limited seats",
    poster:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Youth Delegate Bootcamp",
    date: "July 22-24, 2026",
    summary:
      "Rules of procedure, research clinics, and mentoring before the autumn conference cycle.",
    detail:
      "Ideal for first-time delegates. Days blend short lectures with guided simulations and peer feedback.\nResearch coaches help refine position papers; veteran chairs run mock sessions.\nMeals and housing options are published two weeks before kickoff.",
    badge: "Coming soon",
    poster:
      "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=900&q=80",
  },
] as const;

export default function InnovationPage() {
  return (
    <>
      <Navigation />
      <main className="bg-[#0a1118] text-white">
        {/* Hero */}
        <header className="relative flex min-h-[600px] w-full items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30 z-10" />
            <div
              className="h-full w-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url('${innovationHeroImage}')` }}
            />
          </div>
          <div className="relative z-20 mx-auto flex max-w-7xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Building better tools
              </span>
            </div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:max-w-4xl">
              Innovation <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-white">
                Team
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-gray-200 sm:text-xl">
              Designing digital solutions, improving accessibility, and strengthening how our
              community engages with UN-style programs.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <Button size="lg" className="font-bold shadow-xl shadow-primary/20">
                Explore Projects
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 font-bold backdrop-blur-sm"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Watch Highlights
              </Button>
            </div>
          </div>
        </header>

        <section id="team" className="bg-[#0a1118] pb-16 pt-28 sm:pb-24 sm:pt-32">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid items-start gap-10 md:grid-cols-2 md:gap-12 lg:gap-14">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  About the team
                </p>
                <p className="mt-4 text-lg font-semibold text-white">Head of Innovation Team</p>
                <p className="mt-1 text-base text-slate-400">Dr. Jane Doe</p>
                <div className="mt-8 space-y-4 text-justify text-[15px] leading-relaxed text-slate-300 sm:text-base">
                  <p>
                    The Innovation Team advances the mission of our Model United Nations
                    community by designing reliable digital tools, improving how delegates
                    access schedules and resources, and ensuring every visitor can navigate
                    Charter-related content with clarity and confidence.
                  </p>
                  <p>
                    We work closely with faculty, student leadership, and technical
                    partners to prototype responsibly, measure outcomes, and ship
                    improvements that respect accessibility, multilingual needs, and the
                    formal tone expected of UN-style institutions.
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
                    <div className="aspect-[4/5] w-full">
                      <Image
                        src={teamHeadImage}
                        alt="Head of the Innovation Team"
                        width={720}
                        height={900}
                        className="h-full w-full object-cover object-top"
                        priority
                        sizes="(max-width: 768px) 100vw, 420px"
                      />
                    </div>
                    <figcaption className="border-t border-white/10 bg-[#121b26] px-5 py-4">
                      <p className="text-sm font-semibold text-white">Dr. Jane Doe</p>
                      <p className="text-xs text-slate-400">Head of Innovation Team</p>
                      <div className="mt-3 space-y-1 text-xs text-slate-300">
                        <p>
                          <span className="font-semibold text-white">Email:</span>{" "}
                          <a
                            className="text-primary hover:underline"
                            href="mailto:innovation@unaethu.org"
                          >
                            innovation@unaethu.org
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

        <section
          id="events"
          className="border-t border-white/10 bg-gradient-to-b from-[#0a1118] to-[#0d1520] py-16 sm:py-24"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Upcoming events
            </h2>
            <div className="mt-12 grid auto-rows-fr gap-8 md:grid-cols-3 md:items-stretch">
              {upcomingEvents.map((event) => (
                <EventFlipCard key={event.title} {...event} />
              ))}
            </div>
          </div>
        </section>

        <section id="milestones" className="border-t border-white/10 bg-[#121b26] py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="inline-flex items-center rounded-md border border-yellow-300/35 bg-yellow-300/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-yellow-300">
              Historical Milestone
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

