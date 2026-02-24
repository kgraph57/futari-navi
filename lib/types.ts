export type AgeGroup =
  | "0-6mo"
  | "6-12mo"
  | "1-3yr"
  | "3-6yr"
  | "6-12yr"
  | "all";

export type ArticleCategory =
  | "infectious-disease"
  | "allergy"
  | "skin"
  | "vaccination"
  | "development"
  | "nutrition"
  | "emergency"
  | "checkup"
  | "mental-health"
  | "municipal-service";

export interface ArticleFrontmatter {
  readonly slug: string;
  readonly vol: number;
  readonly title: string;
  readonly description: string;
  readonly category: ArticleCategory;
  readonly ageGroups: readonly AgeGroup[];
  readonly publishedAt: string;
  readonly keyPoints: readonly string[];
  readonly qaCount: number;
  readonly referenceCount: number;
  readonly relatedSlugs: readonly string[];
}

export interface Article {
  readonly frontmatter: ArticleFrontmatter;
  readonly content: string;
}

export interface ProgramApplicationStep {
  readonly step: number;
  readonly title: string;
  readonly description: string;
  readonly tip: string | null;
}

export interface ProgramRequiredDocument {
  readonly name: string;
  readonly obtainHow: string;
  readonly notes: string | null;
  readonly downloadUrl: string | null;
}

export interface ProgramApplicationMethod {
  readonly method: "online" | "counter" | "mail";
  readonly label: string;
  readonly description: string;
  readonly url: string | null;
  readonly address: string | null;
  readonly hours: string | null;
}

export interface ProgramFaq {
  readonly question: string;
  readonly answer: string;
}

export interface Program {
  readonly slug: string;
  readonly name: string;
  readonly description: string;
  readonly category: "medical" | "childcare" | "financial" | "support";
  readonly eligibility: ProgramEligibility;
  readonly amount: ProgramAmount;
  readonly applicationUrl: string;
  readonly deadline: string | null;
  readonly notes: string;
  readonly applicationSteps?: ReadonlyArray<ProgramApplicationStep>;
  readonly requiredDocuments?: ReadonlyArray<ProgramRequiredDocument>;
  readonly applicationMethods?: ReadonlyArray<ProgramApplicationMethod>;
  readonly faq?: ReadonlyArray<ProgramFaq>;
  readonly relatedProgramSlugs?: readonly string[];
  readonly processingTime?: string;
}

export interface ProgramEligibility {
  readonly maxAge: number | null;
  readonly minAge: number | null;
  readonly incomeLimit: number | null;
  readonly residency: "minato" | "tokyo" | "japan";
  readonly conditions: readonly string[];
}

export interface ProgramAmount {
  readonly type: "fixed" | "variable" | "subsidy";
  readonly value: number | null;
  readonly unit: "yen" | "percent" | "yen-per-month";
  readonly description: string;
}

export interface SimulatorInput {
  readonly children: readonly ChildInfo[];
  readonly householdIncome: IncomeRange;
  readonly householdType: "two-parent" | "single-parent";
  readonly workStatus: "both-working" | "one-working" | "neither";
  readonly district: string;
}

export interface ChildInfo {
  readonly birthDate: string;
  readonly careType: "home" | "nursery" | "kindergarten" | "school";
}

export type IncomeRange =
  | "under-300"
  | "300-500"
  | "500-700"
  | "700-1000"
  | "over-1000";

export interface SimulatorResult {
  readonly totalAnnualEstimate: number;
  readonly eligiblePrograms: readonly EligibleProgram[];
}

export interface EligibleProgram {
  readonly program: Program;
  readonly estimatedAmount: number;
  readonly actionItems: readonly string[];
}

export type TriageSeverity =
  | "emergency"
  | "call-8000"
  | "next-day"
  | "home-care";

export interface TriageResult {
  readonly severity: TriageSeverity;
  readonly title: string;
  readonly description: string;
  readonly actions: readonly string[];
}

export const CATEGORY_LABELS: Record<ArticleCategory, string> = {
  "infectious-disease": "感染症",
  allergy: "アレルギー",
  skin: "皮膚",
  vaccination: "予防接種",
  development: "発達",
  nutrition: "栄養・食事",
  emergency: "救急",
  checkup: "健診",
  "mental-health": "メンタルヘルス",
  "municipal-service": "行政サービス",
} as const;

