const MAX_COMPARISON_CHARS = 28000

export function prepareFilingComparisonText(text: string) {
  const riskIndex = findIndex(text, [
    "item 1a risk factors",
    "item 1a. risk factors",
  ])

  const businessIndex = findIndex(text, [
    "item 1 business",
    "item 1. business",
  ])

  const mdnaIndex = findIndex(text, [
    "item 7 management",
    "item 7. management",
    "management's discussion and analysis",
  ])

  const sections = [
    extractSection(text, businessIndex, 8000),
    extractSection(text, riskIndex, 10000),
    extractSection(text, mdnaIndex, 10000),
  ].filter(Boolean)

  const prepared = sections.length > 0 ? sections.join("\n\n--- SECTION BREAK ---\n\n") : text

  return prepared.slice(0, MAX_COMPARISON_CHARS)
}

function findIndex(text: string, candidates: string[]) {
  const lowerText = text.toLowerCase()

  for (const candidate of candidates) {
    const index = lowerText.indexOf(candidate)
    if (index !== -1) return index
  }

  return -1
}

function extractSection(text: string, startIndex: number, length: number) {
  if (startIndex === -1) return ""
  return text.slice(startIndex, startIndex + length)
}