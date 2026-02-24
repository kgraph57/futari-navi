// LINE Messaging API Types
// Reference: https://developers.line.biz/en/reference/messaging-api/

export interface LineWebhookBody {
  readonly destination: string;
  readonly events: readonly LineEvent[];
}

export type LineEvent =
  | LineFollowEvent
  | LineUnfollowEvent
  | LineMessageEvent;

interface LineEventBase {
  readonly replyToken?: string;
  readonly timestamp: number;
  readonly source: LineSource;
}

export interface LineFollowEvent extends LineEventBase {
  readonly type: "follow";
}

export interface LineUnfollowEvent extends LineEventBase {
  readonly type: "unfollow";
}

export interface LineMessageEvent extends LineEventBase {
  readonly type: "message";
  readonly message: LineTextMessage;
}

export interface LineTextMessage {
  readonly type: "text";
  readonly id: string;
  readonly text: string;
}

export interface LineSource {
  readonly type: "user" | "group" | "room";
  readonly userId?: string;
  readonly groupId?: string;
  readonly roomId?: string;
}

// LINE Message types for replies

export type LineReplyMessage =
  | LineReplyTextMessage
  | LineReplyFlexMessage;

export interface LineReplyTextMessage {
  readonly type: "text";
  readonly text: string;
}

export interface LineReplyFlexMessage {
  readonly type: "flex";
  readonly altText: string;
  readonly contents: LineFlexContainer;
}

export interface LineFlexContainer {
  readonly type: "bubble";
  readonly body?: LineFlexBox;
  readonly footer?: LineFlexBox;
}

export interface LineFlexBox {
  readonly type: "box";
  readonly layout: "vertical" | "horizontal";
  readonly contents: readonly LineFlexComponent[];
  readonly spacing?: string;
  readonly paddingAll?: string;
}

export type LineFlexComponent =
  | LineFlexText
  | LineFlexButton
  | LineFlexSeparator;

export interface LineFlexText {
  readonly type: "text";
  readonly text: string;
  readonly weight?: "regular" | "bold";
  readonly size?: string;
  readonly color?: string;
  readonly wrap?: boolean;
  readonly margin?: string;
}

export interface LineFlexButton {
  readonly type: "button";
  readonly action: LineAction;
  readonly style?: "primary" | "secondary" | "link";
  readonly color?: string;
  readonly margin?: string;
}

export interface LineFlexSeparator {
  readonly type: "separator";
  readonly margin?: string;
}

export interface LineAction {
  readonly type: "uri" | "message" | "postback";
  readonly label: string;
  readonly uri?: string;
  readonly text?: string;
  readonly data?: string;
}
