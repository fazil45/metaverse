import {
  Box,
  ChevronRight,
  CircleUserRound,
  Palette,
  PhoneCall,
  Users,
  WandSparkles,
} from "lucide-react";
import React from "react";
import FeatureCard from "./Landing/FeatureCard";

const Footer = () => {
  return (
    <footer className="mx-auto flex w-[min(1120px,calc(100%-40px))] flex-wrap items-center justify-between gap-4 border-t border-border py-7 text-xs text-muted-foreground">
      <a
        href="#top"
        className="text-lg font-semibold tracking-tighter text-foreground"
      >
        gridspace
      </a>
      <span className="text-sm">Made for being there.</span>
      <div className="flex gap-4 text-sm">
        <a className="hover:text-cyan-600" href="/signin">
          Sign in
        </a>
        <a className="hover:text-cyan-600" href="/signup">
          Sign up
        </a>
      </div>
    </footer>
  );
};

export default Footer;
