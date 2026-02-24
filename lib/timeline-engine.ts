export type TimelineCategory = "admin" | "medical" | "vaccination" | "support";

export type TimelineUrgency =
  | "overdue"
  | "urgent"
  | "soon"
  | "upcoming"
  | "future";

export interface TimelineItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: TimelineCategory;
  readonly urgency: TimelineUrgency;
  readonly daysFromBirth: number;
  readonly deadlineDaysFromBirth?: number;
  readonly expiryDaysFromBirth?: number;
  readonly actionUrl: string;
  readonly actionLabel: string;
  readonly tip?: string;
  readonly completed: boolean;
  readonly isExpired: boolean;
}

type Def = Omit<TimelineItem, "urgency" | "completed" | "isExpired">;

// prettier-ignore
const DEFINITIONS: readonly Def[] = [
  // 行政手続き
  { id: 'birth-registration',      category: 'admin',      daysFromBirth: 0,    deadlineDaysFromBirth: 14,   expiryDaysFromBirth: 30,   actionUrl: 'https://www.city.minato.tokyo.jp/kodomokyufu/kenko/ninshin/shussan/shussanshitara.html',  actionLabel: '届出方法を確認',       title: '出生届',                            description: '出生後14日以内に区役所へ届出が必要です。',                                      tip: '出生後14日以内。休日でも受け付けています。' },
  { id: 'child-allowance',          category: 'admin',      daysFromBirth: 0,    deadlineDaysFromBirth: 15,   expiryDaysFromBirth: 60,   actionUrl: '/programs/child-allowance',                        actionLabel: '申請ガイドを見る',       title: '児童手当申請',                      description: '出生後15日以内に申請すると当月から支給されます。',                               tip: '15日を過ぎると翌月からの支給に。出生届と同日に申請できます。' },
  { id: 'child-medical-subsidy',    category: 'admin',      daysFromBirth: 0,    deadlineDaysFromBirth: 30,   expiryDaysFromBirth: 90,   actionUrl: '/programs/child-medical-subsidy',                  actionLabel: '申請ガイドを見る',       title: '子ども医療費助成申請（マル乳）',    description: '乳幼児医療費助成の申請です。',                                                   tip: '申請後1〜2週間で医療証が届きます。' },
  { id: 'childbirth-lump-sum',      category: 'admin',      daysFromBirth: 0,    deadlineDaysFromBirth: 730,  expiryDaysFromBirth: 730,  actionUrl: '/programs/childbirth-lump-sum',                    actionLabel: '申請方法を確認',         title: '出産育児一時金（直接支払制度未利用者）', description: '直接支払制度を利用しなかった場合は健康保険組合または協会けんぽへ申請が必要です。' },
  { id: 'birth-childcare-grant',    category: 'admin',      daysFromBirth: 0,    deadlineDaysFromBirth: 120,  expiryDaysFromBirth: 120,  actionUrl: '/programs/birth-childcare-grant',                  actionLabel: '面談を予約する',         title: '出産・子育て応援交付金（産後面談）', description: '産後4ヶ月以内に保健センターで面談を受けると5万円相当が支給されます。',            tip: '出産後4ヶ月以内に保健センターで面談を受けると5万円相当が支給されます。' },
  // 健診
  { id: 'checkup-1month',           category: 'medical',    daysFromBirth: 28,   deadlineDaysFromBirth: 60,   expiryDaysFromBirth: 90,   actionUrl: '/programs/infant-health-checkup',                  actionLabel: '健診について確認',       title: '1ヶ月健診',                         description: '赤ちゃんの発育・発達を確認する健診です。',                                      tip: '通常は分娩した産院で行います。受診票を忘れずに。' },
  { id: 'checkup-3to4month',        category: 'medical',    daysFromBirth: 90,   deadlineDaysFromBirth: 120,  expiryDaysFromBirth: 150,  actionUrl: '/programs/infant-health-checkup',                  actionLabel: '健診について確認',       title: '3-4ヶ月健診',                       description: '区が実施する乳幼児健診です。',                                                   tip: 'かかりつけ小児科を予約しましょう。' },
  { id: 'checkup-6to7month',        category: 'medical',    daysFromBirth: 180,  deadlineDaysFromBirth: 210,  expiryDaysFromBirth: 240,  actionUrl: '/programs/infant-health-checkup',                  actionLabel: '健診について確認',       title: '6-7ヶ月健診',                       description: '区が実施する乳幼児健診です。' },
  { id: 'checkup-9to10month',       category: 'medical',    daysFromBirth: 270,  deadlineDaysFromBirth: 300,  expiryDaysFromBirth: 330,  actionUrl: '/programs/infant-health-checkup',                  actionLabel: '健診について確認',       title: '9-10ヶ月健診',                      description: '区が実施する乳幼児健診です。' },
  { id: 'checkup-18month',          category: 'medical',    daysFromBirth: 540,  deadlineDaysFromBirth: 570,  expiryDaysFromBirth: 600,  actionUrl: '/programs/infant-health-checkup',                  actionLabel: '健診について確認',       title: '1歳6ヶ月健診',                      description: '区が実施する乳幼児健診です。' },
  { id: 'checkup-3year',            category: 'medical',    daysFromBirth: 1080, deadlineDaysFromBirth: 1110, expiryDaysFromBirth: 1140, actionUrl: '/programs/infant-health-checkup',                  actionLabel: '健診について確認',       title: '3歳健診',                           description: '区が実施する幼児健診です。' },
  { id: 'checkup-5year',            category: 'medical',    daysFromBirth: 1825, deadlineDaysFromBirth: 1855, expiryDaysFromBirth: 1885, actionUrl: '/programs/infant-health-checkup',                  actionLabel: '健診について確認',       title: '5歳児健診',                         description: '受託医療機関で受ける個別健診です。発達障害の早期発見と就学前支援が目的。',     tip: '受診票が届いたら早めに医療機関を予約しましょう。' },
  // 発達支援
  { id: 'dev-support-consultation',   category: 'support',    daysFromBirth: 1825,                             expiryDaysFromBirth: 2555, actionUrl: '/programs/child-development-support',             actionLabel: 'ぱおの詳細を見る',       title: '発達が気になったら「ぱお」に相談', description: '5歳児健診で経過観察となった場合や、発達に気になることがあれば児童発達支援センター「ぱお」（03-6277-3903）に相談できます。', tip: '診断がなくても相談OK。「ちょっと気になる」段階で相談を。' },
  // ワクチン
  { id: 'vaccine-bcg',              category: 'vaccination', daysFromBirth: 60,  deadlineDaysFromBirth: 365,  expiryDaysFromBirth: 365,  actionUrl: '/vaccines/bcg',                                    actionLabel: '接種について確認',       title: 'BCGワクチン（結核）',              description: '結核予防のための定期接種です。',                                                tip: '生後2〜6ヶ月が推奨。港区指定医療機関で接種。' },
  { id: 'vaccine-hepb-1',           category: 'vaccination', daysFromBirth: 60,  deadlineDaysFromBirth: 90,   expiryDaysFromBirth: 365,  actionUrl: '/vaccines/hepatitis-b',                            actionLabel: '接種スケジュール確認',   title: 'B型肝炎ワクチン1回目',             description: 'B型肝炎予防のための定期接種です。',                                            tip: '2・3・7ヶ月の3回接種が基本スケジュール。' },
  { id: 'vaccine-rotavirus-1',      category: 'vaccination', daysFromBirth: 60,  deadlineDaysFromBirth: 90,   expiryDaysFromBirth: 150,  actionUrl: '/vaccines/rotavirus',                              actionLabel: '接種について確認',       title: 'ロタウイルスワクチン1回目',        description: 'ロタウイルス感染症予防のための定期接種です。',                                  tip: '接種できる期間が短いので早めに。生後2ヶ月〜5ヶ月以内。' },
  { id: 'vaccine-hib-pcv-dtap',     category: 'vaccination', daysFromBirth: 60,  deadlineDaysFromBirth: 90,   expiryDaysFromBirth: 365,  actionUrl: '/vaccines/pentavalent',                            actionLabel: '接種スケジュール確認',   title: 'ヒブ・肺炎球菌・4種混合ワクチン', description: 'ヒブ・肺炎球菌・ジフテリア・百日咳・破傷風・ポリオの定期接種です。',            tip: '同時接種可能。2・3・4ヶ月・1歳の4回。' },
  { id: 'vaccine-mr-1',             category: 'vaccination', daysFromBirth: 365, deadlineDaysFromBirth: 730,  expiryDaysFromBirth: 730,  actionUrl: '/vaccines/mmr',                                    actionLabel: '接種について確認',       title: 'MRワクチン1期（麻しん・風しん）',  description: '麻しん・風しん混合の定期接種1期です。',                                         tip: '1歳になったら早めに接種を。' },
  { id: 'vaccine-varicella',        category: 'vaccination', daysFromBirth: 365, deadlineDaysFromBirth: 548,  expiryDaysFromBirth: 730,  actionUrl: '/vaccines/varicella',                              actionLabel: '接種について確認',       title: '水痘ワクチン',                      description: '水痘（みずぼうそう）予防のための定期接種です。',                                tip: '1歳〜3歳未満に2回接種。' },
  { id: 'vaccine-mumps-1',          category: 'vaccination', daysFromBirth: 365, deadlineDaysFromBirth: 730,  expiryDaysFromBirth: 2190, actionUrl: '/programs/mumps-vaccine-subsidy',                  actionLabel: '港区の助成を確認',       title: 'おたふくかぜワクチン1回目',        description: '流行性耳下腺炎（おたふくかぜ）予防ワクチンです。港区は全額助成。',              tip: '港区は全額助成。かかりつけ小児科で接種できます。' },
  { id: 'vaccine-influenza',        category: 'vaccination', daysFromBirth: 180, deadlineDaysFromBirth: 1825, expiryDaysFromBirth: 5475, actionUrl: '/programs/influenza-vaccine-subsidy',               actionLabel: '港区の助成を確認',       title: 'インフルエンザワクチン',            description: '毎年秋冬に接種推奨。港区の助成を確認しましょう。',                              tip: '毎年10月〜翌年1月。13歳未満は2回接種推奨。' },
  { id: 'vaccine-mumps-2',          category: 'vaccination', daysFromBirth: 1460, deadlineDaysFromBirth: 2190, expiryDaysFromBirth: 2190, actionUrl: '/programs/mumps-vaccine-subsidy',                 actionLabel: '港区の助成を確認',       title: 'おたふくかぜワクチン2回目（就学前）', description: '就学前（5〜6歳）に2回目接種。港区は全額助成。',                               tip: '就学前（5〜6歳）に2回目接種。' },
  // 3歳以降のワクチン・健診
  { id: 'vaccine-je-1',             category: 'vaccination', daysFromBirth: 1095, deadlineDaysFromBirth: 1460, expiryDaysFromBirth: 2555, actionUrl: '/vaccines/japanese-encephalitis',                 actionLabel: '接種について確認',       title: '日本脳炎ワクチン1期（3歳〜）',     description: '日本脳炎予防の定期接種。1期は3回接種（3歳で2回、4歳で追加1回）。',             tip: '3歳になったら開始。1期は3回接種が必要です。' },
  { id: 'vaccine-mr-2',             category: 'vaccination', daysFromBirth: 1825, deadlineDaysFromBirth: 2555, expiryDaysFromBirth: 2555, actionUrl: '/vaccines/mmr',                                   actionLabel: '接種について確認',       title: 'MRワクチン2期（就学前年度）',       description: '小学校入学前年度（5〜7歳未満）に接種する麻しん・風しんの2期接種です。',        tip: '年長クラスの4月〜3月が対象期間。忘れずに。' },
  { id: 'school-health-check',      category: 'medical',    daysFromBirth: 2040, deadlineDaysFromBirth: 2190, expiryDaysFromBirth: 2190, actionUrl: 'https://www.city.minato.tokyo.jp/gakuji/syuugakujikennsinn/r7syuugakujikennsinn.html', actionLabel: '日程を確認', title: '就学時健康診断',            description: '小学校入学前に区が実施する健康診断です。',                                      tip: '10〜11月頃に実施。通知が届いたら日程を確認。' },
  { id: 'vaccine-je-2',             category: 'vaccination', daysFromBirth: 3285, deadlineDaysFromBirth: 3650, expiryDaysFromBirth: 4745, actionUrl: '/vaccines/japanese-encephalitis',                 actionLabel: '接種について確認',       title: '日本脳炎ワクチン2期（9歳〜）',     description: '日本脳炎予防の定期接種2期。9〜13歳未満に1回接種。',                             tip: '9歳になったら2期接種を。' },
  { id: 'vaccine-dt-2',             category: 'vaccination', daysFromBirth: 4015, deadlineDaysFromBirth: 4380, expiryDaysFromBirth: 4745, actionUrl: '/vaccines/pentavalent',                           actionLabel: '接種について確認',       title: 'DT（ジフテリア・破傷風）2期',      description: '11歳で接種するジフテリア・破傷風の2期接種です。',                               tip: '11歳で2期接種。通知が届いたらかかりつけ医へ。' },
  { id: 'vaccine-hpv',              category: 'vaccination', daysFromBirth: 4380, deadlineDaysFromBirth: 5840, expiryDaysFromBirth: 5840, actionUrl: '/vaccines/hpv',                                   actionLabel: '接種について確認',       title: 'HPVワクチン（小6〜高1）',           description: '子宮頸がん予防のHPVワクチン。小学6年〜高校1年相当の女子に定期接種。',          tip: '小6〜高1が定期接種対象。男子も任意接種として推奨。' },
  // サポートサービス
  { id: 'postnatal-care',           category: 'support',    daysFromBirth: 0,    deadlineDaysFromBirth: 120,  expiryDaysFromBirth: 120,  actionUrl: '/programs/postnatal-care-stay',                    actionLabel: '産後ケアを申請する',     title: '産後ケア（宿泊・デイ・訪問）申請', description: '出産後4ヶ月以内に利用できる産後ケアサービスです。',                             tip: '出産後4ヶ月以内。体が辛い・育児が不安なら早めに相談を。' },
  { id: 'family-support',           category: 'support',    daysFromBirth: 90,                               expiryDaysFromBirth: 3650, actionUrl: '/programs/family-support',                         actionLabel: '登録方法を確認',         title: 'ファミリーサポート登録',            description: '子どもの一時預かりを地域住民が助け合う会員組織です。',                          tip: '登録は無料。急に預けたいときに備えて早めの登録を。' },
  { id: 'temporary-childcare',      category: 'support',    daysFromBirth: 120,                              expiryDaysFromBirth: 2190, actionUrl: '/programs/temporary-childcare',                    actionLabel: '施設を探す',             title: '一時保育 登録',                     description: '急な用事や保護者のリフレッシュのために子どもを一時的に預けられます。',          tip: '施設によっては登録に数週間かかります。余裕を持って。' },
  { id: 'unlicensed-nursery-subsidy', category: 'support',  daysFromBirth: 90,                               expiryDaysFromBirth: 2190, actionUrl: '/programs/unlicensed-nursery-subsidy',             actionLabel: '助成を確認',             title: '認可外保育施設保育料助成 確認',     description: '認可外保育施設を利用する場合の保育料助成制度です。' },
  { id: 'multi-child-nursery-reduction', category: 'support', daysFromBirth: 0,                              expiryDaysFromBirth: 2190, actionUrl: '/programs/multi-child-nursery-reduction',          actionLabel: '軽減を確認',             title: '多子世帯保育料軽減 確認（2人目以降）', description: '第2子以降の保育料が半額または無料になる軽減制度です。',                       tip: '第2子以降なら保育料が半額または無料になります。' },
]

