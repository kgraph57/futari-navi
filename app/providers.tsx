"use client";

import type { ReactNode } from "react";
import { AuthProvider, useAuth } from "@/lib/auth/auth-provider";
import { StoreProvider } from "@/lib/store/store-provider";
import { PostHogProvider } from "@/lib/analytics/posthog-provider";
import { PageView } from "@/lib/analytics/pageview";
import { RegisterServiceWorker } from "@/lib/pwa/register-sw";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { FeedbackButton } from "@/components/feedback/feedback-button";
import { WebVitals } from "@/app/web-vitals";

function StoreWithAuth({ children }: { readonly children: ReactNode }) {
  const { user } = useAuth();
  return <StoreProvider user={user}>{children}</StoreProvider>;
}

export function Providers({ children }: { readonly children: ReactNode }) {
  return (
    <PostHogProvider>
      <AuthProvider>
        <StoreWithAuth>
          <PageView />
          <WebVitals />
          <RegisterServiceWorker />
          <InstallPrompt />
          <FeedbackButton />
          {children}
        </StoreWithAuth>
      </AuthProvider>
    </PostHogProvider>
  );
}
