"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth, provider } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Bookmark, User as UserIcon } from "lucide-react";
import Link from "next/link";

interface AuthButtonProps {
  className?: string;
}

export default function AuthButton({ className }: AuthButtonProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowDropdown(false);
        setShowModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setShowModal(false);
      setShowDropdown(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <button
        className={cn(
          "rounded-full border border-white/10 bg-white/5 font-semibold text-white/50 transition",
          "px-4 py-1.5 md:px-5 md:py-2 text-[11px] md:text-sm",
          className
        )}
        disabled
      >
        ...
      </button>
    );
  }

  const modalPortal = mounted ? createPortal(
    <AnimatePresence>
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="relative w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/10 bg-black/90 p-8 shadow-2xl backdrop-blur-3xl"
          >
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-white/5 text-white ring-1 ring-white/20">
                <LogOut size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white">Sign Out?</h3>
              <p className="mt-3 text-white/50 leading-relaxed text-sm">
                Are you sure you want to end your session? You'll need to sign back in to access your planned trips.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Keep Session
              </button>
              <button
                onClick={handleSignOut}
                className="flex-1 rounded-2xl bg-white py-4 text-sm font-semibold text-black transition hover:bg-amberSoft hover:scale-[1.02] active:scale-[0.98]"
              >
                Sign Out
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  ) : null;

  if (user) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className={cn(
            "flex items-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-xl transition hover:bg-white/10 hover:border-white/20",
            "p-1 md:px-3 md:py-2 md:gap-3",
            showDropdown && "bg-white/10 border-white/20",
            className
          )}
        >
          <img
            src={user.photoURL || ""}
            alt={user.displayName || "User"}
            className="h-8 w-8 rounded-full object-cover"
          />

          <div className="hidden flex-col items-start leading-none md:flex">
            <span className="text-sm font-medium">
              {user.displayName?.split(" ")[0]}
            </span>

            <span className="text-[11px] text-white/50">
              Account
            </span>
          </div>
        </button>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-white/10 bg-black/95 p-1.5 shadow-glass backdrop-blur-2xl"
            >
              <div className="px-3.5 py-3 border-b border-white/5">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] mb-1">Active Nomad</p>
                <p className="text-sm font-semibold text-white truncate">{user.displayName}</p>
                <p className="text-[11px] text-white/40 truncate">{user.email}</p>
              </div>
              <Link
                href="/account"
                onClick={() => setShowDropdown(false)}
                className="mt-1 flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-white/80 transition hover:bg-white/10 hover:text-white group"
              >
                <div className="grid h-8 w-8 place-items-center rounded-full bg-white/5 text-white/60 transition group-hover:bg-white/10 group-hover:text-white">
                  <UserIcon size={15} />
                </div>

                <span>My Account</span>
              </Link>
              <Link
                href="/saved"
                onClick={() => setShowDropdown(false)}
                className="mt-1 flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-white/80 transition hover:bg-white/10 hover:text-white group"
              >
                <div className="grid h-8 w-8 place-items-center rounded-full bg-white/5 text-white/60 transition group-hover:bg-white/10 group-hover:text-white">
                  <Bookmark size={15} />
                </div>
                <span>Saved Trips</span>
              </Link>

              <button
                onClick={() => {
                  setShowModal(true);
                  setShowDropdown(false);
                }}
                className="mt-1 flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-white/80 transition hover:bg-white/10 hover:text-white group"
              >
                <div className="grid h-8 w-8 place-items-center rounded-full bg-white/5 text-white/60 transition group-hover:bg-white/10 group-hover:text-white">
                  <LogOut size={15} />
                </div>
                <span>Sign Out</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {modalPortal}
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleSignIn}
        className={cn(
          "rounded-full border border-white/10 bg-white/5 font-semibold text-white transition hover:bg-white/10 hover:border-white/20",
          "px-4 py-1.5 md:px-5 md:py-2 text-[11px] md:text-sm",
          className
        )}
      >
        Sign In
      </button>
      {modalPortal}
    </>
  );
}
