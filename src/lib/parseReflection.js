/**
 * Parse a Claude reflection that may contain a framework citations marker.
 *
 * Claude is instructed to end every reflection with:
 *   ---FRAMEWORKS: Framework 1, Framework 2, Framework 3
 *
 * Returns { text, frameworks } where:
 *   text       – the reflection prose, marker stripped
 *   frameworks – array of framework name strings (empty if marker absent)
 *
 * Gracefully handles old reflections stored without the marker.
 */
export function parseReflection(raw) {
  if (!raw) return { text: '', frameworks: [] }

  const MARKER = '---FRAMEWORKS:'
  const idx = raw.indexOf(MARKER)

  if (idx === -1) return { text: raw.trim(), frameworks: [] }

  const text = raw.slice(0, idx).trim()
  const frameworks = raw
    .slice(idx + MARKER.length)
    .split(',')
    .map((f) => f.trim())
    .filter(Boolean)

  return { text, frameworks }
}
