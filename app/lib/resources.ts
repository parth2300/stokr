export type ResourceSection = {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export type ResourceLink = {
  href: string
  label: string
}

export type Resource = {
  slug: string
  title: string
  description: string
  category: string
  readTime: string
  sections: ResourceSection[]
  relatedLinks: ResourceLink[]
}

function link(href: string, label: string): ResourceLink {
  return { href, label }
}

export const resources: Resource[] = [
  {
    slug: "stock-research-checklist",
    title: "Stock Research Checklist",
    description: "A simple checklist for researching a stock before making a decision.",
    category: "Checklist",
    readTime: "7 min read",
    relatedLinks: [
      link("/blog/how-to-research-a-stock-before-buying", "How to research a stock before buying"),
      link("/blog/bull-case-vs-bear-case", "Bull case vs bear case"),
      link("/compare", "Compare stocks"),
      link("/stocks/aapl", "AAPL stock report"),
    ],
    sections: [
      {
        heading: "Understand what the company does",
        paragraphs: [
          "Write a plain-English explanation of the business before looking at metrics. Include what the company sells, who pays for it, and what could make demand rise or fall.",
        ],
        bullets: ["Products or services", "Main customers", "Revenue drivers", "Important competitors"],
      },
      {
        heading: "Review revenue and profitability",
        paragraphs: [
          "Read revenue growth together with gross margin, operating margin, and net income. Growth is more useful when you understand whether the company is becoming more or less profitable.",
        ],
      },
      {
        heading: "Check cash flow and debt",
        paragraphs: [
          "Use cash flow and debt to understand financial flexibility. A company with strong earnings but weak cash generation may deserve more review.",
        ],
      },
      {
        heading: "Read risk factors",
        paragraphs: [
          "Risk factors can show customer concentration, regulation, competition, debt pressure, supply constraints, or other issues that could affect the business.",
        ],
      },
      {
        heading: "Compare bull and bear cases",
        paragraphs: [
          "Write the positive case and the cautious case side by side. This helps avoid only looking for information that supports one early opinion.",
        ],
      },
      {
        heading: "Review valuation carefully",
        paragraphs: [
          "Valuation should be read with growth, margins, cash flow, debt, and risk. A valuation metric alone does not make a company attractive or unattractive.",
        ],
      },
      {
        heading: "Save notes and revisit later",
        paragraphs: [
          "Keep a short research note with open questions. Revisit it after earnings reports, 10-Q filings, or major business updates.",
        ],
      },
      {
        heading: "How stokr can help",
        paragraphs: [
          "stokr organizes filing summaries, financial context, risk factors, and bull vs bear cases so the research checklist is easier to follow.",
        ],
      },
    ],
  },
  {
    slug: "10-k-reading-checklist",
    title: "10-K Reading Checklist",
    description: "A beginner-friendly checklist for reading an annual report.",
    category: "SEC Filings",
    readTime: "6 min read",
    relatedLinks: [
      link("/blog/what-is-a-10-k", "What is a 10-K?"),
      link("/blog/what-is-mda", "What is MD&A?"),
      link("/blog/what-is-a-10-q", "What is a 10-Q?"),
      link("/stocks/msft", "MSFT stock report"),
    ],
    sections: [
      {
        heading: "Business overview",
        paragraphs: [
          "Start with the business overview. Identify products, customers, segments, geography, and how the company says it makes money.",
        ],
      },
      {
        heading: "Risk factors",
        paragraphs: [
          "Scan for risks that are specific, repeated, newly added, or connected to revenue, operations, debt, regulation, or competition.",
        ],
      },
      {
        heading: "Management discussion and analysis",
        paragraphs: [
          "Use MD&A to understand how management explains the year. Compare the explanation with the income statement, balance sheet, and cash flow statement.",
        ],
      },
      {
        heading: "Financial statements",
        paragraphs: [
          "Review the income statement, balance sheet, and cash flow statement together. Each statement answers a different question about the business.",
        ],
      },
      {
        heading: "Legal proceedings",
        paragraphs: [
          "Legal proceedings can highlight disputes, regulatory matters, or other issues that may affect the company. Read them as context, not automatic conclusions.",
        ],
      },
      {
        heading: "Segment information",
        paragraphs: [
          "Segment reporting can show which parts of the business are growing, profitable, or under pressure.",
        ],
      },
      {
        heading: "What changed from previous filings",
        paragraphs: [
          "Compare key language and metrics with prior filings. New risk language, changed segment commentary, or different MD&A emphasis can be useful research prompts.",
        ],
      },
      {
        heading: "How stokr can help",
        paragraphs: [
          "stokr helps summarize annual filing information and organize it into plain-English research sections.",
        ],
      },
    ],
  },
  {
    slug: "risk-factor-checklist",
    title: "Risk Factor Checklist",
    description: "A framework for reviewing company risk factors in SEC filings.",
    category: "Risk Analysis",
    readTime: "6 min read",
    relatedLinks: [
      link("/blog/how-to-use-risk-factors", "How to use risk factors"),
      link("/blog/what-are-risk-factors-in-a-10-k", "What are risk factors in a 10-K?"),
      link("/blog/how-to-find-red-flags-in-a-10-k", "How to find red flags in a 10-K"),
      link("/stocks/tsla", "TSLA stock report"),
    ],
    sections: [
      {
        heading: "Identify business risks",
        paragraphs: [
          "Look for risks tied to demand, products, suppliers, operations, customers, or business model changes.",
        ],
      },
      {
        heading: "Identify financial risks",
        paragraphs: [
          "Read for debt, liquidity, cash flow, interest rate, capital spending, or financing risks.",
        ],
      },
      {
        heading: "Identify competitive risks",
        paragraphs: [
          "Competitive risks may involve pricing pressure, new entrants, product substitutes, or loss of market position.",
        ],
      },
      {
        heading: "Identify regulatory risks",
        paragraphs: [
          "Regulation can affect costs, product approvals, compliance, reporting, or how a company can operate.",
        ],
      },
      {
        heading: "Look for new or repeated risks",
        paragraphs: [
          "Repeated risks can show persistent pressure. New or expanded risks can show what has become more relevant since the prior filing.",
        ],
      },
      {
        heading: "Connect risks to revenue and operations",
        paragraphs: [
          "A risk is more useful when you connect it to the parts of the business it could affect.",
        ],
      },
      {
        heading: "Avoid treating risks as predictions",
        paragraphs: [
          "Risk factors are disclosures, not forecasts. Use them to ask better questions, not to assume an outcome.",
        ],
      },
      {
        heading: "How stokr can help",
        paragraphs: [
          "stokr surfaces risk themes from filings and places them beside financial context and bull vs bear summaries.",
        ],
      },
    ],
  },
  {
    slug: "financial-metrics-cheat-sheet",
    title: "Financial Metrics Cheat Sheet",
    description: "A plain-English cheat sheet for common stock research metrics.",
    category: "Financial Metrics",
    readTime: "8 min read",
    relatedLinks: [
      link("/blog/what-is-market-cap", "What is market cap?"),
      link("/blog/what-is-free-cash-flow", "What is free cash flow?"),
      link("/blog/what-is-eps", "What is EPS?"),
      link("/glossary", "Investing glossary"),
    ],
    sections: [
      {
        heading: "Market cap",
        paragraphs: ["Market cap is the market value of a company's equity. It helps frame company size but does not explain financial health by itself."],
      },
      {
        heading: "Revenue growth",
        paragraphs: ["Revenue growth shows sales expansion. Read it with margins and cash flow to understand the quality of growth."],
      },
      {
        heading: "EPS",
        paragraphs: ["Earnings per share shows profit attributed to each share. It can be affected by net income, share count, and one-time items."],
      },
      {
        heading: "Free cash flow",
        paragraphs: ["Free cash flow is cash left after operating needs and capital spending. It helps show whether earnings are turning into cash."],
      },
      {
        heading: "Operating margin and gross margin",
        paragraphs: ["Gross margin focuses on direct costs. Operating margin includes operating expenses and shows core operating profitability."],
      },
      {
        heading: "Debt-to-equity and return on equity",
        paragraphs: ["Debt-to-equity helps frame leverage. Return on equity compares profit with shareholders' equity, but it should be read with debt."],
      },
      {
        heading: "P/E ratio and net income",
        paragraphs: ["The P/E ratio compares price with earnings. Net income is accounting profit after expenses, interest, taxes, and other items."],
      },
    ],
  },
  {
    slug: "bull-bear-case-template",
    title: "Bull vs Bear Case Template",
    description: "A simple framework for building both sides of a stock research thesis.",
    category: "Stock Research",
    readTime: "5 min read",
    relatedLinks: [
      link("/blog/bull-case-vs-bear-case", "Bull case vs bear case"),
      link("/blog/how-to-research-a-stock-before-buying", "How to research a stock"),
      link("/compare", "Compare stocks"),
    ],
    sections: [
      {
        heading: "What is the bull case?",
        paragraphs: [
          "The bull case is the positive research argument. It may focus on growth, margins, cash flow, competitive position, or improving execution.",
        ],
      },
      {
        heading: "What is the bear case?",
        paragraphs: [
          "The bear case is the cautious research argument. It may focus on slowing growth, debt, competition, valuation, execution, or disclosed risks.",
        ],
      },
      {
        heading: "Why both sides matter",
        paragraphs: [
          "Both sides make assumptions visible. That helps beginners avoid building research around only one preferred outcome.",
        ],
      },
      {
        heading: "Questions to ask",
        paragraphs: [
          "Ask what would need to improve for the bull case to matter and what would need to worsen for the bear case to matter.",
        ],
        bullets: ["What data supports each side?", "Which risks are most relevant?", "What changed in the latest filing?"],
      },
      {
        heading: "Common mistakes",
        paragraphs: [
          "Do not label one side as a recommendation. Do not ignore risks in the bull case or facts in the bear case.",
        ],
      },
      {
        heading: "How stokr can help",
        paragraphs: [
          "stokr presents bull and bear summaries beside filing context and risk factors so users can compare perspectives more clearly.",
        ],
      },
    ],
  },
  {
    slug: "earnings-report-checklist",
    title: "Earnings Report Checklist",
    description: "What to review when a company reports earnings.",
    category: "Earnings",
    readTime: "6 min read",
    relatedLinks: [
      link("/blog/how-to-read-an-earnings-report", "How to read an earnings report"),
      link("/blog/how-to-track-stocks-before-earnings", "How to track stocks before earnings"),
      link("/blog/what-is-a-10-q", "What is a 10-Q?"),
    ],
    sections: [
      {
        heading: "Revenue",
        paragraphs: ["Check whether revenue grew or declined and read management's explanation of demand, pricing, or volume changes."],
      },
      {
        heading: "EPS",
        paragraphs: ["Review earnings per share, but look for one-time items, share count changes, and the connection to cash flow."],
      },
      {
        heading: "Margins",
        paragraphs: ["Margins help show whether the company is keeping more or less profit from sales after costs."],
      },
      {
        heading: "Cash flow",
        paragraphs: ["Cash flow can confirm whether accounting earnings are supported by cash generation."],
      },
      {
        heading: "Guidance",
        paragraphs: ["Guidance is management's outlook, not a guarantee. Read it with risk factors and assumptions."],
      },
      {
        heading: "Management commentary",
        paragraphs: ["Look for what management says drove results and what they are watching next."],
      },
      {
        heading: "Risk updates",
        paragraphs: ["Read the 10-Q for updated risk factors after the earnings release."],
      },
      {
        heading: "What changed since the last report",
        paragraphs: ["Compare results, commentary, and risks with the prior quarter to see whether the business story changed."],
      },
    ],
  },
  {
    slug: "stock-comparison-template",
    title: "Stock Comparison Template",
    description: "A framework for comparing two stocks side by side.",
    category: "Stock Research",
    readTime: "6 min read",
    relatedLinks: [
      link("/blog/how-to-compare-two-stocks", "How to compare two stocks"),
      link("/blog/how-to-compare-companies-in-the-same-sector", "How to compare companies in the same sector"),
      link("/compare", "Compare stocks"),
      link("/stocks/nvda", "NVDA stock report"),
    ],
    sections: [
      {
        heading: "Business model",
        paragraphs: ["Compare how each company makes money, who it serves, and which parts of the business drive results."],
      },
      {
        heading: "Revenue growth",
        paragraphs: ["Compare growth rates and the reasons behind them. Growth quality matters more than the headline number alone."],
      },
      {
        heading: "Margins",
        paragraphs: ["Compare gross and operating margins to understand profitability and cost structure."],
      },
      {
        heading: "Cash flow",
        paragraphs: ["Compare operating cash flow and free cash flow to understand cash generation."],
      },
      {
        heading: "Debt",
        paragraphs: ["Compare debt levels, liquidity, and whether cash flow can support obligations."],
      },
      {
        heading: "Risk factors",
        paragraphs: ["Compare the most important risks for each company, especially risks tied to revenue and operations."],
      },
      {
        heading: "Bull case",
        paragraphs: ["Write the strongest positive argument for each business without turning it into advice."],
      },
      {
        heading: "Bear case",
        paragraphs: ["Write the strongest cautious argument for each business and identify what would need monitoring."],
      },
      {
        heading: "Final research notes",
        paragraphs: ["Summarize open questions and the data you want to review next. stokr's comparison page can help organize cached report context side by side."],
      },
    ],
  },
]
