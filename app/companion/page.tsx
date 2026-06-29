"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  Send,
  Sparkles,
  User,
  MessageSquare,
  ArrowRight,
  Compass,
  ShieldCheck,
  Clock,
} from "lucide-react";
import Image from "next/image";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

import SectionHeader from "@/components/SectionHeader";
import { MotionDiv, MotionSection, stagger, fadeUp } from "@/components/Motion";

// --- Types & Constants ---

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface MoodOption {
  id: string;
  label: string;
  prompt: string;
  icon: string;
}

const MOOD_OPTIONS: MoodOption[] = [
  { id: "quiet", label: "Quiet Evening", prompt: "I'm looking for a quiet evening escape. Peaceful places with minimal crowds.", icon: "🌙" },
  { id: "solo", label: "Solo Escape", prompt: "I want to disappear for a while. Suggest a solitary spot for introspection.", icon: "🧘" },
  { id: "social", label: "Social Trip", prompt: "Planning a group outing. Looking for vibrant places with good energy.", icon: "🍻" },
  { id: "romantic", label: "Romantic Date", prompt: "I need a romantic setting. Intimate, scenic, and memorable.", icon: "🍷" },
  { id: "reset", label: "Mental Reset", prompt: "I'm feeling mentally exhausted. Need a restorative, low-stimulation environment.", icon: "🌊" },
];

// --- Helper Functions ---

const generateId = (): string => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// --- UI Components ---

