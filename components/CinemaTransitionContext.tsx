"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type TransitionData = {
  slug: string;
  imageSrc: string;
  rect: DOMRect;
};

type CinemaTransitionContextType = {
  transition: TransitionData | null;
  triggerTransition: (slug: string, imageSrc: string, rect: DOMRect) => void;
  clearTransition: () => void;
};

const CinemaTransitionContext = createContext<CinemaTransitionContextType>({
  transition: null,
  triggerTransition: () => {},
  clearTransition: () => {},
});

export function useCinemaTransition() {
  return useContext(CinemaTransitionContext);
}

export function CinemaTransitionProvider({ children }: { children: ReactNode }) {
  const [transition, setTransition] = useState<TransitionData | null>(null);

  const triggerTransition = useCallback(
    (slug: string, imageSrc: string, rect: DOMRect) => {
      setTransition({ slug, imageSrc, rect });
    },
    []
  );

  const clearTransition = useCallback(() => {
    setTransition(null);
  }, []);

  return (
    <CinemaTransitionContext.Provider
      value={{ transition, triggerTransition, clearTransition }}
    >
      {children}
    </CinemaTransitionContext.Provider>
  );
}
