/**
 * Extracts citation entries from MDX article content.
 * Citations follow the pattern:
 *   [N] Author. Title. Journal. Year; ...
 * They typically appear after a "## 参考文献" heading.
 */
export function extractCitations(content: string): readonly string[] {
  const refSection = content.split(/##\s*参考文献/)[1]
  if (!refSection) return []

  const lines = refSection.split("\n")
  const citations: string[] = []

  for (const line of lines) {
    const trimmed = line.trim()
    const match = trimmed.match(/^\[(\d+)\]\s*(.+)$/)
    if (match) {
      citations.push(match[2])
    }
  }

  return citations
}
