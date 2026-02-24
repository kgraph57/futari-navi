const CHARS_PER_MINUTE_JA = 500;

export function estimateReadingTime(content: string): number {
  const cleaned = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[.*?\]\(.*?\)/g, "")
    .replace(/[#*_~`>|-]/g, "")
    .replace(/\s+/g, "");

  const charCount = cleaned.length;
  const minutes = Math.ceil(charCount / CHARS_PER_MINUTE_JA);
  return Math.max(1, minutes);
}