function calculateUrgency(
  ageInDays: number,
  daysFromBirth: number,
  deadlineDaysFromBirth: number | undefined,
): TimelineUrgency {
  if (deadlineDaysFromBirth !== undefined) {
    const daysRemaining = deadlineDaysFromBirth - ageInDays;
    if (daysRemaining < 0) return "overdue";
    if (daysRemaining <= 7) return "urgent";
    if (daysRemaining <= 30) return "soon";
    if (daysRemaining <= 90) return "upcoming";
    return "future";
  }

  return ageInDays >= daysFromBirth ? "upcoming" : "future";
}

// Returns true when today falls within Japan's influenza season (October–January).
function isFluSeason(date: Date): boolean {
  const month = date.getMonth() + 1; // getMonth() is 0-indexed
  return month === 10 || month === 11 || month === 12 || month === 1;
}

export function generateTimeline(
  birthDate: string,
  completedItems: readonly string[] = [],
): readonly TimelineItem[] {
  const today = new Date();
  const birthDay = new Date(birthDate);
  const ageInDays = Math.floor(
    (today.getTime() - birthDay.getTime()) / 86400000,
  );

  const completedSet = new Set(completedItems);

  return DEFINITIONS.flatMap((def) => {
    const isCompleted = completedSet.has(def.id);

    const isExpired =
      !isCompleted &&
      def.expiryDaysFromBirth !== undefined &&
      ageInDays > def.expiryDaysFromBirth;

    let urgency = calculateUrgency(
      ageInDays,
      def.daysFromBirth,
      def.deadlineDaysFromBirth,
    );

    // Influenza vaccine: show as "upcoming" only during flu season (Oct–Jan)
    // and when the child is at least 6 months old (180 days).
    if (def.id === "vaccine-influenza" && !isCompleted) {
      const childOldEnough = ageInDays >= 180;
      urgency = childOldEnough && isFluSeason(today) ? "upcoming" : "future";
    }

    return [{ ...def, urgency, completed: isCompleted, isExpired }];
  });
}

