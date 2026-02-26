"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { useCouple, usePartnerProfile } from "./hooks";
import type { Couple, PartnerProfile } from "@/lib/types";

interface CoupleContextValue {
  readonly couple: Couple | null;
  readonly partner: PartnerProfile | null;
  readonly loading: boolean;
  readonly error: string | null;
  readonly refreshCouple: () => Promise<void>;
}

const CoupleContext = createContext<CoupleContextValue | null>(null);

export function useCoupleContext(): CoupleContextValue {
  const ctx = useContext(CoupleContext);
  if (!ctx) {
    throw new Error("useCoupleContext must be used within CoupleProvider");
  }
  return ctx;
}

interface CoupleProviderProps {
  readonly children: ReactNode;
}

export function CoupleProvider({ children }: CoupleProviderProps) {
  const {
    couple,
    loading: coupleLoading,
    error,
    refresh,
  } = useCouple();

  const { partner, loading: partnerLoading } = usePartnerProfile(
    couple?.id ?? null,
  );

  const value: CoupleContextValue = {
    couple,
    partner,
    loading: coupleLoading || partnerLoading,
    error,
    refreshCouple: refresh,
  };

  return (
    <CoupleContext.Provider value={value}>{children}</CoupleContext.Provider>
  );
}
