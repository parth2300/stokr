"use client"

import type { RefObject } from "react"
import type { ShareTemplate } from "./shareTemplates"
import {
  createShareCardData,
  SHARE_DISCLAIMER,
  type ShareAnalysisReport,
  truncateText,
} from "./shareUtils"

type ShareCardPreviewProps = {
  report: ShareAnalysisReport
  template: ShareTemplate
  cardRef?: RefObject<HTMLDivElement | null>
}

type BlockProps = {
  label: string
  children: string
  tone?: "blue" | "green" | "red" | "amber"
}

const toneStyles = {
  blue: "border-[#7C9DFF]/35 bg-[#7C9DFF]/10 text-[#DDE5FF]",
  green: "border-emerald-300/25 bg-emerald-400/10 text-emerald-50",
  red: "border-red-300/25 bg-red-400/10 text-red-50",
  amber: "border-amber-300/25 bg-amber-400/10 text-amber-50",
}

function InsightBlock({ label, children, tone = "blue" }: BlockProps) {
  return (
    <div className={`rounded-[30px] border p-[34px] ${toneStyles[tone]}`}>
      <p className="text-[25px] font-bold uppercase tracking-[0.16em] opacity-80">{label}</p>
      <p className="mt-[18px] text-[38px] font-semibold leading-[1.18]">{children}</p>
    </div>
  )
}

function ScoreBadge({ scoreText, large = false }: { scoreText: string; large?: boolean }) {
  return (
    <div
      className={`flex shrink-0 flex-col items-center justify-center rounded-full border border-[#7C9DFF]/55 bg-[#7C9DFF]/15 text-white shadow-[0_0_70px_rgba(124,157,255,0.22)] ${
        large ? "h-[440px] w-[440px]" : "h-[280px] w-[280px]"
      }`}
    >
      <p className={`${large ? "text-[112px]" : "text-[72px]"} font-black leading-none`}>
        {scoreText}
      </p>
      <p className={`${large ? "mt-[26px] text-[34px]" : "mt-[16px] text-[24px]"} font-bold uppercase tracking-[0.18em] text-[#C7D2FE]`}>
        Overall Score
      </p>
    </div>
  )
}

function BrandFooter({ includeDisclaimer = false }: { includeDisclaimer?: boolean }) {
  return (
    <div className="flex items-end justify-between gap-[32px] border-t border-white/10 pt-[28px]">
      <div>
        <p className="text-[34px] font-black tracking-normal text-white">stokr.live</p>
        <p className="mt-[8px] text-[20px] font-semibold uppercase tracking-[0.2em] text-[#7C9DFF]">
          AI filing research
        </p>
      </div>

      {includeDisclaimer && (
        <p className="max-w-[620px] text-right text-[22px] leading-[1.35] text-slate-400">
          {SHARE_DISCLAIMER}
        </p>
      )}
    </div>
  )
}

function Header({
  ticker,
  companyName,
  generatedAt,
  compact = false,
}: {
  ticker: string
  companyName: string
  generatedAt: string
  compact?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-[28px]">
      <div>
        <p className={`${compact ? "text-[28px]" : "text-[34px]"} font-black uppercase tracking-[0.2em] text-[#7C9DFF]`}>
          {ticker}
        </p>
        <h2 className={`${compact ? "mt-[12px] text-[54px]" : "mt-[18px] text-[72px]"} max-w-[780px] font-black leading-[0.98] text-white`}>
          {companyName}
        </h2>
      </div>

      {generatedAt && (
        <p className="max-w-[260px] text-right text-[22px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          Generated {generatedAt}
        </p>
      )}
    </div>
  )
}

