export type BlogSection = {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export type BlogPost = {
  slug: string
  title: string
  description: string
  category: string
  date: string
  readTime: string
  relatedLinks: {
    href: string
    label: string
    description: string
  }[]
  sections: BlogSection[]
}

function related(href: string, label: string, description: string) {
  return { href, label, description }
}

const commonResearchSections: BlogSection[] = [
  {
    heading: "Common beginner mistakes",
    paragraphs: [
      "A common mistake is trying to turn one number, chart, headline, or social post into a complete opinion. Stock research works better when the business, financials, risks, and valuation context are read together.",
      "Another mistake is treating research as a search for certainty. Public company analysis is about organizing evidence, noticing tradeoffs, and understanding what would need to be true for different outcomes to matter.",
    ],
  },
  {
    heading: "How stokr can help",
    paragraphs: [
      "stokr organizes company overviews, SEC filing context, financial metrics, risk factors, and bull vs bear summaries in one place. The goal is to reduce noise and make the first pass of research easier to follow.",
      "The summaries are informational tools, not recommendations. They can help you decide what to read next, what questions to ask, and which company disclosures deserve closer attention.",
    ],
  },
]

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-research-a-stock-before-buying",
    title: "How to Research a Stock Before Buying",
    description: "A beginner-friendly checklist for researching a stock before making a decision.",
    category: "Beginner Guide",
    date: "2026-05-10",
    readTime: "7 min read",
    relatedLinks: [
      related("/blog/what-is-a-10-k", "What Is a 10-K?", "Use annual filings as a primary research source."),
      related("/blog/what-is-free-cash-flow", "What Is Free Cash Flow?", "Understand how cash generation fits into company analysis."),
      related("/blog/bull-case-vs-bear-case", "Bull Case vs Bear Case", "Compare positive and cautious research arguments."),
      related("/blog/how-to-use-risk-factors", "How to Use Risk Factors", "Learn how risk disclosures fit into a research checklist."),
      related("/stocks/aapl", "AAPL stock analysis", "Open a stock research page and see the workflow in practice."),
    ],
    sections: [
      {
        heading: "Start with the business",
        paragraphs: [
          "Before looking at ratios, charts, or commentary, make sure you can explain what the company does in plain English. What does it sell, who pays for it, and why do customers keep coming back? If that basic explanation is unclear, the rest of the research will feel harder than it needs to be.",
          "A useful first pass also asks how the company makes money. Some businesses sell products once. Others earn recurring revenue. Some depend on advertising, subscriptions, financing, or commodity prices. The revenue model affects how you interpret growth, margins, risk, and cash flow.",
        ],
        bullets: [
          "What does the company sell?",
          "Who are the main customers?",
          "What could make demand rise or fall?",
          "What parts of the business are easiest to understand?",
        ],
      },
      {
        heading: "Read the filings before the opinions",
        paragraphs: [
          "A 10-K or 10-Q is not exciting reading, but it is one of the cleanest places to start because it comes from the company and follows a disclosure format. The filing can show how management describes the business, which risks it highlights, and how the financial statements fit together.",
          "You do not need to read every footnote on the first pass. Beginners can start with the business section, risk factors, management discussion, revenue trends, cash flow, and debt. Those areas usually give enough structure to understand what questions matter next.",
        ],
      },
      {
        heading: "Check financial health in groups",
        paragraphs: [
          "Financial metrics are most useful when grouped by purpose. Revenue growth helps explain scale and demand. Margins help explain profitability. Free cash flow helps explain whether earnings are turning into cash. Debt helps explain financial flexibility and risk.",
          "Avoid treating a single metric as the whole story. Fast revenue growth can come with weak cash flow. Strong earnings can sit beside heavy debt. A low valuation multiple can reflect real business pressure. The goal is to build context, not chase a perfect number.",
        ],
      },
      {
        heading: "Compare the bull case and bear case",
        paragraphs: [
          "A bull case explains what could go right for the business. A bear case explains what could go wrong or what the market may already be pricing in. Reading both sides helps keep research balanced and reduces the chance of only collecting evidence that confirms an early opinion.",
          "Neither side is a recommendation. They are research frames. A thoughtful stock review should make it clear which assumptions support optimism and which facts create caution.",
        ],
      },
      ...commonResearchSections,
    ],
  },
  {
    slug: "how-to-read-a-stock-analysis",
    title: "How to Read a Stock Analysis Without Getting Overwhelmed",
    description: "Learn how to break down stock analysis into company overview, financials, risks, and bull vs bear cases.",
    category: "Beginner Guide",
    date: "2026-05-10",
    readTime: "5 min read",
    relatedLinks: [
      related("/blog/how-to-research-a-stock-before-buying", "How to Research a Stock Before Buying", "Use a fuller checklist for organizing stock research."),
      related("/blog/bull-case-vs-bear-case", "Bull Case vs Bear Case", "Understand how opposing research arguments work."),
      related("/blog/how-to-use-risk-factors", "How to Use Risk Factors", "Learn how company risk disclosures can guide research."),
      related("/stocks/msft", "MSFT stock analysis", "Review a stock analysis page inside stokr."),
    ],
    sections: [
      {
        heading: "Read the page in layers",
        paragraphs: [
          "A stock analysis can feel overwhelming because it often puts business description, financial metrics, charts, risks, filings, and opinion-like language near each other. Beginners should read it in layers instead of trying to understand everything at once.",
          "Start with the company overview, then move to financial health, then risk factors, then bull and bear cases. This order helps you understand what the company is, how it is performing, what could go wrong, and what arguments are being made on each side.",
        ],
      },
      {
        heading: "Separate facts from interpretation",
        paragraphs: [
          "Good stock analysis mixes reported facts with interpretation. Revenue, cash flow, debt, and filing dates are facts or data points. A statement that a business has improving quality, rising pressure, or a more balanced risk profile is interpretation.",
          "Interpretation can be useful, but it should be tied back to visible evidence. When reading any analysis, ask what data or filing language supports the point. If the connection is unclear, treat the claim as a prompt for more research.",
        ],
      },
      {
        heading: "Use financial sections as a map",
        paragraphs: [
          "Financial metrics tell you where to look next. Revenue growth points toward demand and business scale. Operating margin points toward efficiency. Free cash flow points toward cash generation. Debt metrics point toward balance sheet risk.",
          "The exact numbers matter less than the pattern and context. Beginners should ask whether the company is becoming easier or harder to understand financially, and which metrics deserve a second look in the filings.",
        ],
      },
      {
        heading: "Use risks to slow down",
        paragraphs: [
          "Risk sections are useful because they interrupt overly simple stories. A company can have exciting products and still face customer concentration, regulatory pressure, financing needs, supply chain exposure, or competition.",
          "Reading risks does not mean assuming the worst. It means understanding the parts of the business that could challenge the positive argument.",
        ],
      },
      ...commonResearchSections,
    ],
  },
  {
    slug: "what-is-a-10-k",
    title: "What Is a 10-K?",
    description: "A plain-English explanation of annual 10-K filings and why they matter for stock research.",
    category: "SEC Filings",
    date: "2026-05-10",
    readTime: "6 min read",
    relatedLinks: [
      related("/blog/what-is-a-10-q", "What Is a 10-Q?", "Compare annual filings with quarterly updates."),
      related("/blog/10-k-vs-10-q", "10-K vs 10-Q", "Understand how annual and quarterly filings differ."),
      related("/blog/what-are-risk-factors-in-a-10-k", "What Are Risk Factors in a 10-K?", "Learn how companies disclose business risks."),
      related("/blog/what-is-mda", "What Is MD&A?", "Read management commentary with more context."),
    ],
    sections: [
      {
        heading: "A 10-K is an annual company filing",
        paragraphs: [
          "A 10-K is an annual report that public companies file with the SEC. It gives a detailed view of the business, financial statements, risk factors, management commentary, legal matters, and accounting notes.",
          "For beginners, the most important point is that a 10-K is a primary source. It is not a headline, influencer summary, or analyst opinion. It is the company's required annual disclosure, written in a formal format and filed publicly.",
        ],
      },
      {
        heading: "What you can find inside",
        paragraphs: [
          "A 10-K usually includes a business overview, risk factors, selected financial information, management discussion and analysis, audited financial statements, controls, legal proceedings, and detailed notes. Some sections are easier to read than others.",
          "The business overview and risk factors are often the best starting points. They explain what the company does and what could materially affect it. The financial statements then show how the business performed during the year.",
        ],
        bullets: [
          "Business description and operating segments",
          "Risk factors and legal disclosures",
          "Income statement, balance sheet, and cash flow statement",
          "Management's discussion and analysis",
        ],
      },
      {
        heading: "Why it matters for research",
        paragraphs: [
          "A 10-K helps you understand how a company describes itself, what risks it believes are important, and how its financial position changed over a full year. It can also reveal business concentration, debt obligations, accounting assumptions, and segment details.",
          "Because the document is long, beginners should not expect to master it in one sitting. A practical approach is to read the same key sections for every company so comparisons become easier over time.",
        ],
      },
      {
        heading: "Common beginner mistakes",
        paragraphs: [
          "One mistake is skipping the filing because it looks too long. Another is reading only the first few pages and ignoring risk factors or management discussion. The length is intimidating, but the structure is predictable once you know what to look for.",
          "Beginners also sometimes treat a 10-K as a prediction. It is not. It is a disclosure document that provides context for research and helps users ask better questions.",
        ],
      },
      {
        heading: "How stokr can help",
        paragraphs: [
          "stokr uses filing-based analysis to summarize company context, risk factors, financial signals, and bull vs bear perspectives. This can make a long annual filing easier to scan before deciding which sections to inspect more closely.",
          "stokr provides informational research tools only and does not provide financial advice.",
        ],
      },
    ],
  },
  {
    slug: "what-is-a-10-q",
    title: "What Is a 10-Q?",
    description: "Learn what a quarterly 10-Q filing is and how investors use it to understand recent company performance.",
    category: "SEC Filings",
    date: "2026-05-10",
    readTime: "5 min read",
    relatedLinks: [
      related("/blog/what-is-a-10-k", "What Is a 10-K?", "Understand the annual filing first."),
      related("/blog/10-k-vs-10-q", "10-K vs 10-Q", "Compare annual and quarterly company filings."),
      related("/blog/how-to-read-an-earnings-report", "How to Read an Earnings Report", "Connect quarterly filings with earnings season."),
    ],
    sections: [
      {
        heading: "A 10-Q is a quarterly update",
        paragraphs: [
          "A 10-Q is a quarterly report that public companies file with the SEC. It updates investors on recent financial performance, business developments, risks, and management commentary between annual 10-K filings.",
          "If a 10-K is the full annual picture, a 10-Q is a progress update. It is usually shorter than a 10-K, but it can be very useful because it shows what changed recently.",
        ],
      },
      {
        heading: "What appears in a 10-Q",
        paragraphs: [
          "A 10-Q usually includes unaudited financial statements, management discussion and analysis, risk factor updates, legal proceedings, and controls disclosures. The financial statements cover the quarter and year-to-date period.",
          "Beginners should pay attention to revenue, expenses, margins, cash flow, debt changes, and management's explanation of what drove results. These sections can show whether the business is following the pattern described in the latest 10-K.",
        ],
      },
      {
        heading: "Why 10-Q filings are useful",
        paragraphs: [
          "Quarterly filings help investors avoid relying only on annual information. Businesses can change quickly, and a 10-Q can show recent demand shifts, cost pressure, financing changes, or risk updates.",
          "A 10-Q is especially useful after an earnings report because it provides more structure and detail than a press release. It can help separate headline results from the underlying financial statements.",
        ],
      },
      {
        heading: "Common beginner mistakes",
        paragraphs: [
          "One mistake is reading a quarter in isolation. A single quarter can be noisy because of seasonality, timing, one-time costs, or temporary demand changes. It is better to compare the quarter with prior periods and the company's longer-term story.",
          "Another mistake is ignoring risk updates. If a company changes or expands its risk language, that may be worth reading carefully.",
        ],
      },
      ...commonResearchSections.slice(1),
    ],
  },
  {
    slug: "10-k-vs-10-q",
    title: "10-K vs 10-Q: What's the Difference?",
    description: "Understand the difference between annual and quarterly company filings.",
    category: "SEC Filings",
    date: "2026-05-10",
    readTime: "5 min read",
    relatedLinks: [
      related("/blog/what-is-a-10-k", "What Is a 10-K?", "Learn what appears in an annual report."),
      related("/blog/what-is-a-10-q", "What Is a 10-Q?", "Learn how quarterly reports update the picture."),
      related("/blog/why-filing-based-research-matters", "Why Filing-Based Research Matters", "Understand why filings are useful primary sources."),
    ],
    sections: [
      {
        heading: "The simple difference",
        paragraphs: [
          "A 10-K is an annual filing. A 10-Q is a quarterly filing. Both are filed with the SEC, both contain financial statements and company disclosures, and both can help investors understand a public business.",
          "The 10-K is broader and more detailed. The 10-Q is more current and usually shorter. Beginners should use them together rather than treating one as a replacement for the other.",
        ],
      },
      {
        heading: "How the 10-K is different",
        paragraphs: [
          "The 10-K gives a full-year view of the business. It usually includes a deeper business description, audited financial statements, risk factors, management discussion, and detailed notes. It is often the best document for building a baseline understanding.",
          "If you are researching a company for the first time, the 10-K can help you learn the company's segments, revenue drivers, risk themes, and long-term financial pattern.",
        ],
      },
      {
        heading: "How the 10-Q is different",
        paragraphs: [
          "The 10-Q updates the story during the year. It usually includes unaudited financial statements, management commentary, and changes to risk factors or legal matters. It helps show what happened after the latest annual filing.",
          "A 10-Q can be especially useful when a company's recent quarter looks very different from its annual trend. It gives more detail than a headline and helps connect the quarter to the financial statements.",
        ],
      },
      {
        heading: "A practical reading order",
        paragraphs: [
          "For a new company, start with the latest 10-K to understand the business. Then read the latest 10-Q to see what changed. If the 10-Q mentions a major issue, go back to the 10-K to see whether that issue was already developing.",
          "This back-and-forth reading habit helps beginners avoid overreacting to one period while still staying current.",
        ],
      },
      ...commonResearchSections,
    ],
  },
  {
    slug: "what-are-risk-factors-in-a-10-k",
    title: "What Are Risk Factors in a 10-K?",
    description: "Learn what risk factors are, where they appear in company filings, and how to read them.",
    category: "Risk Analysis",
    date: "2026-05-10",
    readTime: "5 min read",
    relatedLinks: [
      related("/blog/how-to-use-risk-factors", "How to Use Risk Factors", "Turn risk disclosures into research questions."),
      related("/blog/how-to-find-red-flags-in-a-10-k", "How to Find Red Flags in a 10-K", "Look for areas that deserve closer attention."),
      related("/blog/what-is-a-10-k", "What Is a 10-K?", "See where risk factors fit in the annual report."),
    ],
    sections: [
      {
        heading: "Risk factors are company-disclosed risks",
        paragraphs: [
          "Risk factors are a section of a company filing where the company describes issues that could materially affect the business, financial condition, or results. They often cover competition, regulation, customer concentration, supply chains, debt, technology, legal matters, and market conditions.",
          "They are not predictions that something will happen. They are disclosures that help readers understand what could matter if conditions change.",
        ],
      },
      {
        heading: "Where they appear",
        paragraphs: [
          "Risk factors appear in annual 10-K filings and may be updated in quarterly 10-Q filings. The annual version is usually more complete, while quarterly updates may highlight new or changed risks.",
          "Beginners can read risk factors after the business overview. That order helps connect each risk to the actual company model instead of reading the section as a generic warning list.",
        ],
      },
      {
        heading: "How to read them",
        paragraphs: [
          "Look for risks that are specific to the business, repeated across filings, expanded from prior filings, or directly tied to revenue, cash flow, debt, operations, or regulation. Those risks often deserve more attention than broad boilerplate language.",
          "It also helps to ask whether management discusses the same issue elsewhere in the filing. A risk factor that connects to MD&A, debt notes, or segment performance may be more important to understand.",
        ],
      },
      {
        heading: "Common beginner mistakes",
        paragraphs: [
          "One mistake is assuming every listed risk is equally likely. Another is ignoring the section entirely because it sounds legalistic. The best middle ground is to read for themes and changes.",
          "Do not use risk factors as a checklist for fear. Use them as a map of what could challenge the business and what to monitor in future filings.",
        ],
      },
      ...commonResearchSections.slice(1),
    ],
  },
  {
    slug: "how-to-use-risk-factors",
    title: "How to Use Risk Factors When Researching a Stock",
    description: "A beginner-friendly guide to using company risk factors as part of stock research.",
    category: "Risk Analysis",
    date: "2026-05-10",
    readTime: "6 min read",
    relatedLinks: [
      related("/blog/what-are-risk-factors-in-a-10-k", "What Are Risk Factors in a 10-K?", "Understand the filing section first."),
      related("/blog/how-to-find-red-flags-in-a-10-k", "How to Find Red Flags in a 10-K", "Learn what may deserve closer review."),
      related("/blog/bull-case-vs-bear-case", "Bull Case vs Bear Case", "Use risks to balance the positive argument."),
    ],
    sections: [
      {
        heading: "Treat risks as research prompts",
        paragraphs: [
          "Risk factors are most useful when they become questions. If a company says it depends on a small number of customers, ask how much revenue comes from those customers. If it mentions supply constraints, ask whether margins or delivery timing show pressure.",
          "This approach keeps the section practical. Instead of reading risks as generic warnings, you turn them into a research checklist.",
        ],
      },
      {
        heading: "Look for changes over time",
        paragraphs: [
          "A new risk, expanded wording, or more specific language can be worth attention. Companies often repeat risk language from year to year, so changes can show what management thinks has become more relevant.",
          "Comparing risk factors between a 10-K and later 10-Q filings can help beginners spot whether the risk picture is stable or shifting.",
        ],
      },
      {
        heading: "Connect risks to financials",
        paragraphs: [
          "Risk factors become more meaningful when connected to numbers. A debt risk should lead you to the balance sheet and cash flow statement. A margin risk should lead you to the income statement. A demand risk should lead you to revenue trends.",
          "The goal is not to prove that a risk will happen. The goal is to understand how much it could matter if it does.",
        ],
      },
      {
        heading: "Use risks in bull and bear cases",
        paragraphs: [
          "A strong bull case should still acknowledge the main risks. A strong bear case should explain which risks are most relevant and why they could affect the business. This makes the analysis more balanced.",
          "Risk factors help prevent research from becoming one-sided. They slow the process down in a useful way.",
        ],
      },
      ...commonResearchSections,
    ],
  },
  {
    slug: "what-is-free-cash-flow",
    title: "What Is Free Cash Flow?",
    description: "Learn what free cash flow means and why investors often pay close attention to it.",
    category: "Financial Metrics",
    date: "2026-05-10",
    readTime: "5 min read",
    relatedLinks: [
      related("/blog/what-is-a-cash-flow-statement", "What Is a Cash Flow Statement?", "Learn where cash flow comes from."),
      related("/blog/what-is-operating-margin", "What Is Operating Margin?", "Compare cash generation with operating profitability."),
      related("/blog/what-is-debt-to-equity", "What Is Debt-to-Equity?", "Think about cash flow alongside balance sheet risk."),
    ],
    sections: [
      {
        heading: "Free cash flow in plain English",
        paragraphs: [
          "Free cash flow is the cash a company has left after paying for the capital spending needed to operate and maintain the business. It is often calculated as operating cash flow minus capital expenditures.",
          "The exact definition can vary by context, but the basic idea is simple: after the company brings in cash from operations and reinvests in the business, how much cash remains?",
        ],
      },
      {
        heading: "Why investors watch it",
        paragraphs: [
          "Free cash flow matters because accounting earnings do not always equal cash. A company may report profit while still needing a lot of cash for inventory, equipment, facilities, or customer financing.",
          "Strong free cash flow can give a company more flexibility. Weak or inconsistent free cash flow can raise questions about the quality of earnings, investment needs, or business model durability.",
        ],
      },
      {
        heading: "How to use it carefully",
        paragraphs: [
          "Free cash flow should be read over multiple periods. A single year can be affected by temporary investment, acquisitions, working capital timing, or unusual spending. Trends are usually more useful than one isolated number.",
          "It is also important to compare companies with similar business models. A software company and a manufacturer may have very different capital needs, so free cash flow expectations should not be identical.",
        ],
      },
      {
        heading: "Common beginner mistakes",
        paragraphs: [
          "One mistake is assuming free cash flow is always good or bad without context. Negative free cash flow may be concerning, but it may also reflect deliberate investment. Positive free cash flow may look strong, but it should still be compared with debt, growth, and reinvestment needs.",
          "Another mistake is ignoring the cash flow statement and relying only on earnings per share.",
        ],
      },
      ...commonResearchSections.slice(1),
    ],
  },
  {
    slug: "what-is-revenue-growth",
    title: "What Is Revenue Growth?",
    description: "Understand revenue growth, why it matters, and what beginners should avoid assuming from it.",
    category: "Financial Metrics",
    date: "2026-05-10",
    readTime: "4 min read",
    relatedLinks: [
      related("/blog/what-is-an-income-statement", "What Is an Income Statement?", "See where revenue appears."),
      related("/blog/what-is-operating-margin", "What Is Operating Margin?", "Learn how growth connects to profitability."),
      related("/blog/what-is-free-cash-flow", "What Is Free Cash Flow?", "Check whether growth turns into cash."),
    ],
    sections: [
      {
        heading: "Revenue growth shows sales expansion",
        paragraphs: [
          "Revenue growth measures how much a company's sales increased over a period. It can be shown quarter over quarter, year over year, or over several years. It is one of the first numbers many beginners notice.",
          "Revenue growth can signal demand, pricing power, customer expansion, or a larger market opportunity. But it does not automatically mean the business is healthy.",
        ],
      },
      {
        heading: "Why growth needs context",
        paragraphs: [
          "A company can grow revenue while losing money, burning cash, or taking on debt. Another company may grow slowly but generate stable cash and profits. The quality of growth matters.",
          "Beginners should ask what is driving growth. Is it more customers, higher prices, acquisitions, a temporary demand spike, or a new product cycle? The cause affects how sustainable the growth may be.",
        ],
      },
      {
        heading: "What to compare it with",
        paragraphs: [
          "Revenue growth should be read beside gross margin, operating margin, free cash flow, and management commentary. If revenue is rising but margins are falling, the company may be spending heavily to generate that growth.",
          "It also helps to compare growth with competitors in the same sector. A number that looks impressive in isolation may be less meaningful if the whole sector is growing quickly.",
        ],
      },
      ...commonResearchSections,
    ],
  },
  {
    slug: "what-is-eps",
    title: "What Is EPS?",
    description: "Learn what earnings per share means and how it is commonly used in stock research.",
    category: "Financial Metrics",
    date: "2026-05-10",
    readTime: "4 min read",
    relatedLinks: [
      related("/blog/what-is-an-income-statement", "What Is an Income Statement?", "Understand where earnings come from."),
      related("/blog/what-is-free-cash-flow", "What Is Free Cash Flow?", "Compare accounting earnings with cash generation."),
      related("/blog/how-to-read-an-earnings-report", "How to Read an Earnings Report", "See how EPS appears in earnings season."),
    ],
    sections: [
      {
        heading: "EPS in plain English",
        paragraphs: [
          "EPS stands for earnings per share. It shows how much profit is attributed to each share of common stock. The basic idea is net income divided by the number of shares.",
          "Companies often report basic EPS and diluted EPS. Diluted EPS accounts for additional shares that could exist from items like stock options or convertible securities.",
        ],
      },
      {
        heading: "Why EPS gets attention",
        paragraphs: [
          "EPS is widely used because it turns company profit into a per-share number. That makes it easier to compare results over time and connect earnings to valuation metrics.",
          "However, EPS is still an accounting measure. It can be affected by one-time items, tax changes, buybacks, restructuring costs, and other factors that need context.",
        ],
      },
      {
        heading: "How to use EPS carefully",
        paragraphs: [
          "Look at whether EPS growth comes from higher net income, fewer shares, or both. A company can increase EPS through share repurchases even if business growth is modest.",
          "Also compare EPS with cash flow. If EPS rises but cash flow is weak, beginners should read the cash flow statement and management discussion before drawing conclusions.",
        ],
      },
      ...commonResearchSections,
    ],
  },
  {
    slug: "what-is-market-cap",
    title: "What Is Market Cap?",
    description: "A simple explanation of market capitalization and what it tells investors about company size.",
    category: "Financial Metrics",
    date: "2026-05-10",
    readTime: "4 min read",
    relatedLinks: [
      related("/blog/how-to-compare-two-stocks", "How to Compare Two Stocks", "Use company size as one comparison point."),
      related("/blog/what-is-eps", "What Is EPS?", "Learn a common per-share metric."),
      related("/stocks/amzn", "AMZN stock analysis", "See market context on a stock page."),
    ],
    sections: [
      {
        heading: "Market cap measures company value in the market",
        paragraphs: [
          "Market cap, or market capitalization, is the stock market value of a company's equity. It is usually calculated as share price multiplied by shares outstanding.",
          "Market cap helps investors understand company size. A large-cap company is generally much larger and more established than a small-cap company, but size alone does not tell you whether a company is attractive or risky.",
        ],
      },
      {
        heading: "What market cap can tell you",
        paragraphs: [
          "Market cap can help frame expectations. Larger companies may have more resources, broader operations, and more analyst attention. Smaller companies may have more room to grow but may also carry more business or financing risk.",
          "It can also help compare companies in the same sector. Two companies with similar revenue but very different market caps may be priced very differently by the market.",
        ],
      },
      {
        heading: "What market cap cannot tell you",
        paragraphs: [
          "Market cap does not tell you how much debt a company has, whether it generates cash, whether it is profitable, or whether its valuation is reasonable. It is a starting point, not a full analysis.",
          "Beginners should combine market cap with revenue, margins, cash flow, debt, growth, and risk factors before forming a research view.",
        ],
      },
      ...commonResearchSections,
    ],
  },
  {
    slug: "what-is-operating-margin",
    title: "What Is Operating Margin?",
    description: "Learn what operating margin means and how it can help explain business profitability.",
    category: "Financial Metrics",
    date: "2026-05-10",
    readTime: "5 min read",
    relatedLinks: [
      related("/blog/what-is-an-income-statement", "What Is an Income Statement?", "Find operating income in context."),
      related("/blog/what-is-revenue-growth", "What Is Revenue Growth?", "Compare growth with profitability."),
      related("/blog/what-is-free-cash-flow", "What Is Free Cash Flow?", "Compare operating profitability with cash generation."),
    ],
    sections: [
      {
        heading: "Operating margin in plain English",
        paragraphs: [
          "Operating margin shows how much operating profit a company keeps from each dollar of revenue after operating costs. It is commonly calculated as operating income divided by revenue.",
          "The metric focuses on the business before items like interest and taxes. That makes it useful for understanding the profitability of the company's core operations.",
        ],
      },
      {
        heading: "Why it matters",
        paragraphs: [
          "Operating margin can show whether a company is becoming more efficient or facing cost pressure. Rising margins may reflect scale, pricing power, cost control, or a better product mix. Falling margins may reflect competition, higher input costs, or heavy investment.",
          "Margins differ widely by industry. A software company, retailer, bank, and manufacturer may have very different normal margin levels.",
        ],
      },
      {
        heading: "How to read margin trends",
        paragraphs: [
          "Look at margin over several periods rather than one quarter. A temporary cost, restructuring charge, or investment cycle can move margins in the short term.",
          "Also compare margin with revenue growth. Growth with improving margin can mean the business is scaling well. Growth with falling margin may still be fine, but it requires more explanation.",
        ],
      },
      ...commonResearchSections,
    ],
  },
  {
    slug: "what-is-debt-to-equity",
    title: "What Is Debt-to-Equity?",
    description: "Understand debt-to-equity and how it can help investors think about financial risk.",
    category: "Financial Metrics",
    date: "2026-05-10",
    readTime: "5 min read",
    relatedLinks: [
      related("/blog/what-is-a-balance-sheet", "What Is a Balance Sheet?", "Understand debt and equity in context."),
      related("/blog/what-is-free-cash-flow", "What Is Free Cash Flow?", "Think about debt alongside cash generation."),
      related("/blog/what-is-return-on-equity", "What Is Return on Equity?", "Compare leverage with profitability."),
    ],
    sections: [
      {
        heading: "Debt-to-equity in plain English",
        paragraphs: [
          "Debt-to-equity compares a company's debt with shareholders' equity. It is one way to think about how much the company relies on borrowed money versus owner capital.",
          "A higher ratio can suggest more financial leverage. A lower ratio can suggest less reliance on debt. But the right interpretation depends heavily on the industry and business model.",
        ],
      },
      {
        heading: "Why debt matters",
        paragraphs: [
          "Debt can help a company invest, acquire assets, or grow. It can also create fixed obligations that become harder to manage if revenue falls, interest costs rise, or cash flow weakens.",
          "Beginners should not assume all debt is bad. The question is whether the company can service its debt comfortably and whether debt levels fit the stability of the business.",
        ],
      },
      {
        heading: "How to use the ratio",
        paragraphs: [
          "Use debt-to-equity as a starting point, then read the balance sheet, cash flow statement, interest expense, maturity schedule, and management discussion. The ratio alone cannot show timing, interest rates, or liquidity.",
          "Compare companies in the same sector. Utilities, financial companies, and industrial businesses may naturally carry different levels of debt.",
        ],
      },
      ...commonResearchSections,
    ],
  },
  {
    slug: "what-is-return-on-equity",
    title: "What Is Return on Equity?",
    description: "Learn what ROE means and how it can be used carefully in company analysis.",
    category: "Financial Metrics",
    date: "2026-05-10",
    readTime: "5 min read",
    relatedLinks: [
      related("/blog/what-is-a-balance-sheet", "What Is a Balance Sheet?", "Understand shareholders' equity."),
      related("/blog/what-is-debt-to-equity", "What Is Debt-to-Equity?", "See how leverage can affect ROE."),
      related("/blog/what-is-an-income-statement", "What Is an Income Statement?", "Understand the earnings side of ROE."),
    ],
    sections: [
      {
        heading: "ROE in plain English",
        paragraphs: [
          "Return on equity, or ROE, compares net income with shareholders' equity. It is commonly used to ask how much profit a company generates relative to the equity capital in the business.",
          "A higher ROE can suggest strong profitability or efficient use of capital, but it is not automatically positive without context.",
        ],
      },
      {
        heading: "Why ROE can be useful",
        paragraphs: [
          "ROE can help compare companies that operate in similar industries. It can show whether a company produces strong earnings relative to its equity base.",
          "It can also help identify changes over time. Rising or falling ROE may lead beginners to ask what changed in profitability, debt, share repurchases, or retained earnings.",
        ],
      },
      {
        heading: "Why ROE can mislead",
        paragraphs: [
          "ROE can be boosted by leverage. If a company uses more debt and has less equity, ROE may rise even if risk also rises. Buybacks and accounting changes can also affect the denominator.",
          "That is why ROE should be read alongside debt-to-equity, cash flow, margins, and the balance sheet.",
        ],
      },
      ...commonResearchSections,
    ],
  },
  {
    slug: "what-is-a-balance-sheet",
    title: "What Is a Balance Sheet?",
    description: "A beginner-friendly explanation of assets, liabilities, and shareholders' equity.",
    category: "Financial Statements",
    date: "2026-05-10",
    readTime: "6 min read",
    relatedLinks: [
      related("/blog/what-is-an-income-statement", "What Is an Income Statement?", "Learn how profitability is reported."),
      related("/blog/what-is-a-cash-flow-statement", "What Is a Cash Flow Statement?", "Understand cash movement."),
      related("/blog/what-is-debt-to-equity", "What Is Debt-to-Equity?", "Use balance sheet data to think about risk."),
    ],
    sections: [
      {
        heading: "The balance sheet shows financial position",
        paragraphs: [
          "A balance sheet is a financial statement that shows what a company owns, what it owes, and what remains for shareholders at a point in time. The basic structure is assets equal liabilities plus shareholders' equity.",
          "It is called a balance sheet because the two sides balance. Assets are funded by liabilities, equity, or both.",
        ],
      },
      {
        heading: "Assets, liabilities, and equity",
        paragraphs: [
          "Assets include items such as cash, inventory, receivables, property, equipment, investments, and intangible assets. Liabilities include debt, accounts payable, lease obligations, and other amounts owed.",
          "Shareholders' equity is the residual interest after liabilities are subtracted from assets. It can include retained earnings, paid-in capital, and other accounting adjustments.",
        ],
      },
      {
        heading: "What beginners should look for",
        paragraphs: [
          "Start with cash, debt, current assets, current liabilities, and changes from prior periods. These items can help you understand liquidity, leverage, and whether the company has financial flexibility.",
          "The balance sheet becomes more useful when paired with cash flow. A company with high debt but steady cash flow may look different from a company with high debt and weak cash generation.",
        ],
      },
      ...commonResearchSections,
    ],
  },
  {
    slug: "what-is-an-income-statement",
    title: "What Is an Income Statement?",
    description: "Learn how an income statement shows revenue, expenses, and profitability.",
    category: "Financial Statements",
    date: "2026-05-10",
    readTime: "6 min read",
    relatedLinks: [
      related("/blog/what-is-revenue-growth", "What Is Revenue Growth?", "Start with the top line."),
      related("/blog/what-is-operating-margin", "What Is Operating Margin?", "Understand operating profitability."),
      related("/blog/what-is-eps", "What Is EPS?", "Connect net income to per-share results."),
    ],
    sections: [
      {
        heading: "The income statement shows performance",
        paragraphs: [
          "An income statement shows a company's revenue, expenses, and profit over a period of time. It usually starts with revenue and works down through costs, operating income, interest, taxes, net income, and earnings per share.",
          "Beginners can think of it as the statement that explains whether the company sold more, spent more, and kept more profit during the period.",
        ],
      },
      {
        heading: "From revenue to net income",
        paragraphs: [
          "Revenue is the top line. Cost of revenue and operating expenses reduce that amount. Operating income shows profit from core operations. Net income shows profit after additional items such as interest and taxes.",
          "Each layer answers a different question. Revenue asks how much business was done. Margins ask how profitable that business was. Net income asks what remained after all accounting expenses.",
        ],
      },
      {
        heading: "How to read it carefully",
        paragraphs: [
          "Look at trends rather than one period. Revenue growth, gross margin, operating margin, and net income can move in different directions. Those differences are often where the useful questions appear.",
          "Also read management discussion to understand why numbers changed. The statement shows what happened; MD&A often explains management's view of why it happened.",
        ],
      },
      ...commonResearchSections,
    ],
  },
  {
    slug: "what-is-a-cash-flow-statement",
    title: "What Is a Cash Flow Statement?",
    description: "Understand operating, investing, and financing cash flows in plain English.",
    category: "Financial Statements",
    date: "2026-05-10",
    readTime: "6 min read",
    relatedLinks: [
      related("/blog/what-is-free-cash-flow", "What Is Free Cash Flow?", "Learn a common cash flow metric."),
      related("/blog/what-is-an-income-statement", "What Is an Income Statement?", "Compare cash flow with earnings."),
      related("/blog/what-is-a-balance-sheet", "What Is a Balance Sheet?", "Connect cash movement to financial position."),
    ],
    sections: [
      {
        heading: "The cash flow statement tracks cash movement",
        paragraphs: [
          "A cash flow statement shows how cash moved through a company during a period. It is divided into operating, investing, and financing activities.",
          "This statement matters because profit and cash are not always the same. A company can report earnings while cash moves differently because of working capital, capital spending, debt, or other timing issues.",
        ],
      },
      {
        heading: "Operating, investing, and financing cash flow",
        paragraphs: [
          "Operating cash flow shows cash generated or used by the core business. Investing cash flow often includes capital expenditures, acquisitions, or asset sales. Financing cash flow includes debt, share issuance, buybacks, and dividends.",
          "Beginners should start with operating cash flow because it shows whether the business itself is producing cash before major investment and financing decisions.",
        ],
      },
      {
        heading: "Why it matters",
        paragraphs: [
          "Cash flow helps test the quality of earnings. If earnings look strong but operating cash flow is weak for several periods, that may deserve closer research.",
          "The cash flow statement also helps explain how the company funds growth, pays down debt, returns capital, or invests in long-term assets.",
        ],
      },
      ...commonResearchSections,
    ],
  },
  {
    slug: "what-is-mda",
    title: "What Is MD&A?",
    description: "Learn what Management's Discussion and Analysis means in company filings.",
    category: "SEC Filings",
    date: "2026-05-10",
    readTime: "5 min read",
    relatedLinks: [
      related("/blog/what-is-a-10-k", "What Is a 10-K?", "See where MD&A appears in annual filings."),
      related("/blog/what-is-a-10-q", "What Is a 10-Q?", "Read quarterly management commentary."),
      related("/blog/how-to-read-an-earnings-report", "How to Read an Earnings Report", "Compare MD&A with earnings commentary."),
    ],
    sections: [
      {
        heading: "MD&A means Management's Discussion and Analysis",
        paragraphs: [
          "MD&A is a section of company filings where management explains financial results, business trends, liquidity, capital resources, and important changes. It is written by the company and gives context around the numbers.",
          "For beginners, MD&A can be one of the most useful sections because it connects the financial statements to management's explanation of what happened.",
        ],
      },
      {
        heading: "What to look for",
        paragraphs: [
          "Look for explanations of revenue changes, margin movement, cost pressure, cash flow, debt, capital spending, and known trends. Management may also discuss seasonality, customer demand, pricing, or operational issues.",
          "The goal is not to accept every sentence without question. The goal is to understand how management frames the business and then compare that framing with the numbers.",
        ],
      },
      {
        heading: "How MD&A fits with other sections",
        paragraphs: [
          "MD&A works best when read beside the income statement, balance sheet, cash flow statement, and risk factors. If management says costs rose because of investment, the income statement and cash flow statement can help show the impact.",
          "If MD&A mentions a risk or uncertainty, check whether the risk factors section discusses the same issue in more detail.",
        ],
      },
      ...commonResearchSections,
    ],
  },
  {
    slug: "bull-case-vs-bear-case",
    title: "Bull Case vs Bear Case",
    description: "Learn the difference between a positive and negative investment argument when researching a company.",
    category: "Stock Research",
    date: "2026-05-10",
    readTime: "4 min read",
    relatedLinks: [
      related("/blog/how-to-read-a-stock-analysis", "How to Read a Stock Analysis", "See where bull and bear cases fit."),
      related("/blog/how-to-use-risk-factors", "How to Use Risk Factors", "Use disclosed risks to build a cautious case."),
      related("/blog/how-to-compare-two-stocks", "How to Compare Two Stocks", "Apply both sides when comparing companies."),
    ],
    sections: [
      {
        heading: "What a bull case means",
        paragraphs: [
          "A bull case is the positive argument for a company. It may focus on revenue growth, improving margins, product strength, customer demand, competitive position, cash generation, or management execution.",
          "A bull case is not a prediction and not a recommendation. It is a structured explanation of what could support a more favorable view of the business.",
        ],
      },
      {
        heading: "What a bear case means",
        paragraphs: [
          "A bear case is the cautious or negative argument. It may focus on slowing growth, high debt, weakening margins, competitive pressure, valuation risk, regulation, customer concentration, or operational challenges.",
          "A bear case is not automatically a reason to avoid a stock. It helps define what could challenge the business or make expectations harder to meet.",
        ],
      },
      {
        heading: "Why both sides matter",
        paragraphs: [
          "Beginners often feel pulled toward one side early. Reading both cases helps reduce confirmation bias and makes the research process more balanced.",
          "A useful analysis should make the main assumptions visible. The bull case shows what has to go right. The bear case shows what could go wrong or what may already be priced in.",
        ],
      },
      ...commonResearchSections,
    ],
  },
  {
    slug: "how-to-compare-two-stocks",
    title: "How to Compare Two Stocks",
    description: "A practical framework for comparing two companies side by side.",
    category: "Stock Research",
    date: "2026-05-10",
    readTime: "7 min read",
    relatedLinks: [
      related("/blog/how-to-compare-companies-in-the-same-sector", "How to Compare Companies in the Same Sector", "Go deeper on sector-based comparisons."),
      related("/blog/what-is-market-cap", "What Is Market Cap?", "Use size as one comparison point."),
      related("/blog/bull-case-vs-bear-case", "Bull Case vs Bear Case", "Compare both sides for each company."),
      related("/stocks/nvda", "NVDA stock analysis", "Open one company page for comparison practice."),
    ],
    sections: [
      {
        heading: "Compare businesses before tickers",
        paragraphs: [
          "Two stocks are easier to compare when you start with the businesses. What does each company sell? Who are the customers? What drives demand? Which business is simpler to understand?",
          "A ticker is just a label. The real comparison is between business models, financial profiles, risk exposure, and expectations.",
        ],
      },
      {
        heading: "Use the same categories for both",
        paragraphs: [
          "Create a side-by-side framework and use the same categories for each company. This prevents the comparison from becoming a list of random facts.",
          "Useful categories include revenue growth, margins, free cash flow, debt, market cap, valuation context, risk factors, and management commentary.",
        ],
        bullets: [
          "Business model and customer base",
          "Growth and profitability",
          "Cash flow and balance sheet strength",
          "Risks and what could change",
        ],
      },
      {
        heading: "Compare risks directly",
        paragraphs: [
          "Risks are often where similar companies differ. One company may have more customer concentration. Another may have more debt. Another may face more regulatory exposure or product-cycle risk.",
          "Do not only compare upside stories. A side-by-side risk comparison can show which business is more exposed to the assumptions you are making.",
        ],
      },
      {
        heading: "Avoid declaring a winner too quickly",
        paragraphs: [
          "The goal of comparison is not always to pick a winner. Sometimes the result is that one company is easier to understand, one has stronger financials, or one has risks that need more research.",
          "That is still a useful outcome. Good research often narrows the next question rather than producing a final answer immediately.",
        ],
      },
      ...commonResearchSections,
    ],
  },
  {
    slug: "how-to-build-a-stock-watchlist",
    title: "How to Build a Stock Watchlist",
    description: "Learn how to create a focused watchlist and use it to organize stock research.",
    category: "Stock Research",
    date: "2026-05-10",
    readTime: "5 min read",
    relatedLinks: [
      related("/blog/how-to-organize-stock-research-as-a-beginner", "How to Organize Stock Research as a Beginner", "Build a repeatable research workflow."),
      related("/blog/how-to-track-stocks-before-earnings", "How to Track Stocks Before Earnings", "Use a watchlist around earnings season."),
      related("/watchlist", "stokr watchlist", "Organize tickers inside stokr."),
    ],
    sections: [
      {
        heading: "A watchlist is a research tool",
        paragraphs: [
          "A watchlist is not a list of stocks to buy. It is a way to organize companies you want to understand better. That difference matters because it keeps the watchlist focused on research rather than impulse.",
          "Beginners can use a watchlist to track companies by sector, theme, product familiarity, earnings dates, risk questions, or financial quality.",
        ],
      },
      {
        heading: "Keep the list focused",
        paragraphs: [
          "A watchlist becomes less useful when it contains every ticker you have ever heard about. Start with a small group of companies you can realistically review.",
          "You can always add more later. A focused list makes it easier to compare filings, earnings reports, margins, cash flow, and risk factors over time.",
        ],
      },
      {
        heading: "Write down why each stock is on the list",
        paragraphs: [
          "For each company, write a short reason it belongs on the watchlist. Maybe you want to understand its business model, compare it with a competitor, monitor a risk, or follow a turnaround story.",
          "This note helps prevent the watchlist from becoming a collection of attention-driven names.",
        ],
      },
      {
        heading: "Review the list on a schedule",
        paragraphs: [
          "A watchlist is most useful when reviewed consistently. You might check filings after quarterly reports, review risk changes after a 10-Q, or compare financial metrics once new data is available.",
          "The goal is to build familiarity over time, not react to every price move.",
        ],
      },
      ...commonResearchSections,
    ],
  },
  {
    slug: "why-stock-research-feels-overwhelming",
    title: "Why Stock Research Feels Overwhelming",
    description: "Understand why stock research can feel noisy and how to organize the process.",
    category: "Beginner Guide",
    date: "2026-05-10",
    readTime: "5 min read",
    relatedLinks: [
      related("/blog/stock-research-without-the-noise", "Stock Research Without the Noise", "Learn why stokr emphasizes calmer research."),
      related("/blog/how-to-organize-stock-research-as-a-beginner", "How to Organize Stock Research as a Beginner", "Create a simple repeatable process."),
      related("/blog/how-to-read-a-stock-analysis", "How to Read a Stock Analysis", "Break analysis into manageable sections."),
    ],
    sections: [
      {
        heading: "There is too much information",
        paragraphs: [
          "Stock research feels overwhelming because every company can produce filings, earnings calls, charts, news, analyst commentary, social posts, and valuation debates. Beginners often see all of it at once and do not know what to read first.",
          "The solution is not to consume more information. It is to create an order of operations so each piece has a role.",
        ],
      },
      {
        heading: "Opinions can crowd out facts",
        paragraphs: [
          "Market content often moves faster than company fundamentals. Headlines and opinions can be useful, but they can also make research feel urgent even when the underlying business changes slowly.",
          "A filing-first workflow helps bring the focus back to what the company reports: revenue, margins, cash flow, risks, debt, and management commentary.",
        ],
      },
      {
        heading: "A simple structure helps",
        paragraphs: [
          "Start with the business model, then financials, then risks, then bull and bear cases. This structure works across many companies and helps beginners avoid jumping between disconnected facts.",
          "Once the structure becomes familiar, stock research starts to feel less like a flood and more like a checklist.",
        ],
      },
      ...commonResearchSections,
    ],
  },
  {
    slug: "stock-research-without-the-noise",
    title: "Stock Research Without the Noise",
    description: "Why stokr focuses on filings, financials, risks, and plain-English summaries.",
    category: "stokr",
    date: "2026-05-10",
    readTime: "4 min read",
    relatedLinks: [
      related("/blog/how-to-research-a-stock-before-buying", "How to Research a Stock Before Buying", "Use a calm research checklist."),
      related("/blog/why-stock-research-feels-overwhelming", "Why Stock Research Feels Overwhelming", "Understand why organization matters."),
      related("/blog/how-ai-can-help-with-stock-research", "How AI Can Help With Stock Research", "See how AI can support the process."),
      related("/stocks/tsla", "TSLA stock analysis", "Open a stock page and review the stokr format."),
    ],
    sections: [
      {
        heading: "Noise makes research harder",
        paragraphs: [
          "Many investing platforms mix price moves, breaking news, social posts, chart alerts, and strong opinions into one stream. That can make research feel busy without making it clearer.",
          "For beginners, the challenge is not only finding information. It is separating durable business context from short-term attention.",
        ],
      },
      {
        heading: "What stokr focuses on",
        paragraphs: [
          "stokr focuses on company filings, financial metrics, risk factors, charts, and plain-English summaries. The product is designed around research structure rather than hype.",
          "That means the page emphasizes what the company reports, how the financial picture looks, what risks are disclosed, and what the bull and bear arguments say.",
        ],
      },
      {
        heading: "Why filings matter",
        paragraphs: [
          "Filings are not perfect, and they can be dense, but they are primary sources. They show how a company describes its business, risks, financial statements, and management outlook.",
          "Using filings as the foundation can help reduce the influence of noisy commentary that may not be tied to company fundamentals.",
        ],
      },
      {
        heading: "How stokr can help",
        paragraphs: [
          "stokr summarizes and organizes filing-based research so users can move faster through the first pass. It does not remove the need for judgment, and it does not provide financial advice.",
          "stokr provides informational research tools only and does not provide financial advice.",
        ],
      },
    ],
  },
  {
    slug: "how-ai-can-help-with-stock-research",
    title: "How AI Can Help With Stock Research",
    description: "Learn how AI can help organize stock research without replacing personal judgment.",
    category: "AI Stock Research",
    date: "2026-05-10",
    readTime: "5 min read",
    relatedLinks: [
      related("/blog/stock-research-without-the-noise", "Stock Research Without the Noise", "See how stokr frames research."),
      related("/blog/how-to-read-a-stock-analysis", "How to Read a Stock Analysis", "Use AI summaries as part of a broader workflow."),
      related("/blog/why-filing-based-research-matters", "Why Filing-Based Research Matters", "Understand why source material matters."),
    ],
    sections: [
      {
        heading: "AI can organize dense information",
        paragraphs: [
          "Company filings and financial statements can be long and difficult to scan. AI can help summarize themes, group risks, identify sections, and turn dense language into a more readable first pass.",
          "That can save time, especially for beginners who are still learning where to look and what questions to ask.",
        ],
      },
      {
        heading: "AI should not replace judgment",
        paragraphs: [
          "AI-generated research should not be treated as a final answer. It can miss context, oversimplify details, or summarize based on incomplete inputs. Users still need to read important source material and think critically.",
          "A good role for AI is organization: highlight the business model, summarize risk factors, compare bull and bear arguments, and point users toward areas that deserve deeper review.",
        ],
      },
      {
        heading: "Use AI summaries as a starting point",
        paragraphs: [
          "When reading an AI stock analysis, ask what the summary is based on. Does it connect to SEC filings, financial metrics, charts, and risk disclosures? If so, it can be a useful map for further research.",
          "The best workflow is to use AI to move faster through the first pass, then verify important points against filings and financial statements.",
        ],
      },
      ...commonResearchSections,
    ],
  },
  {
    slug: "why-filing-based-research-matters",
    title: "Why Filing-Based Research Matters",
    description: "Learn why company filings are an important source for understanding public businesses.",
    category: "SEC Filings",
    date: "2026-05-10",
    readTime: "5 min read",
    relatedLinks: [
      related("/blog/what-is-a-10-k", "What Is a 10-K?", "Start with annual company filings."),
      related("/blog/what-is-a-10-q", "What Is a 10-Q?", "Use quarterly filings for updates."),
      related("/blog/what-is-mda", "What Is MD&A?", "Read management's explanation of results."),
    ],
    sections: [
      {
        heading: "Filings come from the company",
        paragraphs: [
          "Public company filings are important because they are primary sources. They come from the company, follow required formats, and include business descriptions, financial statements, risks, and management discussion.",
          "They are not the only source worth reading, but they provide a foundation that is less dependent on market noise or short-term opinion.",
        ],
      },
      {
        heading: "Filings create structure",
        paragraphs: [
          "A filing gives beginners a repeatable way to research different companies. You can read the business overview, risk factors, financial statements, and MD&A for each company in the same order.",
          "That structure makes comparisons easier. Instead of jumping between headlines, you can compare what each company reports about its own business.",
        ],
      },
      {
        heading: "Filings show changes over time",
        paragraphs: [
          "Reading filings across periods helps show what changed. New risks, changing margin explanations, different debt language, or updated segment commentary can all point to areas worth understanding.",
          "This does not mean every wording change is important. It means filings can help users track the business over time in a more organized way.",
        ],
      },
      ...commonResearchSections,
    ],
  },
  {
    slug: "how-to-find-red-flags-in-a-10-k",
    title: "How to Find Red Flags in a 10-K",
    description: "A beginner-friendly guide to spotting areas that may deserve closer attention in an annual report.",
    category: "Risk Analysis",
    date: "2026-05-10",
    readTime: "7 min read",
    relatedLinks: [
      related("/blog/what-are-risk-factors-in-a-10-k", "What Are Risk Factors in a 10-K?", "Understand the risk section first."),
      related("/blog/how-to-use-risk-factors", "How to Use Risk Factors", "Turn risk language into questions."),
      related("/blog/what-is-a-balance-sheet", "What Is a Balance Sheet?", "Review debt and liquidity signals."),
    ],
    sections: [
      {
        heading: "Red flags are research prompts, not verdicts",
        paragraphs: [
          "A red flag is an area that deserves closer attention. It is not automatically proof that a company is bad or that a stock should be avoided. It simply means the filing contains something beginners should understand before moving on.",
          "This mindset is important because filings can contain many warnings. The goal is to identify which issues connect directly to the business, financials, or risk profile.",
        ],
      },
      {
        heading: "Look for risk language that becomes more specific",
        paragraphs: [
          "Broad risk language is common. More specific or newly expanded risk language may deserve closer review. If a company gives more detail about customer concentration, supply constraints, debt obligations, or regulation, ask why that detail matters now.",
          "Compare the latest 10-K with prior filings when possible. Changes in wording can help show what management believes has become more relevant.",
        ],
      },
      {
        heading: "Check debt and liquidity",
        paragraphs: [
          "Debt is not automatically a red flag, but debt can become important when cash flow is weak, interest costs are rising, or maturities are near. The balance sheet, cash flow statement, and debt notes can help explain the picture.",
          "Beginners should look for whether the company has enough cash and operating cash flow to support obligations and ongoing investment.",
        ],
      },
      {
        heading: "Watch for mismatch between story and numbers",
        paragraphs: [
          "If management commentary sounds very positive but revenue, margins, cash flow, or debt trends are worsening, that mismatch deserves closer reading. The answer may be temporary investment, a known transition, or real pressure.",
          "The filing may explain the mismatch in MD&A, risk factors, or the notes to financial statements.",
        ],
      },
      ...commonResearchSections,
    ],
  },
  {
    slug: "how-to-read-an-earnings-report",
    title: "How to Read an Earnings Report",
    description: "Learn how to read revenue, earnings, margins, guidance, and management commentary.",
    category: "Earnings",
    date: "2026-05-10",
    readTime: "6 min read",
    relatedLinks: [
      related("/blog/how-to-track-stocks-before-earnings", "How to Track Stocks Before Earnings", "Prepare before a company reports."),
      related("/blog/what-is-eps", "What Is EPS?", "Understand a common earnings metric."),
      related("/blog/what-is-a-10-q", "What Is a 10-Q?", "Use quarterly filings after earnings."),
    ],
    sections: [
      {
        heading: "Start with the main results",
        paragraphs: [
          "An earnings report usually highlights revenue, earnings, margins, cash flow, and management commentary. Beginners should start by understanding what changed from the prior period and what management says drove the results.",
          "Do not stop at the headline numbers. Earnings reports often include adjusted metrics, one-time items, and commentary that needs to be compared with filings.",
        ],
      },
      {
        heading: "Read revenue and margins together",
        paragraphs: [
          "Revenue shows sales activity. Margins show how much profit the company keeps after costs. A company can grow revenue while margins fall, or grow more slowly while profitability improves.",
          "That is why revenue and margins should be read together. The combination tells more than either number alone.",
        ],
      },
      {
        heading: "Understand guidance carefully",
        paragraphs: [
          "Guidance is management's outlook, not a guarantee. It can help show expectations for revenue, margins, demand, costs, or investment, but it can also change as conditions change.",
          "Beginners should compare guidance with risk factors and management commentary. If the outlook depends on assumptions, try to identify what those assumptions are.",
        ],
      },
      {
        heading: "Use the 10-Q after the report",
        paragraphs: [
          "The earnings release is useful, but the 10-Q usually gives more detail. After a company reports earnings, read the 10-Q to review financial statements, MD&A, risk updates, and notes.",
          "This helps reduce the chance of relying only on a press release or headline summary.",
        ],
      },
      ...commonResearchSections,
    ],
  },
  {
    slug: "how-to-track-stocks-before-earnings",
    title: "How to Track Stocks Before Earnings",
    description: "Learn what to review before a company reports earnings.",
    category: "Earnings",
    date: "2026-05-10",
    readTime: "5 min read",
    relatedLinks: [
      related("/blog/how-to-read-an-earnings-report", "How to Read an Earnings Report", "Know what to review after the report."),
      related("/blog/how-to-build-a-stock-watchlist", "How to Build a Stock Watchlist", "Organize companies before earnings season."),
      related("/blog/what-is-revenue-growth", "What Is Revenue Growth?", "Review one of the main earnings drivers."),
    ],
    sections: [
      {
        heading: "Start with the prior quarter",
        paragraphs: [
          "Before earnings, read the prior earnings report and latest 10-Q. Look at what management said mattered: demand, margins, costs, inventory, guidance, cash flow, or customer trends.",
          "This gives you a baseline. Without a baseline, it is easy to overreact to whichever number gets the most attention when the new report arrives.",
        ],
      },
      {
        heading: "Write down the key questions",
        paragraphs: [
          "A simple pre-earnings checklist can include revenue growth, operating margin, cash flow, debt, guidance, and risk updates. The exact questions depend on the company and sector.",
          "For example, a fast-growing company may raise questions about margins and cash flow. A mature company may raise questions about demand stability and capital allocation.",
        ],
      },
      {
        heading: "Separate business questions from price reaction",
        paragraphs: [
          "Stocks can move sharply around earnings for many reasons. Beginners should separate the market reaction from the business update. A price move alone does not explain whether the company became easier or harder to understand.",
          "Focus first on what the company reported, what changed, and how management explained it.",
        ],
      },
      ...commonResearchSections,
    ],
  },
  {
    slug: "how-to-compare-companies-in-the-same-sector",
    title: "How to Compare Companies in the Same Sector",
    description: "A practical guide to comparing businesses that operate in similar markets.",
    category: "Stock Research",
    date: "2026-05-10",
    readTime: "6 min read",
    relatedLinks: [
      related("/blog/how-to-compare-two-stocks", "How to Compare Two Stocks", "Use a general side-by-side framework."),
      related("/blog/what-is-operating-margin", "What Is Operating Margin?", "Compare profitability within a sector."),
      related("/blog/what-is-market-cap", "What Is Market Cap?", "Use company size as context."),
    ],
    sections: [
      {
        heading: "Sector comparisons need similar yardsticks",
        paragraphs: [
          "Companies in the same sector may face similar customers, costs, regulations, or economic cycles. That makes comparisons more useful, but only if you use consistent categories.",
          "Start with business model, revenue drivers, margins, cash flow, debt, market position, and risk factors. Then compare how each company performs within those categories.",
        ],
      },
      {
        heading: "Do not assume similar means identical",
        paragraphs: [
          "Two companies can operate in the same sector and still have very different business models. One may sell premium products, another may compete on cost, and another may rely on services or financing.",
          "Those differences affect revenue stability, margins, capital needs, and risk exposure.",
        ],
      },
      {
        heading: "Compare margins and cash flow",
        paragraphs: [
          "Margins can show which company has stronger pricing power, cost control, or scale. Cash flow can show which company converts business activity into usable cash more consistently.",
          "These comparisons are most useful over several periods. A single quarter can be affected by timing or temporary conditions.",
        ],
      },
      {
        heading: "Compare risk factors",
        paragraphs: [
          "Risk factors can reveal differences that financial metrics do not show immediately. One company may have more supplier risk, another may have more debt, and another may depend on a narrower customer base.",
          "A sector comparison should include both performance and vulnerability.",
        ],
      },
      ...commonResearchSections,
    ],
  },
  {
    slug: "how-to-organize-stock-research-as-a-beginner",
    title: "How to Organize Stock Research as a Beginner",
    description: "Learn how to structure stock research so it does not become overwhelming.",
    category: "Beginner Guide",
    date: "2026-05-10",
    readTime: "6 min read",
    relatedLinks: [
      related("/blog/why-stock-research-feels-overwhelming", "Why Stock Research Feels Overwhelming", "Understand the source of the noise."),
      related("/blog/how-to-research-a-stock-before-buying", "How to Research a Stock Before Buying", "Use a research checklist."),
      related("/blog/how-to-build-a-stock-watchlist", "How to Build a Stock Watchlist", "Keep research organized over time."),
    ],
    sections: [
      {
        heading: "Use the same order every time",
        paragraphs: [
          "Stock research becomes easier when you use a repeatable order. Start with the business, then financial statements, then risk factors, then management commentary, then bull and bear cases.",
          "Using the same order helps you compare companies and prevents the process from being controlled by whichever headline you saw first.",
        ],
      },
      {
        heading: "Create a one-page research note",
        paragraphs: [
          "A simple research note can include what the company does, how it makes money, key financial metrics, main risks, the bull case, the bear case, and open questions.",
          "The note does not need to be perfect. Its job is to make your thinking visible so you can update it when new filings or earnings reports arrive.",
        ],
      },
      {
        heading: "Keep open questions separate",
        paragraphs: [
          "Beginners often try to answer everything immediately. A better approach is to keep a list of open questions. For example: why did margins fall, how much debt matures soon, or what changed in risk factors?",
          "Open questions give your next research session a purpose.",
        ],
      },
      {
        heading: "Review instead of reacting",
        paragraphs: [
          "A calm research process creates room to review new information before reacting to it. Earnings reports, 10-Q filings, and stock price moves can all be added to the same structure.",
          "Over time, this turns research into a workflow rather than a scramble.",
        ],
      },
      ...commonResearchSections,
    ],
  },
]
