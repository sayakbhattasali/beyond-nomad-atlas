"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    where,
    Timestamp,
} from "firebase/firestore";

type Comment = {
    id: string;
    text: string;
    userName: string;
    userPhoto: string;
    createdAt?: any;
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

export default function DestinationComments({ destinationSlug }: { destinationSlug: string }) {
    const [user, setUser] = useState<User | null>(null);
    const [text, setText] = useState("");
    const [comments, setComments] = useState<Comment[]>([]);
    const [visibleComments, setVisibleComments] = useState(3);
    const [posting, setPosting] = useState(false);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, setUser);
        return () => unsub();
    }, []);

    useEffect(() => {
        const q = query(
            collection(db, "comments"),
            where("destinationSlug", "==", destinationSlug),
            orderBy("createdAt", "desc")
        );

        const unsub = onSnapshot(q, (snapshot) => {
            setComments(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Comment[]
            );
        });

        return () => unsub();
    }, [destinationSlug]);

    const postComment = async () => {
        if (!user || !text.trim()) return;

        setPosting(true);

        await addDoc(collection(db, "comments"), {
            destinationSlug,
            text: text.trim(),
            userId: user.uid,
            userName: user.displayName || "Traveller",
            userPhoto: user.photoURL || "",
            createdAt: serverTimestamp(),
        });

        setText("");
        setPosting(false);
    };

    return (
        <section className="glass rounded-[2rem] p-6 md:p-8">
            <h2 className="mb-2 text-2xl font-semibold">Comments</h2>
            <p className="mb-6 text-sm text-white/55">
                Share timing tips, route updates, crowd notes or small travel memories.
            </p>

            {user ? (
                <div className="mb-8 space-y-3">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        maxLength={400}
                        placeholder="Write a short travel note..."
                        className="min-h-28 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-ember/50"
                    />

                    <button
                        onClick={postComment}
                        disabled={posting || !text.trim()}
                        className="rounded-full bg-ember px-5 py-2 text-sm font-semibold text-black transition hover:bg-amberSoft disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {posting ? "Posting..." : "Post note"}
                    </button>
                </div>
            ) : (
                <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm text-white/60">
                    Sign in to join the comments.
                </div>
            )}

            <div className="max-h-[520px] space-y-4 overflow-y-auto pr-2">
                {comments.length === 0 ? (
                    <p className="text-sm text-white/45">No notes yet. Be the first one here.</p>
                ) : (
                    comments.slice(0, visibleComments).map((comment) => (
                        <div key={comment.id} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                            <div className="mb-3 flex items-center gap-3">
                                {comment.userPhoto && (
                                    <img
                                        src={comment.userPhoto}
                                        alt={comment.userName}
                                        className="h-8 w-8 rounded-full object-cover"
                                    />
                                )}
                                <div>
                                    <p className="text-sm font-semibold text-white">
                                        {comment.userName.split(" ")[0]}
                                    </p>

                                    <p className="text-xs text-white/35">
                                        {getTimeAgo(comment.createdAt)}
                                    </p>
                                </div>
                            </div>

                            <p className="text-sm leading-6 text-white/68">{comment.text}</p>
                        </div>
                    ))
                )}
            </div>
            {comments.length > visibleComments && (
                <div className="mt-5 flex justify-center">
                    <button
                        onClick={() => setVisibleComments((prev) => prev + 3)}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-sm text-white/70 transition hover:bg-white/[0.08]"
                    >
                        Load more comments
                    </button>
                </div>
            )}
        </section>
    );
}