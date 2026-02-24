import type { LineEvent, LineReplyMessage } from "./types";
import {
  WELCOME_MESSAGE,
  TRIAGE_REPLY,
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

  if (
    /熱|発熱|ねつ|はつねつ|咳|せき|嘔吐|下痢|発疹|けいれん/.test(normalized)
  ) {
    return [TRIAGE_REPLY];
  }

  if (/助成|給付|補助|お金|手当|医療費|出産/.test(normalized)) {
    return [SIMULATOR_REPLY];
  }

  if (/ワクチン|予防接種|注射|接種/.test(normalized)) {
    return [VACCINE_REPLY];
  }

  return [DEFAULT_REPLY];
}
