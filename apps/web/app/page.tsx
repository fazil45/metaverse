"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Box,
  ChevronRight,
  CircleUserRound,
  Moon,
  MousePointer2,
  Palette,
  Sun,
  Users,
  WandSparkles,
} from "lucide-react";

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("gridspace-theme");
    const isDark = saved
      ? saved === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("gridspace-theme", next ? "dark" : "light");
  };
  return (
    <button
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggle}
      className="grid size-8 place-items-center rounded-full border border-border bg-card text-foreground transition hover:border-cyan-400 focus-visible:outline-2 focus-visible:outline-cyan-300"
      type="button"
    >
      {dark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}

function PixelAvatar({ small = false }: { small?: boolean }) {
  return (
    <div
      className={`relative ${small ? "h-16 w-11 scale-75" : "h-28 w-16"} animate-[bob_3s_ease-in-out_infinite] [image-rendering:pixelated]`}
    >
      {/* ground shadow */}
      <span className="absolute -bottom-1 left-1/2 h-2 w-9 -translate-x-1/2 rounded-full bg-black/25" />
 
      {/* hair/cap */}
      <span className="absolute left-2 top-0 h-3.5 w-12 bg-[#24486a] shadow-[0_2px_0_#152d42]" />
      <span className="absolute left-1 top-2 h-2 w-3 bg-[#24486a]" />
 
      {/* headband / brim */}
      <span className="absolute left-0 top-3.5 h-2.5 w-16 bg-[#d63d3d] shadow-[0_2px_0_#a02c2c]" />
 
      {/* face */}
      <span className="absolute left-3 top-6 h-8 w-10 bg-[#f1b27e] shadow-[inset_0_-3px_0_rgba(0,0,0,0.08)]" />
      <span className="absolute left-5 top-9 h-1.5 w-1.5 bg-[#352d35]" />
      <span className="absolute right-5 top-9 h-1.5 w-1.5 bg-[#352d35]" />
      <span className="absolute left-1/2 top-11 h-1 w-2 -translate-x-1/2 bg-[#c9855a]" />
 
      {/* torso */}
      <span className="absolute left-3 top-13 h-7 w-10 bg-[#2f66a8] shadow-[inset_0_-3px_0_rgba(0,0,0,0.15)]" />
      <span className="absolute left-1/2 top-13 h-7 w-1 -translate-x-1/2 bg-[#1e4a7d]" />
 
      {/* arms */}
      <span className="absolute left-1 top-13.5 h-6 w-2.5 bg-[#f1b27e]" />
      <span className="absolute right-1 top-13.5 h-6 w-2.5 bg-[#f1b27e]" />
 
      {/* legs */}
      <span className="absolute bottom-2 left-1 h-9 w-6 bg-[#31558c] shadow-[inset_-2px_0_0_rgba(0,0,0,0.12)]" />
      <span className="absolute bottom-2 right-1 h-9 w-6 bg-[#31558c] shadow-[inset_2px_0_0_rgba(0,0,0,0.12)]" />
 
      {/* shoes */}
      <span className="absolute bottom-0 left-0 h-2 w-7 bg-[#392f3b]" />
      <span className="absolute bottom-0 right-0 h-2 w-7 bg-[#392f3b]" />
 
      {/* outer 1px black outline around the whole silhouette */}
      <span className="pointer-events-none absolute inset-0 shadow-[0_0_0_1px_rgba(0,0,0,0.35)]" />
    </div>
  );
}

 
function GameMapCard() {
  return (
    <div className="overflow-hidden rounded-[18px] border-4 border-[#523d55] bg-card shadow-[0_0_0_5px_rgba(255,212,111,.18),0_20px_60px_rgba(40,80,90,.18)]">
      {/* header bar */}
      <div className="flex items-center justify-between border-b-4 border-[#523d55] bg-[#f2d67d] px-4 py-3 font-mono text-[10px] font-bold tracking-wide text-[#523d55]">
        <span className="flex items-center gap-2">
          <i className="size-2 rounded-full bg-[#e14b4b]" /> ROUTE 04
        </span>
        <span>DAY · 12:48</span>
      </div>
 
      {/* map */}
      <div
        aria-label="Top-down pixel art route with grass, water, trees, a house, and a trainer"
        className="relative h-91.25 overflow-hidden bg-[#78ad70] [image-rendering:pixelated]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 6px 6px, rgba(255,255,255,0.10) 1.5px, transparent 1.5px),
            linear-gradient(90deg, rgba(42,83,67,.22) 2px, transparent 2px),
            linear-gradient(rgba(42,83,67,.22) 2px, transparent 2px)
          `,
          backgroundSize: "32px 32px, 32px 32px, 32px 32px",
        }}
      >
        {/* water — wave-striped instead of flat */}
        <div
          className="absolute -left-8 top-16 h-32 w-48 rotate-[-10deg] shadow-[inset_0_0_0_5px_#d9e4c4,0_3px_0_rgba(0,0,0,0.15)]"
          style={{
            backgroundImage: `
              repeating-linear-gradient(90deg, #9cd4e8 0px, #9cd4e8 6px, #6badd0 6px, #6badd0 12px),
              linear-gradient(#6badd0, #5a9ec4)
            `,
            backgroundBlendMode: "overlay",
          }}
        />
 
        {/* trees — round canopy + shaded underlayer + trunk, not dots */}
        <div className="absolute left-6 top-6 grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="relative size-8">
              <span className="absolute inset-0 rounded-full bg-[#2f5940] shadow-[0_2px_0_rgba(0,0,0,0.2)]" />
              <span className="absolute inset-0.75 rounded-full bg-[#4f8c55]" />
              <span className="absolute left-1.5 top-1.5 size-2 rounded-full bg-[#6bab6a]/80" />
              <span className="absolute -bottom-1.5 left-1/2 h-2.5 w-1.5 -translate-x-1/2 bg-[#5c3d28]" />
            </div>
          ))}
        </div>
 
        {/* house — pitched roof + door + paned window, not a flat block */}
        <div className="absolute right-6 top-6 w-28">
          {/* roof, stepped edges to fake a pixel triangle */}
          <div className="relative h-8 w-full bg-[#8d5b55]">
            <div className="absolute inset-x-0 -top-2 mx-2 h-2 bg-[#8d5b55]" />
            <div className="absolute inset-x-0 -top-4 mx-5 h-2 bg-[#8d5b55]" />
            <div className="absolute inset-x-0 -top-6 mx-8 h-2 bg-[#a06a63]" />
          </div>
          <div className="h-16 w-full border-4 border-t-0 border-[#704c4a] bg-[#d89268]">
            <div className="mx-auto mt-2 grid size-8 grid-cols-2 grid-rows-2 gap-0.5 border-2 border-[#704c4a] bg-[#8bc0ce] p-0.5">
              <span className="bg-[#a9d6e0]" />
              <span className="bg-[#a9d6e0]" />
              <span className="bg-[#a9d6e0]" />
              <span className="bg-[#a9d6e0]" />
            </div>
            <div className="mx-auto mt-1 h-5 w-4 bg-[#5c3d28] shadow-[inset_2px_0_0_rgba(0,0,0,0.2)]" />
          </div>
        </div>
 
        {/* dirt patch under the house */}
        <div
          className="absolute bottom-10 left-8 h-20 w-20 border-4 border-[#b99956] bg-[#dfc878]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(180,153,92,0.5) 1.5px, transparent 1.5px)",
            backgroundSize: "10px 10px",
          }}
        />
 
        {/* path — speckled dirt, not a flat tan bar */}
        <div
          className="absolute left-[52%] top-[55%] h-10 w-36 -rotate-6 bg-[#d5bf73] shadow-[inset_0_4px_0_#e9d995,inset_0_-4px_0_#b4995c]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(180,153,92,0.6) 1.5px, transparent 1.5px)",
            backgroundSize: "8px 8px",
          }}
        />
 
        {/* tall-grass patch the sprite is standing near */}
        <div
          className="absolute left-1/2 top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 border-2 border-[#fff0ad] bg-[#f9df81]/50"
          style={{
            backgroundImage:
              "linear-gradient(0deg, transparent 60%, rgba(53,91,72,0.4) 60%)",
            backgroundSize: "4px 100%",
          }}
        />
 
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2">
          <PixelAvatar />
        </div>
        <span className="absolute bottom-8 left-[calc(50%+38px)] border-2 border-[#523d55] bg-[#fff1b0] px-2 py-1 font-mono text-[9px] font-bold text-[#523d55]">
          MIRA
        </span>
        <MousePointer2
          className="absolute bottom-20 right-24 text-[#523d55] drop-shadow-lg"
          size={18}
        />
      </div>
 
      {/* footer bar */}
      <div className="flex items-center justify-between border-t-4 border-[#523d55] bg-[#fff1b0] px-4 py-3 font-mono text-[10px] font-bold text-[#523d55]">
        <span className="flex items-center gap-1.5">
          <Users size={13} /> 3 trainers here
        </span>
        <span className="flex items-center gap-1.5">
          <CircleUserRound size={13} /> You are here
        </span>
      </div>
    </div>
  );
}

function FeatureCard({
  className = "",
  icon,
  title,
  children,
}: {
  className?: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article
      className={`relative overflow-hidden rounded-[1.15rem] border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:border-cyan-300/70 ${className}`}
    >
      <div className="grid size-9 place-items-center rounded-[10px] border border-cyan-300/60 bg-cyan-300/10 text-primary">
        {icon}
      </div>
      <h3 className="mt-4 text-[17px] font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {children}
      </p>
    </article>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <nav className="mx-auto flex h-20.5 w-[min(1120px,calc(100%-40px))] items-center justify-between border-b border-border">
        <a
          href="#top"
          className="flex items-center gap-2 text-[17px] font-semibold tracking-tighter"
        >
          <span className="grid rotate-45 grid-cols-2 gap-0.5">
            {[1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={`size-1.5 rounded-sm ${i === 2 || i === 3 ? "bg-cyan-300" : "bg-primary"}`}
              />
            ))}
          </span>
          <span>gridspace</span>
        </a>
        <div className="hidden items-center gap-7 text-[13px] text-muted-foreground sm:flex">
          <a href="#how" className="hover:text-foreground">
            How it works
          </a>
          <a href="#build" className="hover:text-foreground">
            For builders
          </a>
        </div>
        <div className="flex items-center gap-5 text-[13px] text-muted-foreground">
          <a href="#signin" className="hover:text-foreground">
            Sign in
          </a>
          <ThemeToggle />
        </div>
      </nav>

      <section
        id="top"
        className="mx-auto grid w-[min(1120px,calc(100%-40px))] items-center gap-12 py-16 md:grid-cols-[.9fr_1.1fr] md:gap-18 md:py-23"
      >
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] font-semibold tracking-[.15em] text-primary">
            <i className="size-1.5 rounded-full bg-cyan-300" /> Your shared 2D
            world
          </div>
          <h1 className="mt-5 text-balance text-[clamp(46px,6vw,78px)] font-semibold leading-[.97] tracking-[-.075em]">
            Build a place.
            <br />
            <em className="not-italic text-primary">Be there</em> together.
          </h1>
          <p className="mt-5 max-w-105 text-base leading-relaxed text-muted-foreground">
            Create a room, invite your people, and walk around it together in
            real time. Gridspace makes presence feel simple.
          </p>
          <div className="mt-7 flex gap-3">
            <a
              className="inline-flex items-center gap-2 rounded-lg border border-blue-700 bg-primary px-4 py-3 text-[13px] font-semibold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-500"
              href="#build"
            >
              Enter Gridspace <ArrowRight size={16} />
            </a>
            <a
              className="inline-flex items-center rounded-lg border border-border bg-card px-4 py-3 text-[13px] font-semibold hover:border-cyan-300"
              href="#signin"
            >
              Sign in
            </a>
          </div>
          <div className="mt-8 flex items-center gap-2.5 text-[11px] text-muted-foreground">
            <span className="flex">
              <i className="size-5 rounded-full border-2 border-background bg-[#90c8ee]" />
              <i className="-ml-1 size-5 rounded-full border-2 border-background bg-[#f3b87b]" />
              <i className="-ml-1 size-5 rounded-full border-2 border-background bg-[#c3a6e8]" />
            </span>{" "}
            Made for small, real communities
          </div>
        </div>
        <GameMapCard />
      </section>

      <section
        id="build"
        className="mx-auto w-[min(1120px,calc(100%-40px))] pb-20"
      >
        <div className="mb-7 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="font-mono text-[10px] font-semibold tracking-[.15em] text-muted-foreground">
              THE SPACE BETWEEN
            </span>
            <h2 className="mt-3 text-[clamp(30px,4vw,47px)] font-semibold leading-none tracking-[-.065em]">
              Make a room{" "}
              <em className="not-italic text-primary">worth entering.</em>
            </h2>
          </div>
          <p className="max-w-75 text-[13px] leading-relaxed text-muted-foreground">
            Gridspace gives your community a place to gather that feels more
            like a place than a feed.
          </p>
        </div>
        <div className="grid gap-3.5 md:grid-cols-[1.25fr_.85fr_.9fr] md:grid-rows-2">
          <FeatureCard
            className="md:row-span-2"
            icon={<Palette size={19} />}
            title="Build a room"
          >
            Set the dimensions, drop in elements, and save a map that feels like
            yours.
          </FeatureCard>
          <FeatureCard
            icon={<CircleUserRound size={19} />}
            title="Pick an avatar"
          >
            Choose a small sprite that says hello when you arrive.
          </FeatureCard>
          <FeatureCard icon={<Users size={19} />} title="Move together, live">
            Arrow keys or WASD. Every step is broadcast to everyone in the room.
          </FeatureCard>
          <FeatureCard
            icon={<WandSparkles size={19} />}
            title="Built for builders"
          >
            Create custom objects, avatars, and maps for the world you are
            making.
          </FeatureCard>
          <article
            id="how"
            className="rounded-[1.15rem] border border-border bg-card p-6 md:col-span-2"
          >
            <div className="grid size-9 place-items-center rounded-[10px] border border-cyan-300/60 bg-cyan-300/10 text-primary">
              <Box size={19} />
            </div>
            <h3 className="mt-4 text-[17px] font-semibold">How it works</h3>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs">
              <div>
                <b className="block font-mono text-primary">01</b>
                <strong className="block">Sign up</strong>
                <span className="text-muted-foreground">Make your space</span>
              </div>
              <ChevronRight className="text-muted-foreground" size={16} />
              <div>
                <b className="block font-mono text-primary">02</b>
                <strong className="block">Join a room</strong>
                <span className="text-muted-foreground">Bring your people</span>
              </div>
              <ChevronRight className="text-muted-foreground" size={16} />
              <div>
                <b className="block font-mono text-primary">03</b>
                <strong className="block">Move around</strong>
                <span className="text-muted-foreground">Be there, live</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <footer className="mx-auto flex w-[min(1120px,calc(100%-40px))] flex-wrap items-center justify-between gap-4 border-t border-border py-7 text-xs text-muted-foreground">
        <a
          href="#top"
          className="font-semibold tracking-tighter text-foreground"
        >
          gridspace
        </a>
        <span>Made for being there.</span>
        <div className="flex gap-4">
          <a href="#signin">Sign in</a>
          <a href="#build">Sign up</a>
        </div>
      </footer>
    </main>
  );
}
