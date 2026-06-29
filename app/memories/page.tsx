"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, getDocs, query, where, orderBy, Timestamp, deleteDoc, doc } from "firebase/firestore";
import { destinations } from "@/data/destinations";
import SectionHeader from "@/components/SectionHeader";
import { MotionSection, MotionDiv, stagger } from "@/components/Motion";
import Link from "next/link";
import { Book, ArrowLeft, Heart, Clock, CloudRain, Sparkles, Zap, Moon, Coffee, Trash2, Quote } from "lucide-react";

type Memory = {
    id: string;
    title: string;
    text: string;
    mood: string;
    destinationSlug: string;
    destinationName: string;
    memoryDate: Timestamp;
    createdAt: Timestamp;
};

const moodIcons: Record<string, any> = {
    "Peaceful": Heart,
    "Nostalgic": Clock,
    "Rainy": CloudRain,
    "Healing": Sparkles,
    "Chaotic": Zap,
    "Late-night": Moon,
    "Bittersweet": Coffee,
    "Adventurous": Sparkles,
};

function formatDate(timestamp: Timestamp) {
    return timestamp.toDate().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

export default function MemoriesPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [memories, setMemories] = useState<Memory[]>([]);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (!currentUser) {
                setLoading(false);
                return;
            }

            try {
                const q = query(
                    collection(db, "memories"),
                    where("userId", "==", currentUser.uid),
                    orderBy("memoryDate", "desc")
                );

                const snapshot = await getDocs(q);
                const memoryData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Memory));
                setMemories(memoryData);
            } catch (error) {
                console.error("Error fetching memories:", error);
            } finally {
                setLoading(false);
            }
        });

        return () => unsub();
    }, []);

    const deleteMemory = async (id: string) => {
        if (!confirm("Are you sure you want to delete this memory? It will be removed from your journal forever.")) return;

        try {
            await deleteDoc(doc(db, "memories", id));
            setMemories(memories.filter(m => m.id !== id));
        } catch (error) {
            console.error("Error deleting memory:", error);
        }
    };

    if (loading) {
        return (
            <main className="page-shell flex min-h-[60vh] items-center justify-center px-6">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-ember border-t-transparent" />
                    <p className="mt-4 text-sm font-medium text-white/40 uppercase tracking-widest">Opening Archive...</p>
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
                            <Book size={40} />
                        </div>
                        <h1 className="text-3xl font-semibold text-white md:text-4xl">Sign in to view your journal</h1>
                        <p className="mx-auto mt-4 max-w-md text-lg text-white/50">
                            Your personal travel memories and journals are stored securely in your account.
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
        <main className="page-shell px-6 pb-24" style={{ '--glow-color': 'transparent' } as React.CSSProperties}>
            <MotionSection initial="hidden" animate="show" variants={stagger} className="mx-auto max-w-5xl">
                <div className="pb-12 pt-12">
                    <SectionHeader
                        eyebrow="Personal Archive"
                        title="Travel Journal"
                        description="A cinematic archive of your emotional journeys and personal reflections across the nomad journey."
                    />
                </div>

                {memories.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-y-14 items-start relative pb-12">
                        {memories.map((memory, index) => {
                            const Icon = moodIcons[memory.mood] || Book;
                            
                            // Non-symmetric layout configurations for a digital investigation board
                            const layoutConfigs = [
                                {
                                    colSpan: "md:col-span-7",
                                    rotation: "rotate-[-1deg]",
                                    paperClass: "hazy-lined border-l-2 border-ember/30 pl-6", // glowing margin line
                                    cardPadding: "p-8 pt-10",
                                    cardBg: "",
                                    tapeLeft: "15%",
                                    tapeRotation: "-rotate-3"
                                },
                                {
                                    colSpan: "md:col-span-5 md:translate-y-6",
                                    rotation: "rotate-[1.5deg]",
                                    paperClass: "hazy-dotted",
                                    cardPadding: "p-6 pb-12 pt-8", // Polaroid bottom margin spacing
                                    cardBg: "",
                                    tapeLeft: "60%",
                                    tapeRotation: "rotate-4"
                                },
                                {
                                    colSpan: "md:col-span-5 md:-translate-y-4",
                                    rotation: "rotate-[-2deg]",
                                    paperClass: "hazy-grid",
                                    cardPadding: "p-7 pt-9",
                                    cardBg: "",
                                    tapeLeft: "25%",
                                    tapeRotation: "-rotate-[-2deg]"
                                },
                                {
                                    colSpan: "md:col-span-7 md:translate-y-4",
                                    rotation: "rotate-[0.5deg]",
                                    paperClass: "hazy-lined border-l-2 border-ember/30 pl-6",
                                    cardPadding: "p-8 pt-10",
                                    cardBg: "",
                                    tapeLeft: "75%",
                                    tapeRotation: "rotate-2"
                                }
                            ];

                            const layout = layoutConfigs[index % layoutConfigs.length];

                            return (
                                <MotionDiv
                                    key={memory.id}
                                    variants={{
                                        hidden: { opacity: 0, y: 30 },
                                        show: { opacity: 1, y: 0 }
                                    }}
                                    className={`relative w-full ${layout.colSpan} ${layout.rotation} transition duration-500 hover:scale-[1.01]`}
                                >
                                    {/* Sleek Frosted Glass Tape Element */}
                                    <div 
                                        className={`absolute -top-3.5 w-16 h-6 bg-white/15 border-x border-y border-white/20 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.5)] opacity-80 pointer-events-none z-20 ${layout.tapeRotation}`}
                                        style={{ left: layout.tapeLeft }}
                                    />

                                    {/* Content Card with Cinematic Ledger texture */}
                                    <div className={`hazy-glass-card relative rounded-[2.5rem] ${layout.cardPadding} ${layout.paperClass} group`}>
                                        <div className="flex items-center gap-3 mb-5">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ember/80">
                                                {formatDate(memory.memoryDate || memory.createdAt)}
                                            </span>
                                            <span className="h-1 w-1 rounded-full bg-white/20" />
                                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-wider text-white/60 font-medium">
                                                <Icon size={10} className="text-ember" />
                                                {memory.mood}
                                            </div>
                                        </div>

                                        <div className="flex items-start justify-between gap-4">
                                            <Link href={`/destinations/${memory.destinationSlug}`} className="group/link block flex-1 min-w-0">
                                                <h3 className="text-xl font-bold text-white group-hover/link:text-ember transition truncate">
                                                    {memory.title}
                                                </h3>
                                                <p className="mt-1 text-sm text-white/40 mb-5 font-medium">
                                                    at {memory.destinationName}
                                                </p>
                                            </Link>
                                            
                                            <button 
                                                onClick={() => deleteMemory(memory.id)}
                                                className="opacity-0 group-hover:opacity-100 p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-red-500 transition shrink-0"
                                                title="Delete entry"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        <div className="relative px-4 py-3 mt-2 border-l-2 border-ember/30 bg-black/20 rounded-r-xl">
                                            <Quote size={18} className="absolute -top-2.5 -left-2 text-ember/20" />
                                            <p className="text-white/90 leading-relaxed text-sm whitespace-pre-wrap italic break-words font-normal">
                                                {memory.text}
                                            </p>
                                        </div>
                                    </div>
                                </MotionDiv>
                            );
                        })}
                    </div>
                ) : (
                    <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-16 text-center backdrop-blur-3xl md:p-24">
                        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-white/5 text-white/20 ring-1 ring-white/10">
                            <Book size={40} />
                        </div>
                        <h2 className="text-2xl font-semibold text-white md:text-3xl">Journal is empty</h2>
                        <p className="mx-auto mt-4 max-w-sm text-white/50 leading-relaxed">
                            Start marking destinations as visited and begin documenting your personal reflections here.
                        </p>
                        <Link href="/destinations" className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 font-semibold text-white transition hover:bg-white/10 hover:scale-105 active:scale-95">
                            <ArrowLeft size={18} />
                            Explore Destinations
                        </Link>
                    </div>
                )}
            </MotionSection>
        </main>
    );
}
