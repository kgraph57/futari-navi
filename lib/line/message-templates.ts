import type { LineReplyFlexMessage, LineReplyTextMessage } from "./types";

const SITE_URL = "https://kgraph57.github.io/sukusuku-navi";

// --- Welcome message (sent on follow) ---

export const WELCOME_MESSAGE: LineReplyFlexMessage = {
  type: "flex",
  altText: "すくすくナビへようこそ！港区の子育て情報をお届けします。",
  contents: {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "すくすくナビへようこそ！",
          weight: "bold",
          size: "lg",
          color: "#0D9488",
        },
        {
          type: "text",
          text: "港区の小児科医おかもんが作った子育て支援ツールです。給付金シミュレーター、受診判断ガイド、予防接種スケジュールなどをご利用いただけます。",
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
          text: "お子さんの症状から、今すぐ受診すべきか、明日でいいかを30秒で判断できます。小児科医おかもん先生が監修。",
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
  text: `予防接種スケジュールはこちらからご確認いただけます。\n\n${SITE_URL}/vaccines\n\nすくすくナビでは、お子さんの年齢に合わせた接種スケジュールや、港区の助成対象ワクチンの情報を確認できます。`,
} as const;

export const DEFAULT_REPLY: LineReplyTextMessage = {
  type: "text",
  text: `すくすくナビをご利用ありがとうございます！\n\n以下のキーワードで情報をお探しいただけます：\n・「熱」「発熱」→ 受診判断ガイド\n・「助成金」「給付」→ 給付金シミュレーター\n・「ワクチン」「予防接種」→ 接種スケジュール\n\nサイトはこちら：\n${SITE_URL}`,
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
