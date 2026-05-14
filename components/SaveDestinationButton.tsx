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
import { Bookmark } from "lucide-react";

type Props = {
    destinationSlug: string;
};

export default function SaveDestinationButton({
    destinationSlug,
}: Props) {
    const [user, setUser] = useState<User | null>(null);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [docId, setDocId] = useState<string | null>(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (!currentUser) {
                setSaved(false);
                setLoading(false);
                return;
            }

            const q = query(
                collection(db, "savedDestinations"),
                where("userId", "==", currentUser.uid),
                where("destinationSlug", "==", destinationSlug)
            );

            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                setSaved(true);
                setDocId(snapshot.docs[0].id);
            }

            setLoading(false);
        });

        return () => unsub();
    }, [destinationSlug]);

    const toggleSave = async () => {
        if (!user) return;

        if (saved && docId) {
            await deleteDoc(doc(db, "savedDestinations", docId));

            setSaved(false);
            setDocId(null);

            return;
        }

        const newDoc = await addDoc(
            collection(db, "savedDestinations"),
            {
                userId: user.uid,
                destinationSlug,
                createdAt: serverTimestamp(),
            }
        );

        setSaved(true);
        setDocId(newDoc.id);
    };

    if (!user || loading) return null;

    return (
        <button
            onClick={toggleSave}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition backdrop-blur-xl ${saved
                    ? "border-ember/30 bg-ember/15 text-amberSoft"
                    : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                }`}
        >
            <Bookmark size={16} fill={saved ? "currentColor" : "none"} />

            {saved ? "Saved" : "Save"}
        </button>
    );
}