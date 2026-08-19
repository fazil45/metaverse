import React from "react";
import VideoCard from "./VideoCard";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
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
          Create a room, invite your people, and walk around it together in real
          time. Gridspace makes presence feel simple.
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
            href="/signin"
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
      <VideoCard />
    </section>
  );
};

export default Hero;
