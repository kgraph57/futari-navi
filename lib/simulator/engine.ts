import type {
  SimulatorInput,
  SimulatorResult,
  EligibleProgram,
  Program,
  ChildInfo,
} from "@/lib/types";
import { getAllPrograms } from "@/lib/programs";

function computeChildAgeInYears(
  birthDate: string,
  referenceDate: Date,
): number {
  const birth = new Date(birthDate);
  const years = referenceDate.getFullYear() - birth.getFullYear();
  const monthDiff = referenceDate.getMonth() - birth.getMonth();
  const dayDiff = referenceDate.getDate() - birth.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    return years - 1;
  }
  return years;
}

function computeChildAgeInMonths(
  birthDate: string,
  referenceDate: Date,
): number {
  const birth = new Date(birthDate);
  const years = referenceDate.getFullYear() - birth.getFullYear();
  const months = referenceDate.getMonth() - birth.getMonth();
  const dayDiff = referenceDate.getDate() - birth.getDate();

  const totalMonths = years * 12 + months;
  return dayDiff < 0 ? totalMonths - 1 : totalMonths;
}

function isChildEligibleForProgram(
  child: ChildInfo,
  program: Program,
  referenceDate: Date,
): boolean {
  const ageYears = computeChildAgeInYears(child.birthDate, referenceDate);
  const ageMonths = computeChildAgeInMonths(child.birthDate, referenceDate);
  const { minAge, maxAge } = program.eligibility;

  if (minAge !== null && ageYears < minAge) {
    if (program.slug === "influenza-vaccine-subsidy" && ageMonths >= 6) {
      return true;
    }
    return false;
  }
  if (maxAge !== null && ageYears > maxAge) return false;

  if (program.slug === "temporary-childcare" && ageMonths < 4) return false;

  return true;
}

function computeChildAllowanceMonthly(
  child: ChildInfo,
  childIndex: number,
  referenceDate: Date,
): number {
  const ageYears = computeChildAgeInYears(child.birthDate, referenceDate);

  if (ageYears < 0 || ageYears > 18) return 0;

  if (ageYears < 3) return 15000;

  if (childIndex >= 2) return 30000;

  return 10000;
}

function estimateProgramAmount(
  program: Program,
  input: SimulatorInput,
  referenceDate: Date,
): number {
  switch (program.slug) {
    case "child-allowance": {
      const monthlyTotal = input.children.reduce(
        (sum, child, idx) =>
          sum + computeChildAllowanceMonthly(child, idx, referenceDate),
        0,
      );
      return monthlyTotal * 12;
    }

    case "child-medical-subsidy": {
      return input.children
        .filter((child) =>
          isChildEligibleForProgram(child, program, referenceDate),
        )
        .reduce((sum, child) => {
          const age = computeChildAgeInYears(child.birthDate, referenceDate);
          if (age < 1) return sum + 60000;
          if (age < 3) return sum + 40000;
          if (age < 6) return sum + 30000;
          return sum + 20000;
        }, 0);
    }

    case "birth-childcare-grant": {
      const infantCount = input.children.filter((child) => {
        const ageMonths = computeChildAgeInMonths(
          child.birthDate,
          referenceDate,
        );
        return ageMonths <= 12;
      }).length;
      return infantCount * 100000;
    }

    case "childbirth-lump-sum": {
      const newbornCount = input.children.filter((child) => {
        const ageMonths = computeChildAgeInMonths(
          child.birthDate,
          referenceDate,
        );
        return ageMonths <= 12;
      }).length;
      return newbornCount * 500000;
    }

    case "mumps-vaccine-subsidy": {
      const eligibleCount = input.children.filter((child) =>
        isChildEligibleForProgram(child, program, referenceDate),
      ).length;
      return eligibleCount * 8000;
    }

    case "influenza-vaccine-subsidy": {
      return input.children
        .filter((child) =>
          isChildEligibleForProgram(child, program, referenceDate),
        )
        .reduce((sum, child) => {
          const age = computeChildAgeInYears(child.birthDate, referenceDate);
          return sum + (age < 13 ? 6000 : 3000);
        }, 0);
    }

    case "infant-health-checkup": {
      // 公費で無料のため金額は0（サービス給付として表示）
      return 0;
    }

    default:
      return 0;
  }
}

