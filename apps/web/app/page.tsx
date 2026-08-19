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
import Hero from "../components/Landing/Hero";
import FeatureCard from "../components/Landing/FeatureCard";
import NavBar from "../components/NavBar";
import Features from "../components/Landing/Features";
import Footer from "../components/Footer";


export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">


      <Hero/>

      <Features/>
      
      <Footer/>
      
    </main>
  );
}
