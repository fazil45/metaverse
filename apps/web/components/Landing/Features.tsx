import { Box, ChevronRight, CircleUserRound, Palette, Users,PhoneCall, WandSparkles } from 'lucide-react'
import React from 'react'
import FeatureCard from './FeatureCard'

const Features = () => {
  return (
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
          <FeatureCard
            icon={<PhoneCall size={19} />}
            title="Communicate with others"
            className="row-span-2"
          >
            Communicate with others through video chats and texts.
          </FeatureCard>
          <article
            id="how"
            className="rounded-[1.15rem] border border-border bg-card p-6 md:col-span-2 transition shadow-xl/10"
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
  )
}

export default Features