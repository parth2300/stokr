export function normalizeTicker(value: unknown) {
  if (typeof value !== "string") return ""

  return value.trim().toUpperCase()
}

export function isValidTicker(ticker: string) {
  return /^[A-Z]{1,10}$/.test(ticker)
}

export function cleanRequiredText(value: unknown, maxLength = 120) {
  if (typeof value !== "string") return ""

  return value.trim().slice(0, maxLength)
}

export function cleanOptionalText(value: unknown, maxLength = 300) {
  if (typeof value !== "string") return null

  const cleaned = value.trim()

  if (!cleaned) return null

  return cleaned.slice(0, maxLength)
}

export function isValidUuid(value: unknown) {
  if (typeof value !== "string") return false

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value.trim()
  )
}