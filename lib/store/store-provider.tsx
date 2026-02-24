"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import type { DataStore } from "./types";
import { createHybridStore } from "./hybrid-store";
import { createLocalStore } from "./local-store";
import { createClient } from "../supabase/client";

const StoreContext = createContext<DataStore | null>(null);

export function useStore(): DataStore {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return store;
}

interface StoreProviderProps {
  readonly user: User | null;
  readonly children: ReactNode;
}

export function StoreProvider({ user, children }: StoreProviderProps) {
  const store = useMemo(() => {
    try {
      const client = createClient();
      return createHybridStore(client, user);
    } catch {
      return createLocalStore();
    }
  }, [user]);

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}
