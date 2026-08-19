import { CircleUserRound, Users } from "lucide-react";

export default function VideoCard() {
  return (
    <div className="overflow-hidden rounded-[18px] border-4 border-[#523d55] bg-card shadow-[0_0_0_5px_rgba(255,212,111,.18),0_20px_60px_rgba(40,80,90,.18)]">
      {/* header bar */}
      <div className="flex items-center justify-between border-b-4 border-[#523d55] bg-[#f2d67d] px-4 py-3 font-mono text-[10px] font-bold tracking-wide text-[#523d55]">
        <span className="flex items-center gap-2">
          <i className="size-2 rounded-full bg-[#e14b4b]" /> ROUTE 04
        </span>
        <span>DAY · 12:48</span>
      </div>

      <video autoPlay muted loop src={"hero.mp4"}></video>

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