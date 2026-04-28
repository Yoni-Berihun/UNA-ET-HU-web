import Image from "next/image";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import Link from "next/link";

const teamHeadImage =
  "/images/inov.jpg";
const innovationHeadLinkedIn = "https://www.linkedin.com/in/yoni-berihun";

const innovationHeroImage =
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d";

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
              <Button asChild size="lg" className="font-bold shadow-xl shadow-primary/20">
                <Link href="/auth/signup">Join the Innovation Team</Link>
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
                <p className="mt-1 text-base text-slate-400">Yonatan Berihun</p>
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
                    <div className="group relative aspect-[4/5] w-full">
                      <Image
                        src={teamHeadImage}
                        alt="Head of the Innovation Team"
                        width={720}
                        height={900}
                        className="h-full w-full object-cover object-top"
                        priority
                        sizes="(max-width: 768px) 100vw, 420px"
                      />

                      <a
                        href={innovationHeadLinkedIn}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-black/65 px-4 py-3 text-sm font-bold text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100"
                      >
                        <span className="inline-flex h-2 w-2 rounded-full bg-primary" />
                        LinkedIn
                      </a>
                    </div>

                    <figcaption className="border-t border-white/10 bg-[#121b26] px-5 py-4">
                      <p className="text-sm font-semibold text-white">Yonatan Berihun</p>
                      <p className="text-xs text-slate-400">Head of Innovation Team</p>
                      <div className="mt-3 space-y-1 text-xs text-slate-300">
                        <p>
                          <span className="font-semibold text-white">Email:</span>{" "}
                          <a
                            className="text-primary hover:underline"
                            href="mailto:yonatanberihun26@gmail.com"
                          >
                            yonatanberihun26@gmail.com
                          </a>
                        </p>
                        <p>
                          <span className="font-semibold text-white">Phone:</span>{" "}
                          <a className="text-primary hover:underline" href="tel:0991134526">
                            +251 91 134 526
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
                  Registration
                </p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Secure your seat
                </h2>
                <p className="mt-4 text-slate-300">
                  Use the register button on an event card to land here, then complete your
                  application through your official form or inbox.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button
                    asChild
                    className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-[0_0_24px_rgba(0,163,255,0.35)] transition hover:bg-primary/90"
                  >
                    <Link href="/auth/signup">Join us</Link>
                  </Button>
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

