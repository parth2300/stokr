export type GlossaryCategory =
  | "Financial Metrics"
  | "SEC Filings"
  | "Risk Analysis"
  | "Stock Research"
  | "Valuation"

export type GlossaryFormula = {
  label: string
  numerator: string
  denominator: string
  note?: string
}

export type GlossaryTerm = {
  term: string
  category: GlossaryCategory
  definition: string
  whyItMatters: string
  formula?: GlossaryFormula
  relatedLinks?: {
    href: string
    label: string
  }[]
}

function related(href: string, label: string) {
  return { href, label }
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    term: "Market Cap",
    category: "Financial Metrics",
    definition: "Market cap is the market value of a company's equity.",
    whyItMatters: "It helps frame company size, but it does not explain profitability, debt, or valuation quality by itself.",
    formula: {
      label: "Market Cap",
      numerator: "Share Price x Shares Outstanding",
      denominator: "1",
      note: "Usually shown as a total dollar value.",
    },
    relatedLinks: [related("/blog/what-is-market-cap", "What is market cap?")],
  },
  {
    term: "Revenue",
    category: "Financial Metrics",
    definition: "Revenue is the money a company earns from selling goods or services before expenses.",
    whyItMatters: "It shows business scale and demand, but it should be read with margins and cash flow.",
    relatedLinks: [related("/blog/what-is-revenue-growth", "What is revenue growth?")],
  },
  {
    term: "Revenue Growth",
    category: "Financial Metrics",
    definition: "Revenue growth measures how much sales increased or decreased over a period.",
    whyItMatters: "It can show demand changes, but growth quality depends on profitability, cash flow, and sustainability.",
    formula: {
      label: "Revenue Growth",
      numerator: "Current Period Revenue - Prior Period Revenue",
      denominator: "Prior Period Revenue",
      note: "Usually expressed as a percentage.",
    },
    relatedLinks: [related("/blog/what-is-revenue-growth", "What is revenue growth?")],
  },
  {
    term: "EPS",
    category: "Financial Metrics",
    definition: "EPS means earnings per share, or profit attributed to each share of common stock.",
    whyItMatters: "It is widely used in earnings analysis, but it can be affected by one-time items and share count changes.",
    formula: {
      label: "EPS",
      numerator: "Net Income - Preferred Dividends",
      denominator: "Weighted Average Shares",
    },
    relatedLinks: [related("/blog/what-is-eps", "What is EPS?")],
  },
  {
    term: "Free Cash Flow",
    category: "Financial Metrics",
    definition: "Free cash flow is cash left after operating cash flow and capital spending.",
    whyItMatters: "It helps show whether a company is turning business activity into usable cash.",
    formula: {
      label: "Free Cash Flow",
      numerator: "Operating Cash Flow - Capital Expenditures",
      denominator: "1",
    },
    relatedLinks: [related("/blog/what-is-free-cash-flow", "What is free cash flow?")],
  },
  {
    term: "Operating Margin",
    category: "Financial Metrics",
    definition: "Operating margin shows operating profit as a percentage of revenue.",
    whyItMatters: "It helps explain core business profitability before interest and taxes.",
    formula: {
      label: "Operating Margin",
      numerator: "Operating Income",
      denominator: "Revenue",
      note: "Usually expressed as a percentage.",
    },
    relatedLinks: [related("/blog/what-is-operating-margin", "What is operating margin?")],
  },
  {
    term: "Gross Margin",
    category: "Financial Metrics",
    definition: "Gross margin shows how much revenue remains after direct costs of goods or services.",
    whyItMatters: "It helps show pricing power, product cost structure, and production efficiency.",
    formula: {
      label: "Gross Margin",
      numerator: "Revenue - Cost of Revenue",
      denominator: "Revenue",
    },
    relatedLinks: [related("/resources/financial-metrics-cheat-sheet", "Financial metrics cheat sheet")],
  },
  {
    term: "Net Income",
    category: "Financial Metrics",
    definition: "Net income is accounting profit after expenses, interest, taxes, and other items.",
    whyItMatters: "It is the bottom-line profit figure, but it should be compared with cash flow.",
    relatedLinks: [related("/blog/what-is-an-income-statement", "What is an income statement?")],
  },
  {
    term: "EBITDA",
    category: "Financial Metrics",
    definition: "EBITDA means earnings before interest, taxes, depreciation, and amortization.",
    whyItMatters: "It can help compare operating performance, but it excludes real costs and should not replace cash flow.",
  },
  {
    term: "Debt-to-Equity",
    category: "Financial Metrics",
    definition: "Debt-to-equity compares a company's debt with shareholders' equity.",
    whyItMatters: "It helps frame leverage and balance sheet risk.",
    formula: {
      label: "Debt-to-Equity",
      numerator: "Total Debt",
      denominator: "Shareholders' Equity",
    },
    relatedLinks: [related("/blog/what-is-debt-to-equity", "What is debt-to-equity?")],
  },
  {
    term: "Return on Equity",
    category: "Financial Metrics",
    definition: "Return on equity compares net income with shareholders' equity.",
    whyItMatters: "It can show profitability relative to equity, but leverage can influence the result.",
    formula: {
      label: "Return on Equity",
      numerator: "Net Income",
      denominator: "Shareholders' Equity",
    },
    relatedLinks: [related("/blog/what-is-return-on-equity", "What is return on equity?")],
  },
  {
    term: "P/E Ratio",
    category: "Valuation",
    definition: "The P/E ratio compares a company's share price with earnings per share.",
    whyItMatters: "It is a common valuation metric, but it needs growth, margins, debt, and risk context.",
    formula: {
      label: "P/E Ratio",
      numerator: "Share Price",
      denominator: "Earnings Per Share",
    },
    relatedLinks: [related("/resources/financial-metrics-cheat-sheet", "Financial metrics cheat sheet")],
  },
  {
    term: "Price-to-Sales Ratio",
    category: "Valuation",
    definition: "Price-to-sales compares company market value with revenue.",
    whyItMatters: "It can be useful when earnings are low or negative, but it does not show profitability.",
    formula: {
      label: "Price-to-Sales",
      numerator: "Market Cap",
      denominator: "Revenue",
    },
  },
  {
    term: "Current Ratio",
    category: "Financial Metrics",
    definition: "The current ratio compares current assets with current liabilities.",
    whyItMatters: "It helps frame short-term liquidity, though industry context matters.",
    formula: {
      label: "Current Ratio",
      numerator: "Current Assets",
      denominator: "Current Liabilities",
    },
  },
  {
    term: "Cash Flow from Operations",
    category: "Financial Metrics",
    definition: "Cash flow from operations shows cash generated or used by the core business.",
    whyItMatters: "It helps test whether reported earnings are supported by cash generation.",
    relatedLinks: [related("/blog/what-is-a-cash-flow-statement", "What is a cash flow statement?")],
  },
  {
    term: "10-K",
    category: "SEC Filings",
    definition: "A 10-K is an annual report filed by a public company with the SEC.",
    whyItMatters: "It gives a broad annual view of the business, financial statements, risks, and management discussion.",
    relatedLinks: [related("/blog/what-is-a-10-k", "What is a 10-K?")],
  },
  {
    term: "10-Q",
    category: "SEC Filings",
    definition: "A 10-Q is a quarterly report filed by a public company with the SEC.",
    whyItMatters: "It updates investors on recent financial results and changes between annual reports.",
    relatedLinks: [related("/blog/what-is-a-10-q", "What is a 10-Q?")],
  },
  {
    term: "MD&A",
    category: "SEC Filings",
    definition: "MD&A means Management's Discussion and Analysis.",
    whyItMatters: "It explains management's view of results, trends, liquidity, and business changes.",
    relatedLinks: [related("/blog/what-is-mda", "What is MD&A?")],
  },
  {
    term: "Risk Factors",
    category: "SEC Filings",
    definition: "Risk factors are company-disclosed issues that could materially affect the business.",
    whyItMatters: "They help identify what could challenge the company, but they are not predictions.",
    relatedLinks: [related("/blog/how-to-use-risk-factors", "How to use risk factors")],
  },
  {
    term: "Annual Report",
    category: "SEC Filings",
    definition: "An annual report is a yearly company report, often connected with the 10-K filing.",
    whyItMatters: "It helps users review a full year of business performance and disclosures.",
  },
  {
    term: "Quarterly Report",
    category: "SEC Filings",
    definition: "A quarterly report updates company performance during the year.",
    whyItMatters: "It can show what changed since the annual report.",
  },
  {
    term: "Segment Reporting",
    category: "SEC Filings",
    definition: "Segment reporting breaks a company into operating units or business lines.",
    whyItMatters: "It can show which parts of the company drive revenue, profit, or risk.",
  },
  {
    term: "Legal Proceedings",
    category: "SEC Filings",
    definition: "Legal proceedings describe material legal or regulatory matters involving the company.",
    whyItMatters: "They can provide context about disputes, compliance issues, or potential costs.",
  },
  {
    term: "Forward-Looking Statements",
    category: "SEC Filings",
    definition: "Forward-looking statements describe expectations about future events or performance.",
    whyItMatters: "They are not guarantees and should be read with assumptions and risk factors.",
  },
  {
    term: "Business Risk",
    category: "Risk Analysis",
    definition: "Business risk is the possibility that company operations, demand, or strategy may not perform as expected.",
    whyItMatters: "It helps users understand what could affect the core business model.",
  },
  {
    term: "Financial Risk",
    category: "Risk Analysis",
    definition: "Financial risk relates to debt, cash flow, liquidity, financing, or balance sheet pressure.",
    whyItMatters: "It helps frame whether the company has financial flexibility.",
  },
  {
    term: "Competitive Risk",
    category: "Risk Analysis",
    definition: "Competitive risk is the chance that rivals, substitutes, or pricing pressure hurt the business.",
    whyItMatters: "It can affect growth, margins, and market position.",
  },
  {
    term: "Regulatory Risk",
    category: "Risk Analysis",
    definition: "Regulatory risk comes from rules, oversight, approvals, or compliance obligations.",
    whyItMatters: "It can affect costs, operations, products, and timing.",
  },
  {
    term: "Customer Concentration",
    category: "Risk Analysis",
    definition: "Customer concentration means a company depends heavily on a small number of customers.",
    whyItMatters: "Losing or reducing business with a key customer can affect revenue and operations.",
  },
  {
    term: "Margin Pressure",
    category: "Risk Analysis",
    definition: "Margin pressure means costs, pricing, or mix changes are reducing profitability.",
    whyItMatters: "It can show that revenue growth is becoming less profitable.",
  },
  {
    term: "Liquidity Risk",
    category: "Risk Analysis",
    definition: "Liquidity risk is the risk that a company may not have enough cash or financing flexibility.",
    whyItMatters: "It matters when debt, operations, or investment needs require cash.",
  },
  {
    term: "Execution Risk",
    category: "Risk Analysis",
    definition: "Execution risk is the risk that management cannot carry out a plan as expected.",
    whyItMatters: "It often appears during product launches, integrations, turnarounds, or expansion plans.",
  },
  {
    term: "Bull Case",
    category: "Stock Research",
    definition: "A bull case is the positive research argument for a company.",
    whyItMatters: "It helps identify what could support a favorable business view without making a recommendation.",
    relatedLinks: [related("/blog/bull-case-vs-bear-case", "Bull case vs bear case")],
  },
  {
    term: "Bear Case",
    category: "Stock Research",
    definition: "A bear case is the cautious or negative research argument for a company.",
    whyItMatters: "It helps identify what could challenge the business or expectations.",
    relatedLinks: [related("/blog/bull-case-vs-bear-case", "Bull case vs bear case")],
  },
  {
    term: "Watchlist",
    category: "Stock Research",
    definition: "A watchlist is a saved list of companies to research or monitor.",
    whyItMatters: "It helps organize research without implying any action.",
    relatedLinks: [related("/resources/stock-research-checklist", "Stock research checklist")],
  },
  {
    term: "Stock Thesis",
    category: "Stock Research",
    definition: "A stock thesis is a structured research view about what matters for a company.",
    whyItMatters: "It makes assumptions, risks, and open questions easier to review.",
  },
  {
    term: "Earnings Report",
    category: "Stock Research",
    definition: "An earnings report is a company update about recent financial results.",
    whyItMatters: "It can show changes in revenue, earnings, margins, guidance, and management commentary.",
    relatedLinks: [related("/resources/earnings-report-checklist", "Earnings report checklist")],
  },
  {
    term: "Guidance",
    category: "Stock Research",
    definition: "Guidance is management's outlook for future financial or business performance.",
    whyItMatters: "It frames expectations, but it is not a guarantee.",
  },
  {
    term: "Valuation",
    category: "Valuation",
    definition: "Valuation is the process of comparing a company's price with business fundamentals.",
    whyItMatters: "It helps put expectations in context, but no single valuation metric tells the full story.",
  },
  {
    term: "Moat",
    category: "Stock Research",
    definition: "A moat is a durable advantage that may help a company defend its business.",
    whyItMatters: "It can affect margins, customer retention, and competitive position.",
  },
  {
    term: "Catalyst",
    category: "Stock Research",
    definition: "A catalyst is an event or development that could change how the market views a company.",
    whyItMatters: "It helps users understand what events may affect attention or expectations.",
  },
  {
    term: "Drawdown",
    category: "Stock Research",
    definition: "A drawdown is a decline from a prior high to a lower value.",
    whyItMatters: "It helps describe downside movement, but it does not explain business quality by itself.",
  },
]
