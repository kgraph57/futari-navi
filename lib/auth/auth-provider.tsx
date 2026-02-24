"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User, Session } from "@supabase/supabase-js";
import { createClient } from "../supabase/client";

interface AuthState {
  readonly user: User | null;
  readonly session: Session | null;
  readonly loading: boolean;
}

interface AuthContextValue extends AuthState {
  readonly configured: boolean;
  readonly signInWithEmail: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null }>;
  readonly signUpWithEmail: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null }>;
  readonly signInWithOAuth: (
    provider: "google" | "line",
  ) => Promise<{ error: string | null }>;
  readonly signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

interface AuthProviderProps {
  readonly children: ReactNode;
}

const noopAuth: AuthContextValue = {
  user: null,
  session: null,
  loading: false,
  configured: false,
  signInWithEmail: async () => ({ error: "Supabase not configured" }),
  signUpWithEmail: async () => ({ error: "Supabase not configured" }),
  signInWithOAuth: async () => ({ error: "Supabase not configured" }),
  signOut: async () => {},
};

function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: isSupabaseConfigured(),
  });

  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (!configured) return;

    let supabase: ReturnType<typeof createClient>;
    try {
      supabase = createClient();
    } catch {
      setState((prev) => ({ ...prev, loading: false }));
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        user: session?.user ?? null,
        session,
        loading: false,
      });
    });

    return () => subscription.unsubscribe();
  }, [configured]);

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      if (!configured) return { error: "Supabase not configured" };
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error: error?.message ?? null };
    },
    [configured],
  );

  const signUpWithEmail = useCallback(
    async (email: string, password: string) => {
      if (!configured) return { error: "Supabase not configured" };
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      return { error: error?.message ?? null };
    },
    [configured],
  );

  const signInWithOAuth = useCallback(
    async (provider: "google" | "line") => {
      if (!configured) return { error: "Supabase not configured" };
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      return { error: error?.message ?? null };
    },
    [configured],
  );

  const signOut = useCallback(async () => {
    if (!configured) return;
    const supabase = createClient();
    await supabase.auth.signOut();
  }, [configured]);

  if (!configured) {
    return (
      <AuthContext.Provider value={noopAuth}>{children}</AuthContext.Provider>
    );
  }

  const value: AuthContextValue = {
    ...state,
    configured: true,
    signInWithEmail,
    signUpWithEmail,
    signInWithOAuth,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
