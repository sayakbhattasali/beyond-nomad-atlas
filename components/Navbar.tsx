"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import AuthButton from "./AuthButton";
import Image from "next/image";

const links = [
  { href: "/", label: "Home" },
  { href: "/destinations", label: "Destinations" },
  { href: "/companion", label: "Companion" },
  { href: "/planner", label: "Planner" },
  { href: "/about", label: "About" }
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 py-4 sm:px-6">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-black/35 px-4 py-3 shadow-glass backdrop-blur-2xl sm:px-6">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          <span className="relative flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-white/20">
            <Image
              src="/logo.png"
              alt="Beyond Nomad Atlas Logo"
              fill
              sizes="(max-width: 640px) 32px, 40px"
              priority
              className="object-cover scale-[1.4]"
            />
          </span>
          <span className="leading-tight min-w-0">
            <span className="block text-[11px] sm:text-sm font-bold tracking-[0.2em] sm:tracking-[0.3em] text-white uppercase truncate">BEYOND NOMAD</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm transition",
                  active ? "bg-white/10 text-white" : "text-white/62 hover:bg-white/8 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <AuthButton />
          
          <Link
            href="/planner"
            className="hidden rounded-full bg-ember px-5 py-2 text-sm font-semibold text-black transition hover:bg-amberSoft md:inline-flex"
          >
            Plan a trip
          </Link>

          <button
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            className="mx-auto mt-3 max-w-7xl rounded-3xl border border-white/10 bg-black/80 p-3 shadow-glass backdrop-blur-2xl md:hidden"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-3 text-sm text-white/78 hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-white/10 pt-2 px-1 pb-1">
              <div onClick={() => setOpen(false)}>
                {/* For the mobile menu, we explicitly show the button if it's the "Sign In" state */}
                <AuthButton className="block w-full justify-center" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
