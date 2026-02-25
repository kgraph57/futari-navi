export type MarriageCategory =
  | "registration"
  | "name_change"
  | "moving"
  | "work"
  | "tax"
  | "benefits";

export type MarriageUrgency =
  | "overdue"
  | "urgent"
  | "soon"
  | "upcoming"
  | "future";

export interface MarriageTimelineItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: MarriageCategory;
  readonly urgency: MarriageUrgency;
  readonly daysFromMarriage: number;
  readonly deadlineDaysFromMarriage?: number;
  readonly location: string;
  readonly requiredDocuments: readonly string[];
  readonly actionUrl: string;
  readonly actionLabel: string;
  readonly tip?: string;
  readonly completed: boolean;
  readonly applicableConditions?: readonly string[];
}

type Def = Omit<MarriageTimelineItem, "urgency" | "completed">;

const DEFINITIONS: readonly Def[] = [
  // ── 婚姻届関連 ──
  {
    id: "marriage-registration",
    category: "registration",
    daysFromMarriage: 0,
    actionUrl: "https://www.moj.go.jp/MINJI/minji04_00072.html",
    actionLabel: "法務省で確認",
    title: "婚姻届を提出する",
    description: "市区町村の窓口に婚姻届を提出します。365日24時間受付可能。",
    location: "市区町村の戸籍窓口",
    requiredDocuments: ["婚姻届", "戸籍謄本", "本人確認書類"],
    tip: "証人2名の署名・押印が必要です。",
  },
  {
    id: "new-koseki",
    category: "registration",
    daysFromMarriage: 7,
    actionUrl:
      "https://www.city.minato.tokyo.jp/kosekitodoke/kurashi/todoke/koseki/shomei.html",
    actionLabel: "港区の窓口情報",
    title: "新しい戸籍謄本を取得",
    description: "各種名義変更に必要。複数部取得しておくと便利。",
    location: "本籍地の市区町村窓口",
    requiredDocuments: ["本人確認書類"],
    tip: "婚姻届提出後、約1週間で編製されます。",
  },
  {
    id: "new-juminhyo",
    category: "registration",
    daysFromMarriage: 7,
    actionUrl:
      "https://www.city.minato.tokyo.jp/jumin/kurashi/todoke/jumin/juminhyo.html",
    actionLabel: "港区の窓口情報",
    title: "住民票を取得（新姓）",
    description: "名義変更の際に必要になります。",
    location: "住所地の市区町村窓口",
    requiredDocuments: ["本人確認書類"],
  },

  // ── 名義変更（姓変更の場合） ──
  {
    id: "mynumber-card",
    category: "name_change",
    daysFromMarriage: 7,
    deadlineDaysFromMarriage: 14,
    actionUrl: "https://www.kojinbango-card.go.jp/procedures-change/",
    actionLabel: "公式サイトで確認",
    title: "マイナンバーカードの氏名変更",
    description: "他の手続きで身分証として使うため最優先で変更。",
    location: "市区町村窓口",
    requiredDocuments: ["マイナンバーカード", "新しい戸籍謄本 or 住民票"],
    tip: "免許証より先にこちらを変更すると、以降の手続きがスムーズ。",
    applicableConditions: ["姓変更あり"],
  },
  {
    id: "drivers-license",
    category: "name_change",
    daysFromMarriage: 7,
    actionUrl:
      "https://www.keishicho.metro.tokyo.lg.jp/menkyo/koshin/kisaijiko/index.html",
    actionLabel: "警視庁で確認",
    title: "運転免許証の氏名・住所変更",
    description: "身分証明書として使うため早めに変更。",
    location: "警察署 or 運転免許センター",
    requiredDocuments: ["運転免許証", "住民票（新姓）"],
    applicableConditions: ["姓変更あり"],
  },
  {
    id: "health-insurance",
    category: "name_change",
    daysFromMarriage: 7,
    deadlineDaysFromMarriage: 14,
    actionUrl:
      "https://www.nenkin.go.jp/service/kounen/todokesho/hihokensha/20150407-02.html",
    actionLabel: "年金機構で確認",
    title: "健康保険証の氏名変更",
    description: "国保は14日以内に届出が必要。社保は会社経由。",
    location: "市区町村窓口（国保）/ 勤務先（社保）",
    requiredDocuments: ["保険証", "届出書", "本人確認書類"],
    applicableConditions: ["姓変更あり"],
  },
  {
    id: "pension",
    category: "name_change",
    daysFromMarriage: 7,
    deadlineDaysFromMarriage: 14,
    actionUrl:
      "https://www.nenkin.go.jp/service/seidozenpan/mynumber/mynumber.html",
    actionLabel: "ねんきんネット",
    title: "年金の氏名変更",
    description: "国民年金は14日以内。厚生年金は会社経由。",
    location: "市区町村窓口 / 年金事務所",
    requiredDocuments: ["年金手帳 or 基礎年金番号通知書"],
    applicableConditions: ["姓変更あり"],
  },
  {
    id: "passport",
    category: "name_change",
    daysFromMarriage: 14,
    actionUrl: "https://www.mofa.go.jp/mofaj/toko/passport/pass_5.html",
    actionLabel: "外務省で確認",
    title: "パスポートの変更",
    description: "旅行予定があれば早めに。申請から約1週間で受取。",
    location: "旅券事務所",
    requiredDocuments: ["パスポート", "戸籍謄本", "証明写真"],
    applicableConditions: ["姓変更あり"],
  },
  {
    id: "bank-accounts",
    category: "name_change",
    daysFromMarriage: 14,
    actionUrl: "https://www.zenginkyo.or.jp/article/tag-c/7705/",
    actionLabel: "銀行協会で確認",
    title: "銀行口座の名義変更",
    description: "届出印も変更が必要な場合があります。",
    location: "各銀行窓口",
    requiredDocuments: ["通帳", "届出印", "本人確認書類"],
    applicableConditions: ["姓変更あり"],
  },
  {
    id: "credit-cards",
    category: "name_change",
    daysFromMarriage: 14,
    actionUrl: "/checklists",
    actionLabel: "手続きを確認",
    title: "クレジットカードの名義変更",
    description: "Webで手続き可能なカード会社も多い。",
    location: "各カード会社（Web or 電話）",
    requiredDocuments: [],
    applicableConditions: ["姓変更あり"],
  },
  {
    id: "mobile-phone",
    category: "name_change",
    daysFromMarriage: 21,
    actionUrl: "/checklists",
    actionLabel: "手続きを確認",
    title: "携帯電話の名義変更",
    description: "キャリアショップまたはWebで手続き。",
    location: "キャリアショップ or Web",
    requiredDocuments: ["本人確認書類"],
    applicableConditions: ["姓変更あり"],
  },
  {
    id: "insurance-policies",
    category: "name_change",
    daysFromMarriage: 21,
    actionUrl: "https://www.seiho.or.jp/contact/",
    actionLabel: "生命保険協会",
    title: "生命保険・損害保険の変更",
    description: "受取人変更も忘れずに確認。",
    location: "各保険会社",
    requiredDocuments: ["保険証券", "本人確認書類"],
    applicableConditions: ["姓変更あり"],
  },

  // ── 引越し関連 ──
  {
    id: "move-out-notice",
    category: "moving",
    daysFromMarriage: -14,
    actionUrl:
      "https://www.city.minato.tokyo.jp/jumin/kurashi/todoke/jumin/tenshutsu.html",
    actionLabel: "港区の窓口情報",
    title: "転出届の提出",
    description: "旧住所の市区町村に届出。引越し14日前から可能。",
    location: "旧住所の市区町村窓口",
    requiredDocuments: ["本人確認書類", "印鑑"],
    applicableConditions: ["引越しあり"],
  },
  {
    id: "move-in-notice",
    category: "moving",
    daysFromMarriage: 0,
    deadlineDaysFromMarriage: 14,
    actionUrl:
      "https://www.city.minato.tokyo.jp/jumin/kurashi/todoke/jumin/tennyuu.html",
    actionLabel: "港区の窓口情報",
    title: "転入届の提出",
    description: "新住所の市区町村に14日以内に届出。",
    location: "新住所の市区町村窓口",
    requiredDocuments: ["転出証明書", "本人確認書類", "印鑑"],
    applicableConditions: ["引越しあり"],
  },
  {
    id: "mail-forwarding",
    category: "moving",
    daysFromMarriage: -7,
    actionUrl: "https://www.post.japanpost.jp/service/tenkyo/",
    actionLabel: "e転居で申込",
    title: "郵便転送届の提出",
    description: "旧住所宛の郵便を1年間自動転送。",
    location: "郵便局 or e転居（Web）",
    requiredDocuments: ["本人確認書類"],
    applicableConditions: ["引越しあり"],
  },
  {
    id: "utilities",
    category: "moving",
    daysFromMarriage: -14,
    actionUrl: "/checklists",
    actionLabel: "手続きを確認",
    title: "電気・ガス・水道の変更",
    description: "旧居の解約と新居の開始手続き。",
    location: "各事業者（電話 or Web）",
    requiredDocuments: [],
    applicableConditions: ["引越しあり"],
  },
  {
    id: "internet",
    category: "moving",
    daysFromMarriage: -14,
    actionUrl: "/checklists",
    actionLabel: "手続きを確認",
    title: "インターネット回線の変更",
    description: "新居で工事が必要な場合は早めに予約。",
    location: "プロバイダー（電話 or Web）",
    requiredDocuments: [],
    applicableConditions: ["引越しあり"],
  },

  // ── 勤務先 ──
  {
    id: "company-marriage-report",
    category: "work",
    daysFromMarriage: 0,
    deadlineDaysFromMarriage: 14,
    actionUrl: "/checklists",
    actionLabel: "手続きを確認",
    title: "勤務先への結婚届",
    description: "社内の結婚届を提出。福利厚生の確認も。",
    location: "勤務先の人事部",
    requiredDocuments: ["社内結婚届"],
  },
  {
    id: "dependent-application",
    category: "work",
    daysFromMarriage: 0,
    deadlineDaysFromMarriage: 30,
    actionUrl:
      "https://www.nenkin.go.jp/service/kounen/todokesho/hifuyousha/20141224.html",
    actionLabel: "年金機構で確認",
    title: "扶養の申請",
    description: "配偶者を扶養に入れる場合の手続き。",
    location: "勤務先の人事部",
    requiredDocuments: ["扶養届出書", "配偶者の所得証明"],
    applicableConditions: ["扶養該当"],
  },
  {
    id: "commuting-allowance",
    category: "work",
    daysFromMarriage: 0,
    deadlineDaysFromMarriage: 30,
    actionUrl: "/checklists",
    actionLabel: "手続きを確認",
    title: "通勤手当の変更届",
    description: "住所変更に伴う通勤経路の届出。",
    location: "勤務先の人事部",
    requiredDocuments: ["住所変更届"],
    applicableConditions: ["引越しあり"],
  },

  // ── 税金 ──
  {
    id: "spouse-deduction-check",
    category: "tax",
    daysFromMarriage: 30,
    actionUrl:
      "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1191.htm",
    actionLabel: "国税庁で確認",
    title: "配偶者控除の確認",
    description: "年末調整で配偶者控除が適用されるか確認。",
    location: "勤務先",
    requiredDocuments: ["配偶者の所得情報"],
    tip: "結婚した年の12月31日時点の状態で判定されます。",
  },
  {
    id: "year-end-adjustment",
    category: "tax",
    daysFromMarriage: 30,
    actionUrl:
      "https://www.nta.go.jp/taxes/tetsuzuki/shinsei/annai/gensen/annai/1648_01.htm",
    actionLabel: "国税庁で確認",
    title: "年末調整書類の更新",
    description: "扶養控除等申告書の配偶者欄を更新。",
    location: "勤務先",
    requiredDocuments: ["給与所得者の扶養控除等(異動)申告書"],
  },

  // ── 給付金・支援制度 ──
  {
    id: "marriage-subsidy",
    category: "benefits",
    daysFromMarriage: 0,
    deadlineDaysFromMarriage: 365,
    actionUrl: "/articles/vol-001-marriage-subsidy",
    actionLabel: "詳しく見る",
    title: "結婚新生活支援事業の申請",
    description: "住居費・引越費用を最大60万円補助。自治体による。",
    location: "市区町村窓口",
    requiredDocuments: [
      "婚姻届受理証明書",
      "住民票",
      "所得証明書",
      "住居費の領収書等",
    ],
    tip: "全自治体で実施されているわけではありません。予算がなくなり次第終了の場合も。",
  },
  {
    id: "futari-passport",
    category: "benefits",
    daysFromMarriage: 0,
    deadlineDaysFromMarriage: 365,
    actionUrl: "https://www.futari-passport.metro.tokyo.lg.jp/",
    actionLabel: "登録する",
    title: "TOKYOふたり結婚応援パスポートの登録",
    description: "協賛店での割引・特典が受けられます。",
    location: "アプリ or Web",
    requiredDocuments: [],
    tip: "東京都在住でなくても、都内の協賛店でサービスを受けられます。",
  },
];

