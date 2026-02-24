/**
 * すくすくナビ カスタムSVGアイコンセット
 * 水彩絵本タッチのキャラクターに合う、丸みのある手書き風アイコン
 */

import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
  className?: string;
};

const defaultProps = (size: number = 20) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth: 1.8,
});

/** 本・記事 */
export function IconBook({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <path
        d="M4 4.5C4 3.67 4.67 3 5.5 3H18a1 1 0 0 1 1 1v13H5.5A1.5 1.5 0 0 0 4 18.5v-14Z"
        stroke="currentColor"
      />
      <path d="M4 18.5A1.5 1.5 0 0 0 5.5 20H19v-3H5.5A1.5 1.5 0 0 0 4 18.5Z" stroke="currentColor" />
      <path d="M8 7h7M8 10.5h5" stroke="currentColor" />
    </svg>
  );
}

/** 注射・ワクチン */
export function IconSyringe({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <path d="M18 2L22 6" stroke="currentColor" />
      <path d="M17 7L19 5" stroke="currentColor" />
      <path d="M14 10L4 20" stroke="currentColor" strokeWidth={2} />
      <path d="M10 6L18 14" stroke="currentColor" />
      <path d="M7 13l4-4" stroke="currentColor" />
      <path d="M13 7l4 4" stroke="currentColor" />
      <path d="M3 21l1-1" stroke="currentColor" />
    </svg>
  );
}

/** 聴診器 */
export function IconStethoscope({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" stroke="currentColor" />
      <path d="M14 13a4 4 0 0 1 4 4 2 2 0 0 1-2 2 2 2 0 0 1-2-2" stroke="currentColor" />
      <circle cx="17" cy="19" r="2" stroke="currentColor" />
    </svg>
  );
}

/** 地図ピン */
export function IconMapPin({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <path d="M12 2C8.69 2 6 4.69 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.31-2.69-6-6-6Z" stroke="currentColor" />
      <circle cx="12" cy="8" r="2.5" stroke="currentColor" />
    </svg>
  );
}

/** 電卓・シミュレーター */
export function IconCalculator({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <rect x="4" y="2" width="16" height="20" rx="3" stroke="currentColor" />
      <rect x="7" y="5" width="10" height="4" rx="1.5" stroke="currentColor" />
      <circle cx="8" cy="13" r="1" fill="currentColor" />
      <circle cx="12" cy="13" r="1" fill="currentColor" />
      <circle cx="16" cy="13" r="1" fill="currentColor" />
      <circle cx="8" cy="17" r="1" fill="currentColor" />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
      <rect x="14.5" y="15.5" width="3" height="3" rx="0.5" fill="currentColor" />
    </svg>
  );
}

/** クリップボード・チェックリスト */
export function IconClipboard({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <rect x="8" y="2" width="8" height="4" rx="2" stroke="currentColor" />
      <path d="M8 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" stroke="currentColor" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" />
      <path d="M9 16h4" stroke="currentColor" />
    </svg>
  );
}

/** 建物・保育園 */
export function IconBuilding({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <path d="M3 21h18" stroke="currentColor" />
      <path d="M5 21V7l7-4 7 4v14" stroke="currentColor" />
      <path d="M9 21v-4a3 3 0 0 1 6 0v4" stroke="currentColor" />
      <rect x="9" y="9" width="2" height="2" rx="0.5" stroke="currentColor" />
      <rect x="13" y="9" width="2" height="2" rx="0.5" stroke="currentColor" />
    </svg>
  );
}

/** ユーザー・マイページ */
export function IconUser({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <circle cx="12" cy="7" r="4" stroke="currentColor" />
      <path d="M4 21c0-4 3.58-7 8-7s8 3 8 7" stroke="currentColor" />
    </svg>
  );
}

/** 赤ちゃん・子ども */
export function IconBaby({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <circle cx="12" cy="6" r="3.5" stroke="currentColor" />
      <path d="M8 14c0-2.21 1.79-4 4-4s4 1.79 4 4v1H8v-1Z" stroke="currentColor" />
      <path d="M6 15c-1.5 0-3 1-3 3h18c0-2-1.5-3-3-3" stroke="currentColor" />
      <path d="M9 6c0-1 .5-2 1.5-2.5" stroke="currentColor" strokeWidth={1.5} />
      <path d="M15 6c0-1-.5-2-1.5-2.5" stroke="currentColor" strokeWidth={1.5} />
    </svg>
  );
}

