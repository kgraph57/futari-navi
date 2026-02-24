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

export function trackSimulatorSubmitted(childCount: number) {
  capture("simulator_submitted", { child_count: childCount });
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
// Triage
// ---------------------------------------------------------------------------

export function trackTriageStarted(mode: "guided" | "direct") {
  capture("triage_started", { mode });
}

export function trackTriageEmergencyAnswer(
  questionId: string,
  answer: "yes" | "no",
) {
  capture("triage_emergency_answer", { question_id: questionId, answer });
}

export function trackTriageAgeSelected(ageId: string) {
  capture("triage_age_selected", { age_id: ageId });
}

export function trackTriageSymptomSelected(
  symptomGroup: string,
  symptomSlug?: string,
) {
  capture("triage_symptom_selected", {
    symptom_group: symptomGroup,
    symptom_slug: symptomSlug,
  });
}

export function trackTriageQuestionAnswered(
  symptom: string,
  questionId: string,
  answer: "yes" | "no",
) {
  capture("triage_question_answered", {
    symptom,
    question_id: questionId,
    answer,
  });
}

export function trackTriageResultViewed(symptom: string, severity: string) {
  capture("triage_result_viewed", { symptom, severity });
}

// ---------------------------------------------------------------------------
// Timeline
// ---------------------------------------------------------------------------

export function trackTimelineViewed(childAgeMonths: number) {
  capture("timeline_viewed", { child_age_months: childAgeMonths });
}

export function trackTimelineItemCompleted(itemId: string, category: string) {
  capture("timeline_item_completed", { item_id: itemId, category });
}

export function trackTop3Viewed(childAgeMonths: number) {
  capture("top3_viewed", { child_age_months: childAgeMonths });
}

// ---------------------------------------------------------------------------
// Vaccine Schedule
// ---------------------------------------------------------------------------

export function trackVaccineScheduleViewed(
  childAgeMonths: number,
  completedDoses: number,
  totalDoses: number,
) {
  capture("vaccine_schedule_viewed", {
    child_age_months: childAgeMonths,
    completed_doses: completedDoses,
    total_doses: totalDoses,
  });
}

export function trackVaccineDoseToggled(
  vaccineSlug: string,
  doseNumber: number,
  completed: boolean,
) {
  capture("vaccine_dose_toggled", {
    vaccine_slug: vaccineSlug,
    dose_number: doseNumber,
    completed,
  });
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
// My Page
// ---------------------------------------------------------------------------

export function trackChildRegistered(childCount: number) {
  capture("child_registered", { child_count: childCount });
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
