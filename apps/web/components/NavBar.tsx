"use client";
import { User2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";

export default function NavBar() {
  const { data: user } = useAuth();
  return (
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
      <div className="flex items-center gap-5 text-[13px] text-muted-foreground">
        {user ? (
          <div className="flex items-center justify-center gap-4">
            {user.role === "Admin" && (
              <Link
                href={"/dashboard"}
                className="cursor-pointer border hover:border-cyan-400 rounded-md px-2 py-1"
              >
                Admin
              </Link>
            )}
            <Link
              href={"/dashboard"}
              className="cursor-pointer border hover:border-cyan-400 rounded-md px-2 py-1"
            >
              Dashboard
            </Link>
            <User2 className="cursor-pointer" />
          </div>
        ) : (
          <a href="/signin" className="hover:text-foreground">
            Sign in
          </a>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
}