export default function ShareCardPreview({ report, template, cardRef }: ShareCardPreviewProps) {
  const data = createShareCardData(report)
  const summary = truncateText(data.summary, template.id === "linkedin" ? 300 : 185)
  const bull = truncateText(data.bullCase[0], template.id === "linkedin" ? 210 : 150)
  const bear = truncateText(data.bearCase[0], template.id === "linkedin" ? 210 : 150)
  const risk = truncateText(data.topRisks[0], template.id === "linkedin" ? 230 : 150)

  if (template.id === "x-twitter") {
    return (
      <div
        ref={cardRef}
        style={{ width: template.width, height: template.height }}
        className="relative overflow-hidden bg-[#0F172A] p-[70px] font-sans text-white"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(124,157,255,0.24),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0)_40%)]" />
        <div className="relative z-10 flex h-full flex-col justify-between">
          <div className="flex items-start justify-between gap-[64px]">
            <Header
              ticker={data.ticker}
              companyName={data.companyName}
              generatedAt={data.generatedAt}
              compact
            />
            <ScoreBadge scoreText={data.scoreText} />
          </div>

          <p className="max-w-[1180px] text-[42px] font-semibold leading-[1.18] text-slate-100">
            {summary}
          </p>

          <div className="grid grid-cols-2 gap-[28px]">
            <InsightBlock label="Bull Case" tone="green">
              {bull}
            </InsightBlock>
            <InsightBlock label="Bear Case" tone="red">
              {bear}
            </InsightBlock>
          </div>

          <BrandFooter />
        </div>
      </div>
    )
  }

  if (template.id === "instagram-story") {
    return (
      <div
        ref={cardRef}
        style={{ width: template.width, height: template.height }}
        className="relative overflow-hidden bg-[#0F172A] p-[70px] font-sans text-white"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(124,157,255,0.26),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0)_45%)]" />
        <div className="relative z-10 flex h-full flex-col justify-between">
          <Header ticker={data.ticker} companyName={data.companyName} generatedAt={data.generatedAt} />

          <div className="flex justify-center">
            <ScoreBadge scoreText={data.scoreText} large />
          </div>

          <div className="space-y-[28px]">
            <InsightBlock label="Bull Case" tone="green">
              {bull}
            </InsightBlock>
            <InsightBlock label="Bear Case" tone="red">
              {bear}
            </InsightBlock>
            <InsightBlock label="Top Risks" tone="amber">
              {risk}
            </InsightBlock>
          </div>

          <BrandFooter />
        </div>
      </div>
    )
  }

  if (template.id === "tiktok-reels") {
    return (
      <div
        ref={cardRef}
        style={{ width: template.width, height: template.height }}
        className="relative overflow-hidden bg-[#0F172A] p-[72px] font-sans text-white"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(124,157,255,0.28),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0)_50%)]" />
        <div className="relative z-10 flex h-full flex-col justify-between">
          <Header ticker={data.ticker} companyName={data.companyName} generatedAt={data.generatedAt} />

          <div>
            <p className="text-[34px] font-black uppercase tracking-[0.18em] text-[#7C9DFF]">
              What stands out
            </p>
            <p className="mt-[22px] text-[56px] font-black leading-[1.05] text-white">
              {truncateText(data.financialHealth !== "Financial health context unavailable in this report." ? data.financialHealth : summary, 155)}
            </p>
          </div>

          <div className="flex justify-center">
            <ScoreBadge scoreText={data.scoreText} large />
          </div>

          <div className="grid gap-[28px]">
            <InsightBlock label="Bull Case" tone="green">
              {bull}
            </InsightBlock>
            <InsightBlock label="Bear Case" tone="red">
              {bear}
            </InsightBlock>
          </div>

          <BrandFooter />
        </div>
      </div>
    )
  }

  const isLinkedIn = template.id === "linkedin"

  return (
    <div
      ref={cardRef}
      style={{ width: template.width, height: template.height }}
      className="relative overflow-hidden bg-[#0F172A] p-[66px] font-sans text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(124,157,255,0.21),transparent_32%),linear-gradient(145deg,rgba(255,255,255,0.07),rgba(255,255,255,0)_45%)]" />
      <div className="relative z-10 flex h-full flex-col justify-between">
        <Header ticker={data.ticker} companyName={data.companyName} generatedAt={data.generatedAt} />

        <div className="flex items-center justify-center">
          <ScoreBadge scoreText={data.scoreText} large={false} />
        </div>

        <div>
          <p className="text-[28px] font-black uppercase tracking-[0.18em] text-[#7C9DFF]">
            {isLinkedIn ? "Filing research summary" : "Summary"}
          </p>
          <p className={`${isLinkedIn ? "text-[40px]" : "text-[38px]"} mt-[18px] font-semibold leading-[1.2] text-slate-100`}>
            {summary}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-[28px]">
          <InsightBlock label="Bull Case" tone="green">
            {bull}
          </InsightBlock>
          <InsightBlock label="Bear Case" tone="red">
            {bear}
          </InsightBlock>
        </div>

        <InsightBlock label="Top Risks" tone="amber">
          {risk}
        </InsightBlock>

        <BrandFooter includeDisclaimer={isLinkedIn} />
      </div>
    </div>
  )
}
