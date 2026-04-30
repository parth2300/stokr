type SecCompanyTicker = {
    cik_str: number
    ticker: string
    title: string
}

type SecCompanyTickerResponse = Record<string, SecCompanyTicker>

const SEC_BASE_URL = "https://data.sec.gov"
const SEC_TICKERS_URL = "https://www.sec.gov/files/company_tickers.json"

function getSecHeaders() {
    const userAgent = process.env.SEC_USER_AGENT

    if (!userAgent) {
        throw new Error("Missing SEC_USER_AGENT in .env.local")
    }

    return {
        "User-Agent": userAgent,
        Accept: "application/json",
    }
}

export function padCik(cik: number | string) {
    return String(cik).padStart(10, "0")
}

export async function getCompanyByTicker(ticker: string) {
    const res = await fetch(SEC_TICKERS_URL, {
        headers: getSecHeaders(),
        next: { revalidate: 86400 },
    })

    if (!res.ok) {
        throw new Error("Failed to fetch SEC company ticker list")
    }

    const companies = (await res.json()) as SecCompanyTickerResponse

    const match = Object.values(companies).find(
        (company) => company.ticker.toLowerCase() === ticker.toLowerCase()
    )

    if (!match) {
        return null
    }

    return {
        cik: padCik(match.cik_str),
        ticker: match.ticker,
        name: match.title,
    }
}

export async function getCompanySubmissions(cik: string) {
    const paddedCik = padCik(cik)

    const res = await fetch(`${SEC_BASE_URL}/submissions/CIK${paddedCik}.json`, {
        headers: getSecHeaders(),
        next: { revalidate: 3600 },
    })

    if (!res.ok) {
        throw new Error("Failed to fetch SEC submissions")
    }

    return res.json()
}

export async function getCompanyFacts(cik: string) {
    const paddedCik = padCik(cik)

    const res = await fetch(
        `${SEC_BASE_URL}/api/xbrl/companyfacts/CIK${paddedCik}.json`,
        {
            headers: getSecHeaders(),
            cache: "no-store",
        }
    )

    if (!res.ok) {
        throw new Error("Failed to fetch SEC company facts")
    }

    return res.json()
}

export async function getLatestAnnualReport(ticker: string) {
    const company = await getCompanyByTicker(ticker)

    if (!company) {
        return null
    }

    const submissions = await getCompanySubmissions(company.cik)
    const recent = submissions.filings.recent

    const index = recent.form.findIndex((form: string) => form === "10-K")

    if (index === -1) {
        return {
            company,
            filing: null,
        }
    }

    return {
        company,
        filing: {
            form: recent.form[index],
            filingDate: recent.filingDate[index],
            accessionNumber: recent.accessionNumber[index],
            primaryDocument: recent.primaryDocument[index],
        },
    }
}

export function buildSecFilingDocumentUrl({
    cik,
    accessionNumber,
    primaryDocument,
}: {
    cik: string
    accessionNumber: string
    primaryDocument: string
}) {
    const cikNoLeadingZeros = String(Number(cik))
    const accessionNoDashes = accessionNumber.replaceAll("-", "")

    return `https://www.sec.gov/Archives/edgar/data/${cikNoLeadingZeros}/${accessionNoDashes}/${primaryDocument}`
}

export async function getFilingDocumentText({
    cik,
    accessionNumber,
    primaryDocument,
}: {
    cik: string
    accessionNumber: string
    primaryDocument: string
}) {
    const url = buildSecFilingDocumentUrl({
        cik,
        accessionNumber,
        primaryDocument,
    })

    const res = await fetch(url, {
        headers: getSecHeaders(),
        cache: "no-store",
    })

    if (!res.ok) {
        throw new Error("Failed to fetch SEC filing document")
    }

    const html = await res.text()

    return html
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/\s+/g, " ")
        .trim()
}

export async function getLatestAnnualReports(ticker: string, count = 2) {
    const company = await getCompanyByTicker(ticker)

    if (!company) {
        return null
    }

    const submissions = await getCompanySubmissions(company.cik)
    const recent = submissions.filings.recent

    const filings = recent.form
        .map((form: string, index: number) => ({
            form,
            filingDate: recent.filingDate[index],
            accessionNumber: recent.accessionNumber[index],
            primaryDocument: recent.primaryDocument[index],
        }))
        .filter((filing: { form: string }) => filing.form === "10-K")
        .slice(0, count)

    return {
        company,
        filings,
    }
}