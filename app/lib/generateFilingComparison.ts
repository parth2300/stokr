import { openai } from "./openAi"

export type FilingComparison = {
  summary: string
  changes: {
    type: string
    severity: "Low" | "Medium" | "Medium-High" | "High"
    text: string
  }[]
  riskChanges: string[]
  businessChanges: string[]
  mdnaChanges: string[]
}

export async function generateFilingComparison({
  ticker,
  companyName,
  latestFilingText,
  previousFilingText,
}: {
  ticker: string
  companyName: string
  latestFilingText: string
  previousFilingText: string
}): Promise<FilingComparison> {
  const response = await openai.responses.create({
    model: "gpt-5.4-mini",
    input: [
      {
        role: "system",
        content:
          "You compare SEC filings. You identify factual changes in language, risk emphasis, business discussion, and management commentary. You do not give investment advice.",
      },
      {
        role: "user",
        content: `
Compare these two annual SEC filing excerpts.

Company: ${companyName}
Ticker: ${ticker}

LATEST FILING:
${latestFilingText}

PREVIOUS FILING:
${previousFilingText}

Return ONLY valid JSON with this exact shape:
{
  "summary": "string",
  "changes": [
    {
      "type": "string",
      "severity": "Low | Medium | Medium-High | High",
      "text": "string"
    }
  ],
  "riskChanges": ["string"],
  "businessChanges": ["string"],
  "mdnaChanges": ["string"]
}

Rules:
- Do not give buy, sell, or hold advice.
- Do not invent facts.
- Focus on what changed between filings.
- Keep the summary under 80 words.
- Include 3 to 6 changes.
- riskChanges should focus on risk-factor wording or emphasis.
- businessChanges should focus on business model, segment, product, or strategy changes.
- mdnaChanges should focus on management discussion, performance drivers, costs, margins, or outlook.
`,
      },
    ],
  })

  try {
    return JSON.parse(response.output_text) as FilingComparison
  } catch {
    throw new Error("OpenAI returned invalid filing comparison JSON")
  }
}