export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  "0-6mo": "0〜6ヶ月",
  "6-12mo": "6〜12ヶ月",
  "1-3yr": "1〜3歳",
  "3-6yr": "3〜6歳",
  "6-12yr": "6〜12歳",
  all: "全年齢",
} as const;

export type VaccineType = "routine" | "optional";

export interface VaccineDose {
  readonly doseNumber: number;
  readonly label: string;
  readonly ageMonthsMin: number;
  readonly ageMonthsMax: number;
  readonly ageMonthsStandard: number;
}

export interface Vaccine {
  readonly slug: string;
  readonly name: string;
  readonly nameShort: string;
  readonly type: VaccineType;
  readonly disease: string;
  readonly description: string;
  readonly doses: readonly VaccineDose[];
  readonly sideEffects: string;
  readonly contraindications: string;
  readonly relatedArticleSlug: string | null;
  readonly relatedProgramSlug: string | null;
  readonly knowVpdUrl: string | null;
  readonly faq?: ReadonlyArray<VaccineFaq>;
}

export interface VaccineFaq {
  readonly question: string;
  readonly answer: string;
  readonly category?: string;
}

export interface VaccinationStep {
  readonly step: number;
  readonly title: string;
  readonly description: string;
  readonly tip: string | null;
  readonly where: string | null;
  readonly url: string | null;
}

export type VaccinationFaqCategory =
  | "schedule"
  | "safety"
  | "side-effects"
  | "practical";

export interface VaccinationFaq {
  readonly question: string;
  readonly answer: string;
  readonly category: VaccinationFaqCategory;
}

export interface VaccinationEvidence {
  readonly claim: string;
  readonly evidence: string;
  readonly source: string;
  readonly sourceUrl: string | null;
}

export type CheckupVenue = "hospital" | "public" | "clinic" | "school";

export interface CheckupDoctorCheck {
  readonly area: string;
  readonly detail: string;
  readonly doctorNote: string;
}

export interface CheckupPreparation {
  readonly item: string;
  readonly detail: string;
}

export interface CheckupFaq {
  readonly question: string;
  readonly answer: string;
  readonly actionUrl?: string;
  readonly actionLabel?: string;
}

export interface Checkup {
  readonly slug: string;
  readonly name: string;
  readonly nameShort: string;
  readonly ageMonths: number;
  readonly ageLabel: string;
  readonly venue: CheckupVenue;
  readonly venueLabel: string;
  readonly cost: string;
  readonly isMandatory: boolean;
  readonly description: string;
  readonly whatDoctorChecks: readonly CheckupDoctorCheck[];
  readonly preparation: readonly CheckupPreparation[];
  readonly faq: readonly CheckupFaq[];
  readonly tips: readonly string[];
  readonly relatedArticles?: readonly CheckupRelatedArticle[];
  readonly nextCheckup: string | null;
  readonly officialUrl: string | null;
}

export interface CheckupRelatedArticle {
  readonly slug: string;
  readonly title: string;
  readonly vol: number;
}

export type NurseryType =
  | "licensed"
  | "certified"
  | "small-scale"
  | "kodomoen"
  | "minato-room";

export type NurseryArea =
  | "shiba-mita"
  | "azabu"
  | "akasaka-aoyama"
  | "takanawa-shirokane"
  | "daiba-shibaura";

export interface NurseryHours {
  readonly standard: string;
  readonly extended: string | null;
  readonly shortTime: string | null;
}

export interface Nursery {
  readonly slug: string;
  readonly name: string;
  readonly type: NurseryType;
  readonly area: NurseryArea;
  readonly address: string;
  readonly phone: string;
  readonly hours: NurseryHours;
  readonly ageMin: number;
  readonly ageMax: number;
  readonly capacity: number;
  readonly features: readonly string[];
  readonly hasGarden: boolean;
  readonly nearestStation: string;
  readonly website: string | null;
  readonly lat: number;
  readonly lng: number;
  readonly operator: string;
  readonly notes: string;
}