/** 検索 */
export function IconSearch({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" />
      <path d="M15.5 15.5L20 20" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
}

/** メール */
export function IconMail({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" />
      <path d="M2 7l10 7 10-7" stroke="currentColor" />
    </svg>
  );
}

/** 矢印右 */
export function IconArrowRight({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" />
    </svg>
  );
}

/** 矢印左 */
export function IconArrowLeft({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <path d="M19 12H5M11 18l-6-6 6-6" stroke="currentColor" />
    </svg>
  );
}

/** カレンダー */
export function IconCalendar({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" />
      <path d="M3 9h18" stroke="currentColor" />
      <path d="M8 2v4M16 2v4" stroke="currentColor" />
      <circle cx="8" cy="14" r="1" fill="currentColor" />
      <circle cx="12" cy="14" r="1" fill="currentColor" />
      <circle cx="16" cy="14" r="1" fill="currentColor" />
    </svg>
  );
}

/** ハート */
export function IconHeart({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <path d="M12 21C12 21 3 14.5 3 8.5a4.5 4.5 0 0 1 9-0.5 4.5 4.5 0 0 1 9 .5C21 14.5 12 21 12 21Z" stroke="currentColor" />
    </svg>
  );
}

/** 卒業帽・発達 */
export function IconGraduationCap({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <path d="M2 10l10-5 10 5-10 5-10-5Z" stroke="currentColor" />
      <path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" stroke="currentColor" />
      <path d="M22 10v5" stroke="currentColor" />
    </svg>
  );
}

/** シールド・安全 */
export function IconShield({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <path d="M12 2L4 6v6c0 5 3.58 9.5 8 11 4.42-1.5 8-6 8-11V6L12 2Z" stroke="currentColor" />
    </svg>
  );
}

/** シールドチェック */
export function IconShieldCheck({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <path d="M12 2L4 6v6c0 5 3.58 9.5 8 11 4.42-1.5 8-6 8-11V6L12 2Z" stroke="currentColor" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" />
    </svg>
  );
}

/** アラート・警告 */
export function IconAlertTriangle({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" stroke="currentColor" />
      <path d="M12 9v4M12 17h.01" stroke="currentColor" />
    </svg>
  );
}

/** 電話 */
export function IconPhone({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.61 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 3.09 4.18 2 2 0 0 1 5.07 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L9.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" stroke="currentColor" />
    </svg>
  );
}

/** ホーム */
export function IconHome({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z" stroke="currentColor" />
      <path d="M9 21V12h6v9" stroke="currentColor" />
    </svg>
  );
}

/** 星 */
export function IconStar({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" stroke="currentColor" />
    </svg>
  );
}

/** チェック */
export function IconCheck({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth={2.5} />
    </svg>
  );
}

/** チェックサークル */
export function IconCheckCircle({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" />
    </svg>
  );
}

/** バツ・閉じる */
export function IconX({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
}

/** メニュー（ハンバーガー） */
export function IconMenu({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
}

/** 下矢印（シェブロン） */
export function IconChevronDown({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
}

/** 右矢印（シェブロン） */
export function IconChevronRight({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
}

/** 左矢印（シェブロン） */
export function IconChevronLeft({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
}

/** 時計 */
export function IconClock({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" />
      <path d="M12 6v6l4 2" stroke="currentColor" />
    </svg>
  );
}

/** 外部リンク */
export function IconExternalLink({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" />
      <path d="M15 3h6v6M10 14L21 3" stroke="currentColor" />
    </svg>
  );
}

/** タグ */
export function IconTag({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" stroke="currentColor" />
      <circle cx="7" cy="7" r="1.5" fill="currentColor" />
    </svg>
  );
}

/** プラス */
export function IconPlus({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
}

/** ローダー（スピナー） */
export function IconLoader({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" />
    </svg>
  );
}

/** ブックマーク */
export function IconBookmark({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16Z" stroke="currentColor" />
    </svg>
  );
}

/** 電球・ヒント */
export function IconLightbulb({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <path d="M9 21h6M12 3a6 6 0 0 1 6 6c0 2.22-1.2 4.16-3 5.2V17H9v-2.8C7.2 13.16 6 11.22 6 9a6 6 0 0 1 6-6Z" stroke="currentColor" />
    </svg>
  );
}

/** ヘルプ・疑問符 */
export function IconHelpCircle({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" stroke="currentColor" />
    </svg>
  );
}

/** メッセージ */
export function IconMessageCircle({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z" stroke="currentColor" />
    </svg>
  );
}

/** 送信 */
export function IconSend({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7Z" stroke="currentColor" />
    </svg>
  );
}

/** ダウンロード */
export function IconDownload({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" />
    </svg>
  );
}

/** リフレッシュ */
export function IconRefreshCw({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <path d="M23 4v6h-6M1 20v-6h6" stroke="currentColor" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" stroke="currentColor" />
    </svg>
  );
}

/** ゴミ箱 */
export function IconTrash({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" />
      <path d="M10 11v6M14 11v6" stroke="currentColor" />
    </svg>
  );
}

/** ユーザーグループ */
export function IconUsers({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" />
      <circle cx="9" cy="7" r="4" stroke="currentColor" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" />
    </svg>
  );
}

/** ログアウト */
export function IconLogOut({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" />
    </svg>
  );
}

/** 位置情報 */
export function IconLocateFixed({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <circle cx="12" cy="12" r="3" stroke="currentColor" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" />
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeDasharray="2 4" />
    </svg>
  );
}

/** アクティビティ・波形 */
export function IconActivity({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
}

/** サークル */
export function IconCircle({ size = 20, className, ...props }: IconProps) {
  return (
    <svg {...defaultProps(size)} className={className} {...props}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" />
    </svg>
  );
}
