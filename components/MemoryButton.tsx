"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, limit, Timestamp } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { Book, PenLine, Sparkles, X, Heart, CloudRain, Moon, Zap, Coffee, Clock } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type Mood = "Peaceful" | "Nostalgic" | "Rainy" | "Healing" | "Chaotic" | "Late-night" | "Bittersweet" | "Adventurous";

const moods: { label: Mood; icon: any; color: string }[] = [
    { label: "Peaceful", icon: Heart, color: "text-green-400" },
    { label: "Nostalgic", icon: Clock, color: "text-amber-400" },
    { label: "Rainy", icon: CloudRain, color: "text-blue-400" },
    { label: "Healing", icon: Sparkles, color: "text-rose-400" },
    { label: "Chaotic", icon: Zap, color: "text-yellow-400" },
    { label: "Late-night", icon: Moon, color: "text-indigo-400" },
    { label: "Bittersweet", icon: Coffee, color: "text-orange-400" },
    { label: "Adventurous", icon: Sparkles, color: "text-emerald-400" },
];

export default function MemoryButton({ destinationSlug, destinationName }: { destinationSlug: string; destinationName: string }) {
    const [user, setUser] = useState<User | null>(null);
    const [visited, setVisited] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [selectedMood, setSelectedMood] = useState<Mood>("Peaceful");
    const [memoryDate, setMemoryDate] = useState<string>(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (!currentUser) {
                setVisited(false);
                setLoading(false);
                return;
            }

            // Check if visited
            const q = query(
                collection(db, "visitedDestinations"),
                where("userId", "==", currentUser.uid),
                where("destinationSlug", "==", destinationSlug)
            );
            const snapshot = await getDocs(q);
            setVisited(!snapshot.empty);
            setLoading(false);
        });

        const handleVisitedChange = (e: any) => {
            if (e.detail.slug === destinationSlug) {
                setVisited(e.detail.visited);
            }
        };

        window.addEventListener("visitedStateChanged", handleVisitedChange);

        return () => {
            unsub();
            window.removeEventListener("visitedStateChanged", handleVisitedChange);
        };
    }, [destinationSlug]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !title || !text) return;

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "memories"), {
                userId: user.uid,
                destinationSlug,
                destinationName,
                title,
                text,
                mood: selectedMood,
                memoryDate: Timestamp.fromDate(new Date(memoryDate)),
                createdAt: serverTimestamp(),
            });
            setShowModal(false);
            setTitle("");
            setText("");
        } catch (error) {
            console.error("Error saving memory:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading || !visited) return null;

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 rounded-full border border-ember/30 bg-ember/10 px-4 py-2 text-sm font-medium text-amberSoft transition hover:bg-ember/20 active:scale-95"
            >
                <PenLine size={16} />
                Write Journal
            </button>

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] overflow-y-auto px-4 sm:px-6">
                        {/* BACKDROP - FIXED */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                        />

                        {/* CONTENT WRAPPER - SCROLLABLE & TOP-ALIGNED */}
                        <div className="relative mx-auto flex min-h-full items-start justify-center pb-20 pt-28">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                                className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-charcoal p-6 shadow-2xl md:p-7"
                            >
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="absolute right-5 top-5 text-white/30 hover:text-white transition"
                                >
                                    <X size={20} />
                                </button>

                                <div className="flex items-center gap-3 mb-5">
                                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-ember/15 text-ember">
                                        <Book size={20} />
                                    </span>
                                    <div>
                                        <h2 className="text-xl font-semibold text-white leading-tight">Travel Journal</h2>
                                        <p className="text-xs text-white/40 italic">Preserving {destinationName}</p>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ember/70 mb-1.5">Memory Title</label>
                                            <input
                                                type="text"
                                                required
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder="Name this moment..."
                                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-ember/50 focus:outline-none transition"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ember/70 mb-1.5">Date of Experience</label>
                                            <input
                                                type="date"
                                                required
                                                value={memoryDate}
                                                onChange={(e) => setMemoryDate(e.target.value)}
                                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-ember/50 focus:outline-none transition [color-scheme:dark]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ember/70 mb-1.5">Your Story</label>
                                        <textarea
                                            required
                                            rows={3}
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                            placeholder="Record your personal reflections..."
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-ember/50 focus:outline-none transition resize-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ember/70 mb-2">Vibe / Mood</label>
                                        <div className="flex flex-wrap gap-1.5">
                                            {moods.map((m) => {
                                                const Icon = m.icon;
                                                const active = selectedMood === m.label;
                                                return (
                                                    <button
                                                        key={m.label}
                                                        type="button"
                                                        onClick={() => setSelectedMood(m.label)}
                                                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] transition ${active
                                                            ? "border-ember bg-ember text-black font-bold"
                                                            : "border-white/10 bg-white/5 text-white/50 hover:bg-white/10"
                                                            }`}
                                                    >
                                                        <Icon size={12} />
                                                        {m.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full rounded-full bg-ember py-4 text-sm font-bold text-black transition hover:bg-amberSoft disabled:opacity-50 active:scale-[0.98]"
                                        >
                                            {isSubmitting ? "Preserving..." : "Preserve Memory"}
                                        </button>

                                        <p className="mt-4 text-center text-[10px] text-white/25 italic px-4">
                                            “Unlike discussions, journal memories remain private to your personal journal.”
                                        </p>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
