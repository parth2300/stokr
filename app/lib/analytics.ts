type EventParams = Record<string, string | number | boolean | null | undefined>

declare global {
  interface Window {
    gtag?: (command: "event", eventName: string, params?: EventParams) => void
  }
}

export function trackEvent(eventName: string, params: EventParams = {}) {
  if (typeof window === "undefined") return
  if (typeof window.gtag !== "function") return

  window.gtag("event", eventName, params)
}

export function trackSignUp(method = "email") {
  trackEvent("sign_up", { method })
}

export function trackLogin(method = "email") {
  trackEvent("login", { method })
}

export function trackSearchStock(query: string) {
  trackEvent("search", { search_term: query })
}

export function trackViewStockReport(ticker: string) {
  trackEvent("view_stock_report", { ticker })
}

export function trackGenerateReport(ticker: string) {
  trackEvent("generate_report", { ticker })
}

export function trackAddToWatchlist(ticker: string) {
  trackEvent("add_to_watchlist", { ticker })
}

export function trackClickUpgrade(source = "unknown") {
  trackEvent("click_upgrade", { source })
}

export function trackBeginCheckout(plan = "premium") {
  trackEvent("begin_checkout", { plan })
}

export function trackPurchase(plan = "premium", value = 9.99, currency = "USD") {
  trackEvent("purchase", { plan, value, currency })
}

export function trackReportLimitReached(ticker?: string) {
  trackEvent("report_limit_reached", { ticker })
}

export function trackPremiumPreviewSeen(ticker?: string, source = "stock_report") {
  trackEvent("premium_preview_seen", { ticker, source })
}

export function trackPremiumPreviewClick(ticker?: string, source = "stock_report") {
  trackEvent("premium_preview_click", { ticker, source })
}

export function trackShareAnalysisOpen(ticker?: string, source = "stock_report") {
  trackEvent("share_analysis_open", { ticker, source })
}

export function trackShareAnalysisTemplateSelected(ticker?: string, template?: string) {
  trackEvent("share_analysis_template_selected", { ticker, template })
}

export function trackShareAnalysisDownload(ticker?: string, template?: string) {
  trackEvent("share_analysis_download", { ticker, template })
}

export function trackShareAnalysisCopyLink(ticker?: string) {
  trackEvent("share_analysis_copy_link", { ticker })
}

export function trackShareAnalysisNativeShare(ticker?: string, template?: string) {
  trackEvent("share_analysis_native_share", { ticker, template })
}

export function trackComparePageView() {
  trackEvent("compare_page_view", { source: "compare" })
}

export function trackCompareStocksSubmit(
  tickerA: string,
  tickerB: string,
  accessTier = "unknown"
) {
  trackEvent("compare_stocks_submit", {
    ticker_a: tickerA,
    ticker_b: tickerB,
    access_tier: accessTier,
    source: "compare",
  })
}

export function trackCompareLimitReached(tickerA: string, tickerB: string) {
  trackEvent("compare_limit_reached", {
    ticker_a: tickerA,
    ticker_b: tickerB,
    source: "compare",
  })
}

export function trackCompareUpgradeClick() {
  trackEvent("compare_upgrade_click", { source: "compare" })
}

export function trackGlossarySearch(query: string) {
  trackEvent("glossary_search", { query })
}

export function trackResourceView(slug: string) {
  trackEvent("resource_view", { slug })
}
