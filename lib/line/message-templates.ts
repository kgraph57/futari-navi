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
            label: "症状チェック",
            uri: `${SITE_URL}/triage`,
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

export const TRIAGE_REPLY: LineReplyFlexMessage = {
  type: "flex",
  altText: "受診判断ガイド — お子さんの症状をチェックできます",
  contents: {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "受診判断ガイド",
          weight: "bold",
          size: "md",
          color: "#DC2626",
        },
        {
          type: "text",
          text: "届出・手続きの進め方をステップ形式で確認できます。くらしアドバイザーのみなと先生が監修。",
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
            label: "症状チェックを始める",
            uri: `${SITE_URL}/triage`,
          },
          style: "primary",
          color: "#DC2626",
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
// |   症状チェック    |  給付金シミュレ   |  Top row: 2 large
// |   (red-500)      |  ーター (teal)    |
// +--------+---------+------------------+
// | 予防接種| 記事を  |  マイページ      |  Bottom: 3 medium
// |スケジュール|読む  |                  |
// +--------+---------+------------------+
//
// Rich Menu Image: 2500 x 1686 px
// Areas (tap regions):
//   [0] Top-left:     uri -> /triage
//   [1] Top-right:    uri -> /simulator
//   [2] Bottom-left:  uri -> /vaccines
//   [3] Bottom-center: uri -> /articles
//   [4] Bottom-right: uri -> /my