const ChatBubble = ({ message, user }: { message: Message; user: FirebaseUser | null }) => {
  const isAssistant = message.role === "assistant";
  const userPhotoURL = user?.photoURL;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex w-full items-start gap-2.5 sm:gap-3 ${
        isAssistant ? "justify-start" : "justify-end"
      }`}
    >
      {/* Companion Avatar */}
      {isAssistant && (
        <div className="relative flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-white/20">
          <Image
            src="/logo.png"
            alt="Companion Logo"
            fill
            sizes="32px"
            className="object-cover scale-[1.4]"
          />
        </div>
      )}

      {/* Message Text Bubble */}
      <div
        className={`rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm transition-all shadow-sm ${
          isAssistant
            ? "max-w-[78%] sm:max-w-[70%] border border-white/5 bg-white/[0.03] text-white/90 backdrop-blur-3xl rounded-tl-none"
            : "max-w-[78%] sm:max-w-[70%] bg-ember text-black font-medium rounded-tr-none"
        }`}
      >
        {/* Sender Username Indicator (WhatsApp group style) */}
        <div 
          className={`mb-0.5 font-bold text-[9px] uppercase tracking-wider ${
            isAssistant ? "text-ember" : "text-black/60"
          }`}
        >
          {isAssistant ? "Virtual Nomad" : (user?.displayName || "Explorer")}
        </div>

        <p className="text-xs sm:text-sm leading-relaxed break-words">{message.content}</p>
        <div
          className={`mt-1.5 flex items-center gap-1 text-[8px] sm:text-[9px] uppercase tracking-tighter opacity-55 ${
            isAssistant ? "text-white/60" : "text-black/60"
          }`}
        >
          <Clock size={8} className="sm:size-[9px]" />
          <span>
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      {/* User Avatar */}
      {!isAssistant && (
        userPhotoURL ? (
          <img
            src={userPhotoURL}
            alt="User Profile"
            className="h-7 w-7 sm:h-8 sm:w-8 shrink-0 rounded-full object-cover ring-1 ring-white/20"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-ember/15 text-ember ring-1 ring-ember/30 shadow-sm">
            <User size={13} className="sm:size-[14px]" />
          </div>
        )
      )}
    </motion.div>
  );
};

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex items-start gap-2.5 sm:gap-3"
  >
    <div className="relative flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-white/20">
      <Image
        src="/logo.png"
        alt="Companion Typing"
        fill
        sizes="32px"
        className="object-cover scale-[1.4]"
      />
    </div>
    <div className="flex gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-2.5 backdrop-blur-3xl shadow-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-ember/60 animate-bounce [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 rounded-full bg-ember/60 animate-bounce [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 rounded-full bg-ember/60 animate-bounce" />
    </div>
  </motion.div>
);

// --- Main Page Component ---

export default function CompanionPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isProcessing]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isProcessing) return;

      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsProcessing(true);

      try {
        const response = await fetch("/api/nomad", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            message: content,
            history: messages.slice(-6),
          }),
        });

        const data = await response.json();
        
        const assistantMessage: Message = {
          id: generateId(),
          role: "assistant",
          content: data.text || "I'm sorry, I couldn't process that. Try again.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        console.error("AI Error:", error);
        const errorMessage: Message = {
          id: generateId(),
          role: "assistant",
          content: "The atlas connection is weak. Let me try to sync again in a moment.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsProcessing(false);
      }
    },
    [isProcessing, messages]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      sendMessage(input);
    }
  };

  const handleMoodSelect = (prompt: string) => {
    if (!isProcessing) {
      sendMessage(prompt);
    }
  };

  return (
    <main className="page-shell px-4 sm:px-6 pb-20 sm:pb-24">
      <MotionSection
        initial="hidden"
        animate="show"
        variants={stagger}
        className="mx-auto max-w-7xl"
      >
        {/* Header Section */}
        <div className="pb-6 sm:pb-12 pt-12">
          <SectionHeader
            eyebrow="Virtual Nomad"
            title="Your Digital Guide to the Atlas."
            description="Connect with a digital explorer who knows every hidden path of the Beyond Nomad Atlas. Share your mood, and let the nomad map your next escape."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8">
          {/* Sidebar - Mood Selectors */}
          <MotionDiv variants={fadeUp} className="order-2 lg:order-none lg:col-span-4">
            <div className="rounded-2xl sm:rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-4 sm:p-6 backdrop-blur-3xl">
              <div className="mb-4 sm:mb-6 flex items-center gap-2 border-b border-white/10 pb-3 sm:pb-4">
                <Compass size={16} className="text-ember sm:size-[18px]" />
                <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-white/60">
                  Emotional Compass
                </h3>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {MOOD_OPTIONS.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => handleMoodSelect(mood.prompt)}
                    disabled={isProcessing}
                    className="group flex w-full items-center justify-between rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.02] p-3 sm:p-4 text-left transition-all hover:border-ember/40 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-lg sm:text-xl">{mood.icon}</span>
                      <span className="text-xs sm:text-sm font-medium text-white/80 group-hover:text-white">
                        {mood.label}
                      </span>
                    </div>
                    <ArrowRight
                      size={14}
                      className="text-white/20 transition-all group-hover:translate-x-1 group-hover:text-ember sm:size-[16px]"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Privacy Card */}
            <div className="mt-4 sm:mt-6 rounded-2xl sm:rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-4 sm:p-6 backdrop-blur-3xl">
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-medium text-emerald-400">
                <ShieldCheck size={12} className="sm:size-[14px]" />
                <span className="uppercase tracking-widest">Privacy Shield Active</span>
              </div>
              <p className="mt-2 sm:mt-3 text-[11px] sm:text-xs leading-relaxed text-white/50">
                Conversations are ephemeral. Your emotional data never leaves this session. All recommendations are processed with real-time environmental context.
              </p>
            </div>
          </MotionDiv>

          {/* Chat Interface */}
          <MotionDiv variants={fadeUp} className="order-1 lg:order-none lg:col-span-8">
            <div className="flex h-[72vh] sm:h-[600px] lg:h-[700px] flex-col overflow-hidden rounded-2xl sm:rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-3xl">
              {/* Chat Header */}
              <div className="flex items-center gap-2 sm:gap-3 border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
                  <MessageSquare size={15} className="text-ember sm:size-[18px]" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-white">Virtual Nomad</h3>
                  <p className="text-[9px] sm:text-[11px] uppercase tracking-widest text-white/40">
                    Exploring Beyond Nomad Atlas
                  </p>
                </div>
              </div>

              {/* Messages Container */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6"
              >
                {messages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex h-full flex-col items-center justify-center text-center px-4"
                  >
                    <div className="mx-auto mb-4 sm:mb-6 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-white/5 text-white/20 ring-1 ring-white/10">
                      <MessageSquare size={28} className="sm:size-[32px]" />
                    </div>
                    <h4 className="text-base sm:text-lg font-semibold text-white">Initialize Session</h4>
                    <p className="mx-auto mt-2 max-w-xs text-xs sm:text-sm text-white/50">
                      Describe your current state or select a mood above to begin the mapping.
                    </p>
                  </motion.div>
                ) : (
                  <LayoutGroup>
                    {messages.map((message) => (
                      <ChatBubble key={message.id} message={message} user={user} />
                    ))}
                  </LayoutGroup>
                )}

                <AnimatePresence>
                  {isProcessing && <TypingIndicator />}
                </AnimatePresence>
              </div>

              {/* Input Area */}
              <div className="border-t border-white/10 p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="relative flex items-center gap-2 sm:gap-3">
                  <input
                     ref={inputRef}
                     type="text"
                     value={input}
                     onChange={(e) => setInput(e.target.value)}
                     placeholder="Describe your current wavelength..."
                     disabled={isProcessing}
                     className="flex-1 rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.02] px-3 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm text-white placeholder:text-white/30 focus:border-ember/50 focus:outline-none focus:ring-1 focus:ring-ember/20 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isProcessing}
                    className="inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-ember text-black transition hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
                  >
                    <Send size={16} className="sm:size-[18px]" />
                  </button>
                </form>
                <p className="mt-2 sm:mt-3 text-center text-[8px] sm:text-[10px] uppercase tracking-widest text-white/30">
                  Press Enter to send · Escapes generated with ambient context
                </p>
              </div>
            </div>
          </MotionDiv>
        </div>
      </MotionSection>
    </main>
  );
}