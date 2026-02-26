import type { LineReplyFlexMessage, LineReplyTextMessage } from "./types";

const SITE_URL = "https://kgraph57.github.io/futari-navi";

// --- Welcome message (sent on follow) ---

export const WELCOME_MESSAGE: LineReplyFlexMessage = {
  type: "flex",
  altText: "ふたりナビへようこそ！結婚手続き・給付金の情報をお届けします。",
  contents: {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "ふたりナビへようこそ！",
          weight: "bold",
          size: "lg",
          color: "#0D9488",
        },
        {
          type: "text",
          text: "結婚後の届出・手続き・お金のことをサポートするツールです。給付金シミュレーター、手続きガイド、暮らしのQ&Aなどをご利用いただけます。",
          wrap: true,
          size: "sm",
          color: "#666666",
          margin: "md",
        },
      ],
      paddingAll: "xl",
    },
    footer: {
      type: "box",
      layout: "vertical",
      spacing: "sm",
      contents: [
        {
          type: "button",
          action: {
            type: "uri",
            label: "給付金をチェック",
            uri: `${SITE_URL}/simulator`,
          },
          style: "primary",
          color: "#0D9488",
        },
        {
          type: "button",
          action: {
            type: "uri",
            label: "手続きガイド",
            uri: `${SITE_URL}/checklists`,
          },
          style: "secondary",
        },
        {
          type: "button",
          action: {
            type: "uri",
            label: "サイトを開く",
            uri: SITE_URL,
          },
          style: "link",
        },
      ],
      paddingAll: "lg",
    },
  },
} as const;

// --- Keyword auto-replies ---

export const CHECKLIST_REPLY: LineReplyFlexMessage = {
  type: "flex",
  altText: "手続きガイド — 結婚後の届出・名義変更をチェック",
  contents: {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "手続きガイド",
          weight: "bold",
          size: "md",
          color: "#0D9488",
        },
        {
          type: "text",
          text: "婚姻届・名義変更・届出の進め方をステップ形式で確認できます。漏れなく手続きを完了しましょう。",
          wrap: true,
          size: "sm",
          color: "#666666",
          margin: "md",
        },
      ],
      paddingAll: "xl",
    },
    footer: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "button",
          action: {
            type: "uri",
            label: "チェックリストを開く",
            uri: `${SITE_URL}/checklists`,
          },
          style: "primary",
          color: "#0D9488",
        },
      ],
      paddingAll: "lg",
    },
  },
} as const;

export const SIMULATOR_REPLY: LineReplyFlexMessage = {
  type: "flex",
  altText: "給付金シミュレーター — 受けられる助成金を確認",
  contents: {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "給付金シミュレーター",
          weight: "bold",
          size: "md",
          color: "#0D9488",
        },
        {
          type: "text",
          text: "港区在住のご家庭が受けられる助成金・給付金を2分でチェック。年間最大84万円の支援があります。",
          wrap: true,
          size: "sm",
          color: "#666666",
          margin: "md",
        },
      ],
      paddingAll: "xl",
    },
    footer: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "button",
          action: {
            type: "uri",
            label: "シミュレーターを開く",
            uri: `${SITE_URL}/simulator`,
          },
          style: "primary",
          color: "#0D9488",
        },
      ],
      paddingAll: "lg",
    },
  },
} as const;

export const VACCINE_REPLY: LineReplyTextMessage = {
  type: "text",
  text: `手続きガイドはこちらからご確認いただけます。\n\n${SITE_URL}/articles\n\nふたりナビでは、結婚後に必要な届出・手続き・お金の情報をQ&A形式で確認できます。`,
} as const;

export const DEFAULT_REPLY: LineReplyTextMessage = {
  type: "text",
  text: `ふたりナビをご利用ありがとうございます！\n\n以下のキーワードで情報をお探しいただけます：\n・「届出」「手続き」→ 手続きガイド\n・「助成金」「給付」→ 給付金シミュレーター\n・「記事」「Q&A」→ 記事一覧\n\nサイトはこちら：\n${SITE_URL}`,
} as const;

// --- Rich Menu Layout Spec ---
//
// +------------------+------------------+
// |  手続きガイド     |  給付金シミュレ   |  Top row: 2 large
// |   (teal)         |  ーター (teal)    |
// +--------+---------+------------------+
// | タイム  | 記事を  |  マイページ      |  Bottom: 3 medium
// | ライン  |読む     |                  |
// +--------+---------+------------------+
//
// Rich Menu Image: 2500 x 1686 px
// Areas (tap regions):
//   [0] Top-left:     uri -> /checklists
//   [1] Top-right:    uri -> /simulator
//   [2] Bottom-left:  uri -> /my/timeline
//   [3] Bottom-center: uri -> /articles
//   [4] Bottom-right: uri -> /my