function buildActionItems(
  program: Program,
  input: SimulatorInput,
): readonly string[] {
  const baseItems: string[] = [];

  switch (program.slug) {
    case "child-medical-subsidy":
      baseItems.push(
        "医療証（マル乳・マル子・マル青）を取得する",
        "受診時に医療証を窓口に提示する",
      );
      break;
    case "child-allowance":
      baseItems.push(
        "出生届提出後、15日以内に児童手当の認定請求を行う",
        "毎年6月に現況届を提出する",
      );
      break;
    case "birth-childcare-grant":
      baseItems.push(
        "妊娠届出時に面談を受ける",
        "出産後の面談を受ける",
        "交付金の申請手続きを行う",
      );
      break;
    case "childbirth-lump-sum":
      baseItems.push(
        "出産する医療機関で直接支払制度の利用を確認する",
        "差額がある場合は健康保険組合に申請する",
      );
      break;
    case "mumps-vaccine-subsidy":
      baseItems.push(
        "港区指定の医療機関を確認する",
        "予診票を持って接種に行く",
      );
      break;
    case "influenza-vaccine-subsidy":
      baseItems.push(
        "接種期間（10月〜1月頃）に指定医療機関で接種する",
        "予診票を持参する",
      );
      break;
    case "postnatal-care-stay":
    case "postnatal-care-day":
    case "postnatal-care-visit":
      baseItems.push("みなと保健所に事前申請する", "利用希望日を相談する");
      break;
    case "temporary-childcare":
      baseItems.push("利用したい施設に事前登録する", "利用日の予約をする");
      break;
    case "child-short-stay":
      baseItems.push("子ども家庭支援センターに相談する", "利用申請を行う");
      break;
    case "family-support":
      baseItems.push(
        "ファミリーサポートセンターに会員登録する",
        "支援会員とのマッチングを待つ",
      );
      break;
    case "komusubi-project":
      baseItems.push(
        "子むすびプロジェクトのイベント情報を確認する",
        "参加申込を行う",
      );
      break;
    case "unlicensed-nursery-subsidy":
      baseItems.push(
        "認可外保育施設の利用証明書を準備する",
        "港区に助成金の申請を行う",
      );
      break;
    case "multi-child-nursery-reduction":
      baseItems.push(
        "認可保育所の入所申込時に多子世帯であることを申告する",
        "きょうだいの在園証明を提出する",
      );
      break;
    case "private-kindergarten-subsidy":
      baseItems.push(
        "在園する幼稚園から申請書類を受け取る",
        "必要書類を揃えて幼稚園を通じて申請する",
      );
      break;
    case "infant-health-checkup":
      baseItems.push("受診票が届いたら期限内に受診する", "母子手帳を持参する");
      break;
    default:
      baseItems.push("詳細は港区の窓口にお問い合わせください");
  }

  if (input.householdType === "single-parent") {
    baseItems.push("ひとり親家庭向けの追加支援も確認してください");
  }

  return baseItems;
}

function evaluateProgramForHousehold(
  program: Program,
  input: SimulatorInput,
  referenceDate: Date,
): EligibleProgram | null {
  const hasEligibleChild = input.children.some((child) =>
    isChildEligibleForProgram(child, program, referenceDate),
  );

  const isNewbornProgram = [
    "birth-childcare-grant",
    "childbirth-lump-sum",
    "postnatal-care-stay",
    "postnatal-care-day",
    "postnatal-care-visit",
  ].includes(program.slug);

  if (isNewbornProgram) {
    const hasNewborn = input.children.some((child) => {
      const ageMonths = computeChildAgeInMonths(child.birthDate, referenceDate);
      return ageMonths <= 12;
    });
    if (!hasNewborn) return null;
  } else if (!hasEligibleChild) {
    return null;
  }

  if (
    program.slug === "unlicensed-nursery-subsidy" &&
    !input.children.some((c) => c.careType === "nursery")
  ) {
    return null;
  }

  if (
    program.slug === "multi-child-nursery-reduction" &&
    input.children.length < 2
  ) {
    return null;
  }

  if (
    program.slug === "private-kindergarten-subsidy" &&
    !input.children.some((c) => c.careType === "kindergarten")
  ) {
    return null;
  }

  const estimatedAmount = estimateProgramAmount(program, input, referenceDate);
  const actionItems = buildActionItems(program, input);

  return {
    program,
    estimatedAmount,
    actionItems,
  };
}

export function runSimulation(input: SimulatorInput): SimulatorResult {
  const referenceDate = new Date();
  const allPrograms = getAllPrograms();

  const eligiblePrograms = allPrograms
    .map((program) =>
      evaluateProgramForHousehold(program, input, referenceDate),
    )
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
