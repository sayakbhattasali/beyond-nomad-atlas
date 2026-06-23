"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    serverTimestamp,
    where,
} from "firebase/firestore";
import { MapPinCheck } from "lucide-react";

type Props = {
    destinationSlug: string;
};

export default function VisitDestinationButton({
    destinationSlug,
}: Props) {
    const [user, setUser] = useState<User | null>(null);
    const [visited, setVisited] = useState(false);
    const [loading, setLoading] = useState(true);
    const [docId, setDocId] = useState<string | null>(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (!currentUser) {
                setVisited(false);
                setLoading(false);
                return;
            }

            const q = query(
                collection(db, "visitedDestinations"),
                where("userId", "==", currentUser.uid),
                where("destinationSlug", "==", destinationSlug)
            );

            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                setVisited(true);
                setDocId(snapshot.docs[0].id);
            }

            setLoading(false);
        });

        return () => unsub();
    }, [destinationSlug]);

    const toggleVisited = async () => {
        if (!user) return;

        if (visited && docId) {
            await deleteDoc(doc(db, "visitedDestinations", docId));

            setVisited(false);
            setDocId(null);

            // Broadcast change for real-time UI sync
            window.dispatchEvent(new CustomEvent("visitedStateChanged", { 
                detail: { slug: destinationSlug, visited: false } 
            }));

            return;
        }

        const newDoc = await addDoc(
            collection(db, "visitedDestinations"),
            {
                userId: user.uid,
                destinationSlug,
                createdAt: serverTimestamp(),
            }
        );

        setVisited(true);
        setDocId(newDoc.id);

        // Broadcast change for real-time UI sync
        window.dispatchEvent(new CustomEvent("visitedStateChanged", { 
            detail: { slug: destinationSlug, visited: true } 
        }));
    };

    if (!user || loading) return null;

    return (
        <button
            onClick={toggleVisited}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition backdrop-blur-xl ${visited
                    ? "border-ember/30 bg-ember/15 text-amberSoft"
                    : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                }`}
        >
            <MapPinCheck size={16} fill={visited ? "currentColor" : "none"} />

            {visited ? "Visited" : "Visited?"}
        </button>
    );
}
