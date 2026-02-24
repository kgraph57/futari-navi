import Image from "next/image";

/**
 * 水彩絵本テイストのアイコン画像コンポーネント
 * lucide-react の代替として使用する
 */

export type WatercolorIconName =
  | "syringe"
  | "stethoscope"
  | "book"
  | "calendar"
  | "mappin"
  | "search"
  | "mail"
  | "heart"
  | "phone"
  | "star"
  | "shield"
  | "check"
  | "clipboard"
  | "calculator"
  | "home"
  | "building"
  | "clock"
  | "alert"
  | "baby"
  | "tag"
  | "arrow_right"
  | "arrow_left"
  | "chevron_down"
  | "chevron_right"
  | "chevron_left"
  | "user"
  | "users"
  | "bookmark"
  | "lightbulb"
  | "message"
  | "external"
  | "download"
  | "help"
  | "plus"
  | "send"
  | "x"
  | "menu"
  | "refresh"
  | "trash"
  | "logout"
  | "graduation"
  | "sparkles"
  | "map"
  | "locate"
  | "activity"
  | "loader"
  | "district"
  | "household"
  | "income"
  | "work";

const ICON_MAP: Record<WatercolorIconName, string> = {
  syringe: "/icons/icon_syringe.png",
  stethoscope: "/icons/icon_stethoscope.png",
  book: "/icons/icon_book.png",
  calendar: "/icons/icon_calendar.png",
  mappin: "/icons/icon_mappin.png",
  search: "/icons/icon_search.png",
  mail: "/icons/icon_mail.png",
  heart: "/icons/icon_heart.png",
  phone: "/icons/icon_phone.png",
  star: "/icons/icon_star.png",
  shield: "/icons/icon_shield.png",
  check: "/icons/icon_check.png",
  clipboard: "/icons/icon_clipboard.png",
  calculator: "/icons/icon_calculator.png",
  home: "/icons/icon_home.png",
  building: "/icons/icon_building.png",
  clock: "/icons/icon_clock.png",
  alert: "/icons/icon_alert.png",
  baby: "/icons/icon_baby.png",
  tag: "/icons/icon_tag.png",
  arrow_right: "/icons/icon_arrow_right.png",
  arrow_left: "/icons/icon_arrow_left.png",
  chevron_down: "/icons/icon_chevron_down.png",
  chevron_right: "/icons/icon_chevron_right.png",
  chevron_left: "/icons/icon_chevron_left.png",
  user: "/icons/icon_user.png",
  users: "/icons/icon_users.png",
  bookmark: "/icons/icon_bookmark.png",
  lightbulb: "/icons/icon_lightbulb.png",
  message: "/icons/icon_message.png",
  external: "/icons/icon_external.png",
  download: "/icons/icon_download.png",
  help: "/icons/icon_help.png",
  plus: "/icons/icon_plus.png",
  send: "/icons/icon_send.png",
  x: "/icons/icon_x.png",
  menu: "/icons/icon_menu.png",
  refresh: "/icons/icon_refresh.png",
  trash: "/icons/icon_trash.png",
  logout: "/icons/icon_logout.png",
  graduation: "/icons/icon_graduation.png",
  sparkles: "/icons/icon_sparkles.png",
  map: "/icons/icon_map.png",
  locate: "/icons/icon_locate.png",
  activity: "/icons/icon_activity.png",
  loader: "/icons/icon_loader.png",
  district: "/icons/icon_district.png",
  household: "/icons/icon_household.png",
  income: "/icons/icon_income.png",
  work: "/icons/icon_work.png",
};

// GitHub Pages デプロイ時のbasePath対応
// unoptimized: true の場合、Next.jsのImageコンポーネントはbasePath付与しないため手動で対応
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function withBasePath(path: string): string {
  if (BASE_PATH && path.startsWith("/")) {
    return `${BASE_PATH}${path}`;
  }
  return path;
}

interface WatercolorIconProps {
  name: WatercolorIconName;
  size?: number;
  className?: string;
  alt?: string;
}

export function WatercolorIcon({
  name,
  size = 32,
  className = "",
  alt = "",
}: WatercolorIconProps) {
  const src = withBasePath(ICON_MAP[name]);
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      unoptimized
      className={`object-contain drop-shadow-sm ${className}`}
    />
  );
}

/**
 * インラインで使いやすいラッパー（lucide-react の className="h-X w-X" 互換）
 */
export function WatercolorIconInline({
  name,
  className = "h-6 w-6",
  alt = "",
}: {
  name: WatercolorIconName;
  className?: string;
  alt?: string;
}) {
  const src = withBasePath(ICON_MAP[name]);
  // className から h-X / w-X を抽出してサイズを推定
  const sizeMatch = className.match(/h-(\d+)/);
  const size = sizeMatch ? parseInt(sizeMatch[1]) * 4 : 24;
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      unoptimized
      className={`inline-block object-contain drop-shadow-sm ${className}`}
    />
  );
}
