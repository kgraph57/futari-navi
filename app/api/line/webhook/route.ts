import { type NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import type { LineWebhookBody } from "@/lib/line/types";
import { handleLineEvent } from "@/lib/line/webhook-handler";

function verifySignature(body: string, signature: string | null): boolean {
  const channelSecret = process.env.LINE_CHANNEL_SECRET;
  if (!channelSecret || !signature) return false;

  const hash = crypto
    .createHmac("SHA256", channelSecret)
    .update(body)
    .digest("base64");

  return crypto.timingSafeEqual(
    Buffer.from(hash),
    Buffer.from(signature),
  );
}

async function replyToLine(
  replyToken: string,
  messages: readonly unknown[],
): Promise<void> {
  const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!accessToken) return;

  await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      replyToken,
      messages,
    }),
  });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-line-signature");

  if (!verifySignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const parsed: LineWebhookBody = JSON.parse(body);

  const replyPromises = parsed.events.map(async (event) => {
    const replies = handleLineEvent(event);
    if (replies.length > 0 && event.replyToken) {
      await replyToLine(event.replyToken, replies);
    }
  });

  await Promise.all(replyPromises);

  return NextResponse.json({ ok: true });
}
