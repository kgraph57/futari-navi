import posthog from "posthog-js";

function capture(event: string, properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  posthog.capture(event, properties);
}

// ---------------------------------------------------------------------------
// Simulator
// ---------------------------------------------------------------------------

export function trackSimulatorStarted() {
  capture("simulator_started");
}

export function trackSimulatorStepCompleted(step: number, stepLabel: string) {
  capture("simulator_step_completed", { step, step_label: stepLabel });
}

export function trackSimulatorSubmitted() {
  capture("simulator_submitted");
}

export function trackSimulatorResultsViewed(
  eligibleCount: number,
  totalAnnualEstimate: number,
) {
  capture("simulator_results_viewed", {
    eligible_count: eligibleCount,
    total_annual_estimate: totalAnnualEstimate,
  });
}

// ---------------------------------------------------------------------------
// Timeline
// ---------------------------------------------------------------------------

export function trackTimelineViewed() {
  capture("timeline_viewed");
}

export function trackTimelineItemCompleted(itemId: string, category: string) {
  capture("timeline_item_completed", { item_id: itemId, category });
}

// ---------------------------------------------------------------------------
// Share
// ---------------------------------------------------------------------------

export function trackShareClicked(
  contentType: string,
  contentId: string,
  method: "native" | "clipboard",
) {
  capture("share_clicked", {
    content_type: contentType,
    content_id: contentId,
    method,
  });
}

// ---------------------------------------------------------------------------
// CTA Clicks
// ---------------------------------------------------------------------------

export function trackCTAClick(ctaName: string, location: string) {
  capture("cta_click", { cta_name: ctaName, location });
}

// ---------------------------------------------------------------------------
// Articles
// ---------------------------------------------------------------------------

export function trackArticleViewed(
  slug: string,
  category: string,
  volume?: number,
) {
  capture("article_viewed", { slug, category, volume });
}

export function trackArticleBookmarked(slug: string, bookmarked: boolean) {
  capture("article_bookmark_toggled", { slug, bookmarked });
}

// ---------------------------------------------------------------------------
// Newsletter
// ---------------------------------------------------------------------------

export function trackNewsletterSignupClicked(location: string) {
  capture("newsletter_signup_clicked", { location });
}

// ---------------------------------------------------------------------------
// Feedback
// ---------------------------------------------------------------------------

export function trackFeedbackSubmitted(rating: number, comment?: string) {
  capture("feedback_submitted", { rating, comment });
}

// ---------------------------------------------------------------------------
// Triage
// ---------------------------------------------------------------------------

export function trackTriageStarted() {
  capture("triage_started");
}

export function trackTriageEmergencyAnswer(answer: string) {
  capture("triage_emergency_answer", { answer });
}

export function trackTriageAgeSelected(ageGroup: string) {
  capture("triage_age_selected", { age_group: ageGroup });
}

export function trackTriageSymptomSelected(symptom: string) {
  capture("triage_symptom_selected", { symptom });
}

export function trackTriageQuestionAnswered(
  questionId: string,
  answer: string,
) {
  capture("triage_question_answered", { question_id: questionId, answer });
}

export function trackTriageResultViewed(severity: string) {
  capture("triage_result_viewed", { severity });
}
