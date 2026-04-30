import { openai } from "./openAi"

export type GeneratedStockAnalysis = {
  summary: string
  healthScore: number
  topSignals: string[]
  risks: {
    title: string
    severity: "Low" | "Medium" | "Medium-High" | "High"
    description: string
  }[]
  bullCase: string[]
  bearCase: string[]
  redFlags: string[]
  mdna: {
    drivers: string[]
    concerns: string[]
  }
  revenueSegments: {
    label: string
    note: string
  }[]
  filingNotes: {
    type: string
    text: string
  }[]
}

export async function generateStockAnalysis({
  ticker,
  companyName,
  filingText,
}: {
  ticker: string
  companyName: string
  filingText: string
}): Promise<GeneratedStockAnalysis> {
  const response = await openai.responses.create({
    model: "gpt-5.4-mini",
    input: [
      {
        role: "system",
        content:
          "You are a financial filing analysis assistant. You do not give investment advice. You summarize SEC filing information into structured, factual, plain-English analysis.",
      },
      {
        role: "user",
        content: `
Analyze this company filing information.

Company: ${companyName}
Ticker: ${ticker}

Filing excerpt:
${filingText}

Return ONLY valid JSON with this exact shape:
{
  "summary": "string",
  "healthScore": number,
  "topSignals": ["string", "string", "string"],
  "risks": [
    {
      "title": "string",
      "severity": "Low | Medium | Medium-High | High",
      "description": "string"
    }
  ],
  "bullCase": ["string"],
  "bearCase": ["string"],
  "redFlags": ["string"],
  "mdna": {
    "drivers": ["string"],
    "concerns": ["string"]
  },
  "revenueSegments": [
    {
      "label": "string",
      "note": "string"
    }
  ],
  "filingNotes": [
    {
      "type": "string",
      "text": "string"
    }
  ]
}

Rules:
- Do not say buy, sell, or hold.
- Do not provide financial advice.
- Keep the summary under 90 words.
- healthScore must be 0 to 100.
- Include 3 topSignals.
- Include 3 to 5 risks.
- Include 3 to 5 bullCase items.
- Include 3 to 5 bearCase items.
- Include 2 to 4 redFlags.
- mdna.drivers should explain what management says drove performance.
- mdna.concerns should explain what management says could pressure performance.
- revenueSegments should list major business/revenue areas mentioned in the filing. If exact percentages are unavailable, use notes instead of invented percentages.
- filingNotes should summarize important filing themes, not compare to a previous filing yet.
- Do not invent exact numbers unless provided in the filing excerpt.
`,
      },
    ],
  })

  const text = response.output_text

  try {
    return JSON.parse(text) as GeneratedStockAnalysis
  } catch {
    throw new Error("OpenAI returned invalid JSON")
  }
}