export function groupTimelineByUrgency(items: readonly TimelineItem[]): {
  readonly overdue: readonly TimelineItem[];
  readonly urgent: readonly TimelineItem[];
  readonly soon: readonly TimelineItem[];
  readonly upcoming: readonly TimelineItem[];
  readonly future: readonly TimelineItem[];
  readonly expired: readonly TimelineItem[];
} {
  return {
    overdue: items.filter(
      (item) => !item.isExpired && item.urgency === "overdue",
    ),
    urgent: items.filter(
      (item) => !item.isExpired && item.urgency === "urgent",
    ),
    soon: items.filter((item) => !item.isExpired && item.urgency === "soon"),
    upcoming: items.filter(
      (item) => !item.isExpired && item.urgency === "upcoming",
    ),
    future: items.filter(
      (item) => !item.isExpired && item.urgency === "future",
    ),
    expired: items.filter((item) => item.isExpired),
  };
}

const URGENCY_ORDER: Record<TimelineUrgency, number> = {
  overdue: 0,
  urgent: 1,
  soon: 2,
  upcoming: 3,
  future: 4,
};

export function getTop3Items(
  items: readonly TimelineItem[],
): readonly TimelineItem[] {
  return items
    .filter((item) => !item.completed && !item.isExpired)
    .sort((a, b) => URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency])
    .slice(0, 3);
}
