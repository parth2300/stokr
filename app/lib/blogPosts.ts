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

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-read-a-stock-analysis",
    title: "How to Read a Stock Analysis Without Getting Overwhelmed",
    description:
      "A beginner-friendly guide to understanding stock analysis, including company overview, financial metrics, risks, and bull vs bear cases.",
    category: "Beginner Guide",
    date: "2026-05-10",
    readTime: "5 min read",
    relatedLinks: [
      {
        href: "/blog/what-is-a-10-k",
        label: "What Is a 10-K and Why Does It Matter?",
        description: "Learn how annual filings fit into company research.",
      },
      {
        href: "/blog/bull-case-vs-bear-case",
        label: "Bull Case vs Bear Case",
        description: "Compare positive and risk-focused research arguments.",
      },
      {
        href: "/blog/how-to-use-risk-factors",
        label: "How to Use Risk Factors",
        description: "Read company risk disclosures with more context.",
      },
    ],
    sections: [
      {
        heading: "Start With What the Company Does",
        paragraphs: [
          "Before looking at ratios or charts, make sure you can explain the business in plain English. What does the company sell, who buys it, and what makes revenue move?",
          "A useful stock analysis should make the business model clear before asking you to interpret financial details.",
        ],
      },
      {
        heading: "Read Financials in Groups",
        paragraphs: [
          "Revenue, profitability, debt, and cash flow work best when they are read together. One strong metric rarely tells the full story.",
          "For example, revenue growth may look attractive, but cash flow and debt can show whether that growth is expensive or fragile.",
        ],
        bullets: [
          "Look at revenue to understand business scale.",
          "Look at profitability to understand operating quality.",
          "Look at debt and cash flow to understand financial flexibility.",
        ],
      },
      {
        heading: "Take Risk Factors Seriously",
        paragraphs: [
          "Risk factors are not predictions. They are company-disclosed issues that could materially affect the business.",
          "Beginners should look for risks that repeat across filings, newly added risks, and risks that connect directly to revenue, operations, regulation, or financing.",
        ],
      },
      {
        heading: "Compare Bull and Bear Cases",
        paragraphs: [
          "A bull case explains the positive argument for a company. A bear case explains the cautious or negative argument.",
          "Good research considers both sides. stokr organizes company overview, financial context, risk factors, and bull vs bear summaries so the research process is easier to follow.",
        ],
      },
    ],
  },
  {
    slug: "what-is-a-10-k",
    title: "What Is a 10-K and Why Does It Matter?",
    description:
      "A plain-English explanation of 10-K annual reports, why public companies file them, and what investors can learn from them.",
    category: "SEC Filings",
    date: "2026-05-10",
    readTime: "6 min read",
    relatedLinks: [
      {
        href: "/blog/how-to-use-risk-factors",
        label: "How to Use Risk Factors",
        description: "See how one important 10-K section can inform research.",
      },
      {
        href: "/blog/how-to-read-a-stock-analysis",
        label: "How to Read a Stock Analysis",
        description: "Put filings, financials, and risks into one workflow.",
      },
    ],
    sections: [
      {
        heading: "A 10-K Is an Annual Company Report",
        paragraphs: [
          "A 10-K is an annual report that public companies file with the SEC. It gives a detailed view of the business, financial statements, risks, and management discussion.",
          "Unlike social media posts or headlines, a 10-K comes directly from the company and follows a required disclosure format.",
        ],
      },
      {
        heading: "What You Can Find Inside",
        paragraphs: [
          "A 10-K usually includes a business overview, risk factors, financial statements, management discussion and analysis, legal proceedings, and accounting notes.",
          "The filing can be long and dense, but it often contains the most useful starting point for understanding how a public company describes itself.",
        ],
        bullets: [
          "Business overview and operating segments",
          "Risk factors and legal details",
          "Financial statements and management commentary",
        ],
      },
      {
        heading: "Why It Matters",
        paragraphs: [
          "A 10-K helps investors understand what the company says is important, what could go wrong, and how the financial picture has changed.",
          "stokr helps summarize and organize 10-K information so users can move through filings with less noise and more structure.",
        ],
      },
    ],
  },
  {
    slug: "bull-case-vs-bear-case",
    title: "Bull Case vs Bear Case: What Investors Should Understand",
    description:
      "Learn the difference between a bull case and bear case, and why both matter when researching a stock.",
    category: "Stock Research",
    date: "2026-05-10",
    readTime: "4 min read",
    relatedLinks: [
      {
        href: "/blog/how-to-read-a-stock-analysis",
        label: "How to Read a Stock Analysis",
        description: "Learn where bull and bear cases fit in the research page.",
      },
    ],
    sections: [
      {
        heading: "What a Bull Case Means",
        paragraphs: [
          "A bull case is the positive argument for a company. It may focus on growth, margins, product strength, market position, or improving financials.",
          "It is not a prediction that the stock will rise. It is one side of the research picture.",
        ],
      },
      {
        heading: "What a Bear Case Means",
        paragraphs: [
          "A bear case is the risk-focused or negative argument. It may focus on slowing growth, high valuation, debt, competition, regulation, or execution risk.",
          "A bear case is not automatically a reason to avoid a company. It helps define what could challenge the business.",
        ],
      },
      {
        heading: "Why Both Matter",
        paragraphs: [
          "Beginners can get pulled toward information that confirms what they already want to believe. Reading both sides helps reduce that bias.",
          "stokr presents bull and bear summaries to help users compare perspectives without turning the page into a recommendation.",
        ],
      },
    ],
  },
  {
    slug: "how-to-use-risk-factors",
    title: "How to Use Risk Factors When Researching a Stock",
    description:
      "A beginner-friendly guide to reading company risk factors and understanding what they reveal about a business.",
    category: "Risk Analysis",
    date: "2026-05-10",
    readTime: "5 min read",
    relatedLinks: [
      {
        href: "/blog/what-is-a-10-k",
        label: "What Is a 10-K and Why Does It Matter?",
        description: "Understand where risk factors appear in annual filings.",
      },
      {
        href: "/blog/how-to-read-a-stock-analysis",
        label: "How to Read a Stock Analysis",
        description: "Connect risk disclosures with financial context.",
      },
    ],
    sections: [
      {
        heading: "Risk Factors Come From Filings",
        paragraphs: [
          "Risk factors are disclosures in company filings that describe events or conditions that could materially affect the business.",
          "They are not predictions, and they are not always equally likely. They are a structured way to see what the company believes could matter.",
        ],
      },
      {
        heading: "What to Look For",
        paragraphs: [
          "Repeated risks can show persistent pressure. New risks can show a changing business environment. Risks connected to revenue, operations, financing, or regulation often deserve extra attention.",
          "Risk factors are most useful when read beside financials and business context.",
        ],
        bullets: [
          "Repeated risks across filings",
          "New or expanded risks",
          "Risks tied to revenue, operations, or debt",
        ],
      },
      {
        heading: "How stokr Helps",
        paragraphs: [
          "stokr helps surface and summarize risk factors so users can scan the important themes faster.",
          "The goal is not to remove judgment. The goal is to make the underlying filing information easier to work with.",
        ],
      },
    ],
  },
  {
    slug: "stock-research-without-the-noise",
    title: "Stock Research Without the Noise",
    description:
      "Why stokr focuses on filings, financials, risks, and clear explanations instead of hype-driven stock content.",
    category: "stokr",
    date: "2026-05-10",
    readTime: "4 min read",
    relatedLinks: [
      {
        href: "/blog/how-to-read-a-stock-analysis",
        label: "How to Read a Stock Analysis",
        description: "A practical starting point for using stokr research pages.",
      },
      {
        href: "/stocks/nvda",
        label: "NVDA stock research",
        description: "Open a real stock research page and inspect the format.",
      },
      {
        href: "/stocks/aapl",
        label: "AAPL stock research",
        description: "Review another large-company example in stokr.",
      },
    ],
    sections: [
      {
        heading: "Investing Content Can Get Noisy",
        paragraphs: [
          "Many investing platforms mix charts, opinions, headlines, social posts, and alerts into one stream. For beginners, that can make research feel louder instead of clearer.",
          "Noise can make it harder to separate company fundamentals from short-term attention.",
        ],
      },
      {
        heading: "What stokr Focuses On",
        paragraphs: [
          "stokr focuses on filings, financials, risks, charts, and plain-English summaries. The product is built around company research rather than hype.",
          "The goal is not to tell users what to buy. The goal is to help users research companies faster and more clearly.",
        ],
      },
      {
        heading: "A Filing-First Workflow",
        paragraphs: [
          "Company filings are dense, but they are also one of the best primary sources for understanding a public company.",
          "stokr organizes that information into a calmer workflow so users can inspect the business, risks, and research context without losing the thread.",
        ],
      },
    ],
  },
]