const CATEGORY_LABELS: Record<MarriageCategory, string> = {
  registration: "婚姻届関連",
  name_change: "名義変更",
  moving: "引越し",
  work: "勤務先",
  tax: "税金",
  benefits: "給付金・支援",
};

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function diffDays(a: Date, b: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((a.getTime() - b.getTime()) / msPerDay);
}

function computeUrgency(
  scheduledDate: Date,
  deadlineDate: Date | undefined,
  today: Date,
): MarriageUrgency {
  const daysUntilScheduled = diffDays(scheduledDate, today);
  const daysUntilDeadline = deadlineDate
    ? diffDays(deadlineDate, today)
    : undefined;

  if (daysUntilDeadline !== undefined && daysUntilDeadline < 0)
    return "overdue";
  if (daysUntilDeadline !== undefined && daysUntilDeadline <= 3)
    return "urgent";
  if (daysUntilScheduled <= 0) return "soon";
  if (daysUntilScheduled <= 14) return "upcoming";
  return "future";
}

export interface MarriageTimelineOptions {
  readonly includeMoving?: boolean;
  readonly nameChanged?: boolean;
}

export function generateMarriageTimeline(
  marriageDate: Date,
  options: MarriageTimelineOptions = {},
  completedIds: ReadonlySet<string> = new Set(),
  today: Date = new Date(),
): readonly MarriageTimelineItem[] {
  const { includeMoving = false, nameChanged = true } = options;

  return DEFINITIONS.filter((def) => {
    if (!includeMoving && def.applicableConditions?.includes("引越しあり"))
      return false;
    if (!nameChanged && def.applicableConditions?.includes("姓変更あり"))
      return false;
    return true;
  }).map((def) => {
    const scheduledDate = addDays(marriageDate, def.daysFromMarriage);
    const deadlineDate =
      def.deadlineDaysFromMarriage !== undefined
        ? addDays(marriageDate, def.deadlineDaysFromMarriage)
        : undefined;
    const urgency = computeUrgency(scheduledDate, deadlineDate, today);

    return {
      ...def,
      urgency,
      completed: completedIds.has(def.id),
    };
  });
}

