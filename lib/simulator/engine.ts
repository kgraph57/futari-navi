import type {
  SimulatorInput,
  SimulatorResult,
  EligibleProgram,
  Program,
  IncomeRange,
} from "@/lib/types";
import { getAllPrograms } from "@/lib/programs";

function isLowIncome(income: IncomeRange): boolean {
  return income === "under-300" || income === "300-500";
}

function isEligibleForMarriageSubsidy(
  input: SimulatorInput,
  program: Program,
): boolean {
  if (program.slug !== "marriage-subsidy") return true;
  const bothUnder40 = input.partnerAAge <= 39 && input.partnerBAge <= 39;
  return bothUnder40 && isLowIncome(input.householdIncome);
}

function estimateAmount(
  program: Program,
  input: SimulatorInput,
): number {
  if (program.slug !== "marriage-subsidy") return 0;

  const bothUnder30 = input.partnerAAge <= 29 && input.partnerBAge <= 29;
  return bothUnder30 ? 600000 : 300000;
}

function buildActionItems(program: Program): readonly string[] {
  switch (program.slug) {
    case "marriage-subsidy":
      return [
        "お住まいの自治体が実施しているか確認する",
        "婚姻届受理証明書・所得証明書・住居契約書を準備する",
        "市区町村窓口で申請する",
      ];
    case "tokyo-marriage-passport":
      return [
        "公式サイトまたはアプリで登録する",
        "デジタルパスポートを取得する",
        "協賛店舗で提示して特典を受ける",
      ];
    case "spouse-deduction":
      return [
        "配偶者の年間所得を確認する",
        "年末調整または確定申告で申告する",
      ];
    case "spouse-special-deduction":
      return [
        "配偶者の正確な所得金額を確認する",
        "年末調整または確定申告で申告する",
      ];
    case "social-insurance-dependent":
      return [
        "配偶者の年収が130万円未満か確認する",
        "勤務先に被扶養者異動届を提出する",
        "健康保険証の交付を受ける",
      ];
    case "minato-marriage-support":
      return [
        "港区公式サイトで最新の支援情報を確認する",
        "各地区総合支所の窓口で相談する",
      ];
    default:
      return ["詳細は公式サイトまたは窓口にお問い合わせください"];
  }
}

function evaluateProgram(
  program: Program,
  input: SimulatorInput,
): EligibleProgram | null {
  if (!isEligibleForMarriageSubsidy(input, program)) {
    return null;
  }

  const estimatedAmount = estimateAmount(program, input);
  const actionItems = buildActionItems(program);

  return {
    program,
    estimatedAmount,
    actionItems,
  };
}

export function runSimulation(input: SimulatorInput): SimulatorResult {
  const allPrograms = getAllPrograms();

  const eligiblePrograms = allPrograms
    .map((program) => evaluateProgram(program, input))
    .filter((result): result is EligibleProgram => result !== null)
    .sort((a, b) => b.estimatedAmount - a.estimatedAmount);

  const totalAnnualEstimate = eligiblePrograms.reduce(
    (sum, ep) => sum + ep.estimatedAmount,
    0,
  );

  return {
    totalAnnualEstimate,
    eligiblePrograms,
  };
}

export const calculateBenefits = runSimulation;
