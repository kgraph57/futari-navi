import type { LineEvent, LineReplyMessage } from "./types";
import {
  WELCOME_MESSAGE,
  CHECKLIST_REPLY,
  SIMULATOR_REPLY,
  VACCINE_REPLY,
  DEFAULT_REPLY,
} from "./message-templates";

/**
 * Process a LINE webhook event and return reply messages.
 * Pure function — no side effects.
 */
export function handleLineEvent(
  event: LineEvent,
): readonly LineReplyMessage[] {
  switch (event.type) {
    case "follow":
      return [WELCOME_MESSAGE];
    case "message":
      if (event.message.type === "text") {
        return handleTextMessage(event.message.text);
      }
      return [];
    case "unfollow":
      return [];
    default:
      return [];
  }
}

function handleTextMessage(
  text: string,
): readonly LineReplyMessage[] {
  const normalized = text.toLowerCase().trim();

  if (/届出|届け出|婚姻届|手続き|名義変更|戸籍/.test(normalized)) {
    return [CHECKLIST_REPLY];
  }

  if (/助成|給付|補助|お金|手当|控除|結婚新生活/.test(normalized)) {
    return [SIMULATOR_REPLY];
  }

  if (/記事|ガイド|Q&A|コラム/.test(normalized)) {
    return [VACCINE_REPLY];
  }

  return [DEFAULT_REPLY];
}
