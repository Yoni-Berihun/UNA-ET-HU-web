"use client";

import Image from "next/image";
import { Calendar, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type EventFlipCardProps = {
  title: string;
  date: string;
  summary: string;
  detail: string;
  badge: string;
  poster: string;
};

const LEAVE_MS = 320;

export default function EventFlipCard({
  title,
  date,
  summary,
  detail,
  badge,
  poster,
}: EventFlipCardProps) {
  const [open, setOpen] = useState(false);
  const [touchFlip, setTouchFlip] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const leaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none)");
    const sync = () => setTouchFlip(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const clearLeave = useCallback(() => {
    if (leaveRef.current) {
      clearTimeout(leaveRef.current);
      leaveRef.current = null;
    }
  }, []);

  const onEnter = useCallback(() => {
    if (touchFlip) return;
    clearLeave();
    setOpen(true);
  }, [clearLeave, touchFlip]);

  const onLeave = useCallback(() => {
    if (touchFlip) return;
    clearLeave();
    leaveRef.current = setTimeout(() => setOpen(false), LEAVE_MS);
  }, [clearLeave, touchFlip]);

  useEffect(() => () => clearLeave(), [clearLeave]);

  const onRootClick = () => {
    if (!touchFlip) return;
    setOpen((v) => !v);
  };

  return (
    <div
      className="group/card flex h-full min-h-[520px] flex-col outline-none sm:min-h-[560px]"
      style={{ perspective: "1200px" }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onRootClick}
      role={touchFlip ? "button" : undefined}
      tabIndex={touchFlip ? 0 : undefined}
      aria-label={touchFlip ? `${title}. Tap to flip for details.` : undefined}
    >
      <div
        className="relative h-full w-full flex-1 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          transformStyle: "preserve-3d",
          transform: open ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: reduceMotion
            ? undefined
            : "transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div
          className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-b from-[#1c2838] to-[#121b26] shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div className="relative h-[min(52%,240px)] min-h-[200px] shrink-0 sm:h-[48%] sm:min-h-[220px]">
            <Image
              src={poster}
              alt={`${title} poster`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121b26] via-[#121b26]/40 to-transparent" />
            <span className="absolute left-3 top-3 rounded-md border border-white/20 bg-[#0a1118]/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur-sm">
              {badge}
            </span>
          </div>
          <div className="flex flex-1 flex-col p-5 sm:p-6">
            <p className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-primary" />
              {date}
            </p>
            <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-white">
              {title}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">
              {summary}
            </p>
            <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-yellow-300/90">
              <Sparkles className="h-3.5 w-3.5" />
              {touchFlip ? "Tap card for full details" : "Hover for full details"}
            </p>
          </div>
        </div>

        <div
          className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl border border-yellow-300/30 bg-gradient-to-br from-[#0c1929] via-[#152a45] to-[#0a1628] p-5 shadow-[0_12px_40px_rgba(0,163,255,0.12)] sm:p-6"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            About this event
          </p>
          <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
          <p className="mt-1 text-xs text-slate-400">{date}</p>
          <div className="mt-4 flex-1 overflow-y-auto text-sm leading-relaxed text-slate-300">
            {detail.split("\n").map((para, i) => (
              <p key={i} className={i > 0 ? "mt-3" : ""}>
                {para}
              </p>
            ))}
          </div>
          <a
            href="#registration"
            className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-[0_0_24px_rgba(0,163,255,0.35)] transition hover:bg-primary/90"
            onClick={(e) => e.stopPropagation()}
          >
            Register for this event
          </a>
        </div>
      </div>
    </div>
  );
}

