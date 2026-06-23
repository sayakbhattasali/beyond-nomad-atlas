"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, query, where, getCountFromServer, getDocs, orderBy, limit, Timestamp } from "firebase/firestore";
import Link from "next/link";
import { User as UserIcon, Bookmark, MessageSquare, MapPinCheck, Book } from "lucide-react";
import Image from "next/image";
import { destinations } from "@/data/destinations";

type RecentComment = {
    id: string;
    text: string;
    destinationSlug: string;
    createdAt?: Timestamp;
};

type RecentMemory = {
    id: string;
    title: string;
    text: string;
    mood: string;
    destinationName: string;
    memoryDate?: Timestamp;
    createdAt?: Timestamp;
};

function getTimeAgo(timestamp?: Timestamp) {
    if (!timestamp) return "Just now";

    const now = new Date();
    const commentTime = timestamp.toDate();

    const seconds = Math.floor(
        (now.getTime() - commentTime.getTime()) / 1000
    );

    if (seconds < 60) return "Just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60)
        return `${minutes} min${minutes > 1 ? "s" : ""} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24)
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;

    const days = Math.floor(hours / 24);
    if (days < 30)
        return `${days} day${days > 1 ? "s" : ""} ago`;

    const months = Math.floor(days / 30);
    if (months < 12)
        return `${months} month${months > 1 ? "s" : ""} ago`;

    const years = Math.floor(months / 12);

    return `${years} year${years > 1 ? "s" : ""} ago`;
}

export default function AccountPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [savedCount, setSavedCount] = useState<number>(0);
    const [commentsCount, setCommentsCount] = useState<number>(0);
    const [visitedCount, setVisitedCount] = useState<number>(0);
    const [memoryCount, setMemoryCount] = useState<number>(0);
    const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
    const [visitedSlugs, setVisitedSlugs] = useState<string[]>([]);
    const [recentComments, setRecentComments] = useState<RecentComment[]>([]);
    const [recentMemories, setRecentMemories] = useState<RecentMemory[]>([]);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                try {
                    // Fetch saved destinations count
                    const savedQ = query(
                        collection(db, "savedDestinations"),
                        where("userId", "==", currentUser.uid),
                        orderBy("createdAt", "desc")
                    );
                    const savedSnapshot = await getCountFromServer(savedQ);
                    setSavedCount(savedSnapshot.data().count);
                    const savedDocs = await getDocs(savedQ);
                    setSavedSlugs(
                        savedDocs.docs.map((doc) => doc.data().destinationSlug as string)
                    );

                    // Fetch visited destinations count and slugs
                    const visitedQ = query(
                        collection(db, "visitedDestinations"),
                        where("userId", "==", currentUser.uid),
                        orderBy("createdAt", "desc")
                    );
                    const visitedSnapshot = await getCountFromServer(visitedQ);
                    setVisitedCount(visitedSnapshot.data().count);
                    const visitedDocs = await getDocs(visitedQ);
                    setVisitedSlugs(
                        visitedDocs.docs.map((doc) => doc.data().destinationSlug as string)
                    );

                    // Fetch memories count and recent entries
                    const memoriesQ = query(collection(db, "memories"), where("userId", "==", currentUser.uid), orderBy("memoryDate", "desc"));
                    const memoriesSnapshot = await getCountFromServer(memoriesQ);
                    setMemoryCount(memoriesSnapshot.data().count);

                    const recentMemoriesQ = query(
                        collection(db, "memories"),
                        where("userId", "==", currentUser.uid),
                        orderBy("memoryDate", "desc"),
                        limit(2)
                    );
                    const recentMemSnapshot = await getDocs(recentMemoriesQ);
                    setRecentMemories(
                        recentMemSnapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data()
                        } as RecentMemory))
                    );

                    // Fetch comments count and recent activity
                    const commentsQ = query(collection(db, "comments"), where("userId", "==", currentUser.uid), orderBy("createdAt", "desc"));
                    const commentsSnapshot = await getCountFromServer(commentsQ);
                    setCommentsCount(commentsSnapshot.data().count);

                    const recentCommentsQ = query(
                        collection(db, "comments"),
                        where("userId", "==", currentUser.uid),
                        orderBy("createdAt", "desc"),
                        limit(2)
                    );
                    const recentSnapshot = await getDocs(recentCommentsQ);
                    setRecentComments(
                        recentSnapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data()
                        } as RecentComment))
                    );
                } catch (error) {
                    console.error("Error fetching stats:", error);
                }
            }

            setLoading(false);
        });

        return () => unsub();
    }, []);

    const savedPreview = savedSlugs
        .map((slug) =>
            destinations.find((destination) => destination.slug === slug)
        )
        .filter((destination): destination is typeof destinations[number] => Boolean(destination))
        .slice(0, 2);

    const visitedPreview = visitedSlugs
        .map((slug) =>
            destinations.find((destination) => destination.slug === slug)
        )
        .filter((destination): destination is typeof destinations[number] => Boolean(destination))
        .slice(0, 2);

    if (loading) {
        return (
            <main className="page-shell flex min-h-[60vh] items-center justify-center px-6">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-ember border-t-transparent" />
                    <p className="mt-4 text-sm font-medium text-white/40 uppercase tracking-widest">Loading dashboard...</p>
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
                            <UserIcon size={40} />
                        </div>
                        <h1 className="text-3xl font-semibold text-white md:text-4xl">Sign in to view dashboard</h1>
                        <p className="mx-auto mt-4 max-w-md text-lg text-white/50">
                            Manage your saved escapes, comments and future travel memories from one place.
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
        <main className="page-shell px-6 pb-24 pt-12 md:pt-28">
            <section className="mx-auto max-w-7xl pt-4 md:pt-12">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[.42em] text-ember md:mb-6 md:text-base">
                    Explorer Desk
                </p>

                <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:mt-4 md:text-6xl lg:text-7xl">
                    My Account
                </h1>

                <p className="mt-4 max-w-2xl text-base leading-8 text-white/60 md:mt-6 md:text-lg">
                    Manage your saved escapes, comments and future travel memories from one place.
                </p>

                <div className="mt-10 grid gap-8 lg:grid-cols-[340px_1fr] md:mt-16">

                    {/* LEFT PROFILE CARD */}
                    <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-2xl self-start">
                        <div className="flex flex-col items-center text-center">
                            <img
                                src={user.photoURL || "https://placehold.co/120x120"}
                                alt={user.displayName || "Profile"}
                                className="h-28 w-28 rounded-full object-cover ring-2 ring-white/10"
                                referrerPolicy="no-referrer"
                            />

                            <h2 className="mt-5 text-2xl font-semibold text-white">
                                {user.displayName || "Explorer"}
                            </h2>

                            <p className="mt-1 text-sm text-white/45">
                                Modern Nomad
                            </p>

                            <div className="mt-8 grid w-full grid-cols-2 gap-3 sm:grid-cols-4">

                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/5">
                                    <p className="text-xl font-semibold text-white">{savedCount}</p>

                                    <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/35 flex items-center justify-center gap-1">
                                        <Bookmark size={10} className="text-ember" /> Saved
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/5">
                                    <p className="text-xl font-semibold text-white">{visitedCount}</p>

                                    <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/35 flex items-center justify-center gap-1">
                                        <MapPinCheck size={10} className="text-ember" /> Visited
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/5">
                                    <p className="text-xl font-semibold text-white">{memoryCount}</p>

                                    <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/35 flex items-center justify-center gap-1">
                                        <Book size={10} className="text-ember" /> Journal
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/5">
                                    <p className="text-xl font-semibold text-white">{commentsCount}</p>

                                    <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/35 flex items-center justify-center gap-1">
                                        <MessageSquare size={10} className="text-ember" /> Notes
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* RIGHT CONTENT */}
                    <div className="space-y-8">

                        {/* SAVED DESTINATIONS */}
                        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-2xl">

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.24em] text-ember">
                                        Curated Vault
                                    </p>

                                    <h3 className="mt-2 text-3xl font-semibold text-white">
                                        Saved Trips
                                    </h3>
                                </div>
                            </div>

                            {savedPreview.length > 0 ? (
                                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                    {savedPreview.map((destination) => (
                                        <Link 
                                            key={destination.slug} 
                                            href={`/destinations/${destination.slug}`}
                                            className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-3 transition hover:bg-white/5 hover:border-white/10"
                                        >
                                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10">
                                                <Image 
                                                    src={destination.image} 
                                                    fill 
                                                    className="object-cover transition group-hover:scale-110" 
                                                    alt={destination.name} 
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-semibold text-white group-hover:text-ember transition truncate">
                                                    {destination.name}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] text-white/40 uppercase tracking-wider">{destination.category}</span>
                                                    <span className="h-0.5 w-0.5 rounded-full bg-white/20" />
                                                    <span className="text-[10px] text-white/40 uppercase tracking-wider truncate">{destination.distance}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-6 text-white/45">
                                    Your bookmarked explorations will appear here.
                                </p>
                            )}

                            <div className="mt-12">
                                <Link href="/saved" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10 hover:border-white/20">
                                    View collection
                                </Link>
                            </div>

                        </div>

                        {/* VISITED PLACES */}
                        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-2xl">

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.24em] text-ember">
                                        Travel Memory Archive
                                    </p>

                                    <h3 className="mt-2 text-3xl font-semibold text-white">
                                        Visited Places
                                    </h3>
                                </div>
                            </div>

                            {visitedPreview.length > 0 ? (
                                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                    {visitedPreview.map((destination) => (
                                        <Link 
                                            key={destination.slug} 
                                            href={`/destinations/${destination.slug}`}
                                            className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-3 transition hover:bg-white/5 hover:border-white/10"
                                        >
                                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10">
                                                <Image 
                                                    src={destination.image} 
                                                    fill 
                                                    className="object-cover transition group-hover:scale-110" 
                                                    alt={destination.name} 
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-semibold text-white group-hover:text-ember transition truncate">
                                                    {destination.name}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] text-white/40 uppercase tracking-wider">{destination.category}</span>
                                                    <span className="h-0.5 w-0.5 rounded-full bg-white/20" />
                                                    <span className="text-[10px] text-white/40 uppercase tracking-wider truncate">{destination.duration}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-6 text-white/45">
                                    Destinations you have explored will appear here as travel memories.
                                </p>
                            )}

                            <div className="mt-12">
                                <Link href="/visited" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10 hover:border-white/20">
                                    View visited places
                                </Link>
                            </div>

                        </div>

                        {/* TRAVEL MEMORIES */}
                        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-2xl">

                            <p className="text-xs uppercase tracking-[0.24em] text-ember">
                                Personal Archive
                            </p>

                            <h3 className="mt-2 text-3xl font-semibold text-white">
                                Travel Journal
                            </h3>

                            {recentMemories.length > 0 ? (
                                <div className="mt-8 space-y-4">
                                    {recentMemories.map((memory) => (
                                        <div 
                                            key={memory.id}
                                            className="rounded-[1.5rem] border border-white/5 bg-white/[0.02] p-6"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ember/70">
                                                        {memory.destinationName} • {memory.mood}
                                                    </p>
                                                    <h4 className="mt-2 text-lg font-semibold text-white">
                                                        {memory.title}
                                                    </h4>
                                                    <div className="mt-3 border-l border-ember/20 pl-4 py-1">
                                                        <p className="text-sm leading-6 text-white/60 line-clamp-2 italic">
                                                            {memory.text}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-[10px] text-white/25 whitespace-nowrap pt-1">
                                                    {getTimeAgo(memory.memoryDate || memory.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-6 text-white/45 mb-8">
                                    Your personal travel reflections and journals will appear here.
                                </p>
                            )}

                            <div className="mt-10">
                                <Link href="/memories" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10 hover:border-white/20">
                                    Open full journal
                                </Link>
                            </div>
                        </div>

                        {/* RECENT DISCUSSIONS */}
                        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-2xl">

                            <p className="text-xs uppercase tracking-[0.24em] text-ember">
                                Community Activity
                            </p>

                            <h3 className="mt-2 text-3xl font-semibold text-white">
                                Recent discussions
                            </h3>

                            {recentComments.length > 0 ? (
                                <div className="mt-8 space-y-4">
                                    {recentComments.map((comment) => {
                                        const destination = destinations.find(d => d.slug === comment.destinationSlug);
                                        return (
                                            <Link 
                                                key={comment.id}
                                                href={`/destinations/${comment.destinationSlug}`}
                                                className="group block rounded-[1.5rem] border border-white/5 bg-white/[0.02] p-5 transition hover:bg-white/[0.05] hover:border-white/10"
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ember/70 group-hover:text-ember transition">
                                                            {destination?.name || "Destination"}
                                                        </p>
                                                        <p className="mt-2 text-sm leading-6 text-white/70 line-clamp-2">
                                                            "{comment.text}"
                                                        </p>
                                                    </div>
                                                    <p className="text-[10px] text-white/25 whitespace-nowrap pt-0.5">
                                                        {getTimeAgo(comment.createdAt)}
                                                    </p>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="mt-6 text-white/45 mb-8">
                                    Your latest discussions and travel memories will appear here.
                                </p>
                            )}

                            <div className="mt-10">
                                <Link href="/destinations" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10 hover:border-white/20">
                                    Explore more
                                </Link>
                            </div>
                        </div>

                    </div>

                </div>
            </section>
        </main>
    );
}