export function getThisWeekEvents(
  items: readonly MarriageTimelineItem[],
): readonly MarriageTimelineItem[] {
  return items.filter(
    (item) =>
      !item.completed &&
      (item.urgency === "overdue" ||
        item.urgency === "urgent" ||
        item.urgency === "soon"),
  );
}

export function getThisMonthEvents(
  items: readonly MarriageTimelineItem[],
): readonly MarriageTimelineItem[] {
  return items.filter(
    (item) =>
      !item.completed &&
      (item.urgency === "overdue" ||
        item.urgency === "urgent" ||
        item.urgency === "soon" ||
        item.urgency === "upcoming"),
  );
}

export function groupByCategory(
  items: readonly MarriageTimelineItem[],
): ReadonlyArray<{
  readonly category: MarriageCategory;
  readonly label: string;
  readonly items: readonly MarriageTimelineItem[];
}> {
  const categoryOrder: readonly MarriageCategory[] = [
    "registration",
    "name_change",
    "moving",
    "work",
    "tax",
    "benefits",
  ];

  return categoryOrder
    .map((cat) => ({
      category: cat,
      label: CATEGORY_LABELS[cat],
      items: items.filter((item) => item.category === cat),
    }))
    .filter((group) => group.items.length > 0);
}

export { CATEGORY_LABELS as MARRIAGE_CATEGORY_LABELS };
