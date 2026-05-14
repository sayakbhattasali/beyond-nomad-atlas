"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { destinations, Destination } from "@/data/destinations";
import DestinationCard from "@/components/DestinationCard";
import SectionHeader from "@/components/SectionHeader";
import { MotionSection, MotionDiv, stagger } from "@/components/Motion";
import Link from "next/link";
import { Bookmark, ArrowLeft } from "lucide-react";

export default function SavedPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedPlaces, setSavedPlaces] = useState<Destination[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "savedDestinations"),
          where("userId", "==", currentUser.uid)
        );
        
        const snapshot = await getDocs(q);
        const slugs = snapshot.docs.map(doc => doc.data().destinationSlug);
        
        const filtered = destinations.filter(d => slugs.includes(d.slug));
        setSavedPlaces(filtered);
      } catch (error) {
        console.error("Error fetching saved places:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <main className="page-shell flex min-h-[60vh] items-center justify-center px-6">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-ember border-t-transparent" />
          <p className="mt-4 text-sm font-medium text-white/40 uppercase tracking-widest">Loading collection...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="page-shell px-6">
        <div className="mx-auto max-w-7xl py-20">
          <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-12 text-center backdrop-blur-3xl md:p-20">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-white/5 text-white/20 ring-1 ring-white/10">
              <Bookmark size={40} />
            </div>
            <h1 className="text-3xl font-semibold text-white md:text-4xl">Sign in to see saved places</h1>
            <p className="mx-auto mt-4 max-w-md text-lg text-white/50">
              Your personal travel collection is stored securely in your account.
            </p>
            <Link href="/" className="mt-10 inline-block rounded-full bg-ember px-10 py-4 font-semibold text-black transition hover:bg-amberSoft hover:scale-105 active:scale-95">
              Go back home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell px-6 pb-24">
      <MotionSection initial="hidden" animate="show" variants={stagger} className="mx-auto max-w-7xl">
        <div className="pb-12 pt-12">
          <SectionHeader
            eyebrow="Curated Vault"
            title="Saved Trips"
            description="Your personal collection of atmospheric journeys across the Odisha atlas."
          />
        </div>

        {savedPlaces.length > 0 ? (
          <MotionDiv variants={stagger} className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {savedPlaces.map((destination, index) => (
              <DestinationCard key={destination.slug} destination={destination} index={index} />
            ))}
          </MotionDiv>
        ) : (
          <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-16 text-center backdrop-blur-3xl md:p-24">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-white/5 text-white/20 ring-1 ring-white/10">
              <Bookmark size={40} />
            </div>
            <h2 className="text-2xl font-semibold text-white md:text-3xl">Atlas is empty</h2>
            <p className="mx-auto mt-4 max-w-sm text-white/50 leading-relaxed">
              Explore our curated vault and bookmark the journeys you wish to undertake.
            </p>
            <Link href="/destinations" className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 font-semibold text-white transition hover:bg-white/10 hover:scale-105 active:scale-95">
              <ArrowLeft size={18} />
              Browse Destinations
            </Link>
          </div>
        )}
      </MotionSection>
    </main>
  );
}
