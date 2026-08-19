"use client";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export const AuthComponent = ({
  mode,
  children,
}: {
  mode: string;
  children: React.ReactNode;
}) => {
  const isSignup = mode === "signup";
  const { data: user } = useAuth();

  return (
    <main className="max-h-[calc(100vh-82px)] bg-background px-5 py-8 text-foreground sm:px-8 overflow-hidden">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl flex-col justify-between">
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-[17px] font-semibold tracking-tighter"
          >
            <span
              className="grid rotate-45 grid-cols-2 gap-0.5"
              aria-hidden="true"
            >
              {[1, 2, 3, 4].map((item) => (
                <span
                  key={item}
                  className={`size-1.5 rounded-sm ${item === 2 || item === 3 ? "bg-cyan-300" : "bg-primary"}`}
                />
              ))}
            </span>
            <span>gridspace</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={14} /> Back home
          </Link>
        </header>

        <section className="mx-auto grid w-full max-w-4xl items-center gap-8 py-14 md:grid-cols-[.8fr_1fr] md:gap-20 lg:-mt-16">
          <div className="hidden md:block">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[.18em] text-primary">
              {isSignup ? "Start your journey" : `Welcome back, Users`}
            </p>
            <h1 className="mt-5 text-balance text-5xl font-semibold leading-[.98] tracking-[-.07em]">
              {isSignup ? (
                <>
                  Make a place
                  <br />
                  <em className="not-italic text-primary">your own.</em>
                </>
              ) : (
                <>
                  Step back
                  <br />
                  into your <em className="not-italic text-primary">world.</em>
                </>
              )}
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {isSignup
                ? "Create your Gridspace account and bring your people into a world built for being together."
                : "Your room is waiting. Sign in to see who is online and keep exploring."}
            </p>
          </div>

          <div className="rounded-[18px] border-4 border-[#523d55] bg-card p-6 shadow-[8px_8px_0_#f2d67d] sm:p-8">
            <div className="border-b-2 border-border pb-5">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-muted-foreground">
                Gridspace access
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                {isSignup ? "Create your account" : "Sign in to Gridspace"}
              </h2>
            </div>
            {children}
            <p className="mt-6 text-center text-xs text-muted-foreground">
              {isSignup ? "Already have an account?" : "New to Gridspace?"}{" "}
              <Link
                href={isSignup ? "/signin" : "/signup"}
                className="font-semibold text-primary hover:underline"
              >
                {isSignup ? "Sign in" : "Create one"}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};
