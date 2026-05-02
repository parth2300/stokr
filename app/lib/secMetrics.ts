type SecFactUnit = {
    fy?: number
    fp?: string
    form?: string
    filed?: string
    frame?: string
    val?: number
}

type SecCompanyFacts = {
    cik: number
    entityName: string
    facts?: {
        "us-gaap"?: Record<
            string,
            {
                label?: string
                description?: string
                units?: Record<string, SecFactUnit[]>
            }
        >
    }
}

export type CompanyMetric = {
    label: string
    value: string
    rawValue: number | null
    filed: string | null
    form: string | null
}

export type CompanyFinancialMetrics = {
    companyName: string
    cik: string
    ticker: string
    revenue: CompanyMetric
    netIncome: CompanyMetric
    operatingCashFlow: CompanyMetric
    capitalExpenditures: CompanyMetric
    freeCashFlow: CompanyMetric
    totalDebt: CompanyMetric
    cash: CompanyMetric
}

function formatCurrency(value: number | null) {
    if (value === null) return "Pending"

    const absValue = Math.abs(value)

    if (absValue >= 1_000_000_000_000) {
        return `$${(value / 1_000_000_000_000).toFixed(2)}T`
    }

    if (absValue >= 1_000_000_000) {
        return `$${(value / 1_000_000_000).toFixed(2)}B`
    }

    if (absValue >= 1_000_000) {
        return `$${(value / 1_000_000).toFixed(2)}M`
    }

    return `$${value.toLocaleString()}`
}

function isSameFilingPeriod(primaryFiled: string | null, comparisonFiled: string | null) {
    if (!primaryFiled || !comparisonFiled) return false

    const primaryDate = new Date(primaryFiled).getTime()
    const comparisonDate = new Date(comparisonFiled).getTime()

    const daysApart = Math.abs(primaryDate - comparisonDate) / (1000 * 60 * 60 * 24)

    return daysApart <= 120
}

function getLatestUsdFact(
    facts: SecCompanyFacts,
    possibleConcepts: string[],
    label: string
): CompanyMetric {
    const usGaap = facts.facts?.["us-gaap"]

    if (!usGaap) {
        return {
            label,
            value: "Pending",
            rawValue: null,
            filed: null,
            form: null,
        }
    }

    const candidates = possibleConcepts.flatMap((concept) => {
        const units = usGaap[concept]?.units
        const usdFacts = units?.USD || []

        return usdFacts
            .filter((fact) => typeof fact.val === "number")
            .filter((fact) => fact.form === "10-K")
            .map((fact) => ({
                ...fact,
                concept,
            }))
    })

    const latestFact = candidates.sort((a, b) => {
        const aDate = a.filed ? new Date(a.filed).getTime() : 0
        const bDate = b.filed ? new Date(b.filed).getTime() : 0

        return bDate - aDate
    })[0]

    if (!latestFact?.val) {
        return {
            label,
            value: "Pending",
            rawValue: null,
            filed: null,
            form: null,
        }
    }

    return {
        label,
        value: formatCurrency(latestFact.val),
        rawValue: latestFact.val,
        filed: latestFact.filed || null,
        form: latestFact.form || null,
    }
}

export function extractFinancialMetrics({
    ticker,
    cik,
    facts,
}: {
    ticker: string
    cik: string
    facts: SecCompanyFacts
}): CompanyFinancialMetrics {
    const revenue = getLatestUsdFact(
        facts,
        ["Revenues", "RevenueFromContractWithCustomerExcludingAssessedTax", "SalesRevenueNet"],
        "Revenue"
    )

    const netIncome = getLatestUsdFact(
        facts,
        ["NetIncomeLoss"],
        "Net Income"
    )

    const operatingCashFlow = getLatestUsdFact(
        facts,
        ["NetCashProvidedByUsedInOperatingActivities"],
        "Operating Cash Flow"
    )

    const capitalExpenditures = getLatestUsdFact(
        facts,
        [
            "PaymentsToAcquirePropertyPlantAndEquipment",
            "PaymentsToAcquireProductiveAssets",
            "PaymentsToAcquirePropertyPlantAndEquipmentAndIntangibleAssets",
        ],
        "Capital Expenditures"
    )

    const safeCapitalExpenditures =
        isSameFilingPeriod(operatingCashFlow.filed, capitalExpenditures.filed)
            ? capitalExpenditures
            : {
                label: "Capital Expenditures",
                value: "Pending",
                rawValue: null,
                filed: null,
                form: null,
            }

    const cash = getLatestUsdFact(
        facts,
        ["CashAndCashEquivalentsAtCarryingValue", "CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalents"],
        "Cash"
    )

    const longTermDebt = getLatestUsdFact(
        facts,
        ["LongTermDebt", "LongTermDebtAndFinanceLeaseObligations"],
        "Total Debt"
    )

    const capexIsSamePeriod = isSameFilingPeriod(
        operatingCashFlow.filed,
        capitalExpenditures.filed
    )

    const freeCashFlowRaw =
        operatingCashFlow.rawValue !== null &&
            capitalExpenditures.rawValue !== null &&
            capexIsSamePeriod
            ? operatingCashFlow.rawValue - Math.abs(capitalExpenditures.rawValue)
            : null

    return {
        companyName: facts.entityName,
        ticker,
        cik,
        revenue,
        netIncome,
        operatingCashFlow,
        capitalExpenditures: safeCapitalExpenditures,
        freeCashFlow: {
            label: "Free Cash Flow",
            value: formatCurrency(freeCashFlowRaw),
            rawValue: freeCashFlowRaw,
            filed: freeCashFlowRaw !== null ? operatingCashFlow.filed : null,
            form: freeCashFlowRaw !== null ? operatingCashFlow.form : null,
        },
        totalDebt: longTermDebt,
        cash,
    }
}

export function scoreRevenueGrowth(growthPercent: number) {
    if (growthPercent >= 20) return 100
    if (growthPercent >= 10) return 85
    if (growthPercent >= 5) return 70
    if (growthPercent >= 0) return 55
    if (growthPercent >= -10) return 35
    return 15
}

export function scoreNetIncomeMargin(marginPercent: number) {
    if (marginPercent >= 25) return 100
    if (marginPercent >= 15) return 85
    if (marginPercent >= 10) return 70
    if (marginPercent >= 5) return 55
    if (marginPercent >= 0) return 35
    return 10
}

export function scoreFreeCashFlowMargin(marginPercent: number) {
    if (marginPercent >= 20) return 100
    if (marginPercent >= 12) return 85
    if (marginPercent >= 7) return 70
    if (marginPercent >= 3) return 55
    if (marginPercent >= 0) return 35
    return 10
}

export function scoreDebtPressure(debtToRevenuePercent: number) {
    if (debtToRevenuePercent <= 10) return 100
    if (debtToRevenuePercent <= 25) return 85
    if (debtToRevenuePercent <= 50) return 70
    if (debtToRevenuePercent <= 100) return 45
    if (debtToRevenuePercent <= 200) return 25
    return 10
}

export function calculateSecFinancialScore({
    revenueGrowthPercent,
    netIncome,
    freeCashFlow,
    totalDebt,
    revenue,
}: {
    revenueGrowthPercent: number
    netIncome: number
    freeCashFlow: number
    totalDebt: number
    revenue: number
}) {
    const netIncomeMargin = revenue > 0 ? (netIncome / revenue) * 100 : 0
    const freeCashFlowMargin = revenue > 0 ? (freeCashFlow / revenue) * 100 : 0
    const debtToRevenue = revenue > 0 ? (totalDebt / revenue) * 100 : 999

    const revenueGrowthScore = scoreRevenueGrowth(revenueGrowthPercent)
    const netIncomeMarginScore = scoreNetIncomeMargin(netIncomeMargin)
    const freeCashFlowMarginScore = scoreFreeCashFlowMargin(freeCashFlowMargin)
    const debtPressureScore = scoreDebtPressure(debtToRevenue)

    const secScore =
        revenueGrowthScore * 0.25 +
        netIncomeMarginScore * 0.25 +
        freeCashFlowMarginScore * 0.25 +
        debtPressureScore * 0.25

    return {
        score: Math.round(secScore),
        breakdown: {
            revenueGrowthPercent,
            netIncomeMargin,
            freeCashFlowMargin,
            debtToRevenue,
            revenueGrowthScore,
            netIncomeMarginScore,
            freeCashFlowMarginScore,
            debtPressureScore,
        },
    }
}

export function calculateFinalHealthScore({
    secFinancialScore,
    aiFilingScore,
}: {
    secFinancialScore: number
    aiFilingScore: number
}) {
    return Math.round(secFinancialScore * 0.55 + aiFilingScore * 0.45)
}

export function scorePriceToSales(priceToSales: number) {
    if (priceToSales <= 2) return 100
    if (priceToSales <= 5) return 85
    if (priceToSales <= 8) return 70
    if (priceToSales <= 12) return 50
    if (priceToSales <= 20) return 30
    return 10
}

export function scorePriceToEarnings(priceToEarnings: number) {
    if (priceToEarnings <= 0) return 10
    if (priceToEarnings <= 15) return 100
    if (priceToEarnings <= 25) return 85
    if (priceToEarnings <= 35) return 65
    if (priceToEarnings <= 50) return 40
    return 15
}

export function scorePriceToFreeCashFlow(priceToFreeCashFlow: number) {
    if (priceToFreeCashFlow <= 0) return 10
    if (priceToFreeCashFlow <= 15) return 100
    if (priceToFreeCashFlow <= 25) return 85
    if (priceToFreeCashFlow <= 35) return 65
    if (priceToFreeCashFlow <= 50) return 40
    return 15
}

export function calculateMarketValuationScore({
    marketCap,
    revenue,
    netIncome,
    freeCashFlow,
}: {
    marketCap: number
    revenue: number
    netIncome: number
    freeCashFlow: number
}) {
    if (marketCap <= 0 || revenue <= 0) {
        return {
            score: 0,
            breakdown: {
                priceToSales: 0,
                priceToEarnings: 0,
                priceToFreeCashFlow: 0,
                priceToSalesScore: 0,
                priceToEarningsScore: 0,
                priceToFreeCashFlowScore: 0,
            },
        }
    }

    const priceToSales = marketCap / revenue
    const priceToEarnings = netIncome > 0 ? marketCap / netIncome : 0
    const priceToFreeCashFlow = freeCashFlow > 0 ? marketCap / freeCashFlow : 0

    const priceToSalesScore = scorePriceToSales(priceToSales)
    const priceToEarningsScore = scorePriceToEarnings(priceToEarnings)
    const priceToFreeCashFlowScore =
        scorePriceToFreeCashFlow(priceToFreeCashFlow)

    const score =
        priceToSalesScore * 0.3 +
        priceToEarningsScore * 0.35 +
        priceToFreeCashFlowScore * 0.35

    return {
        score: Math.round(score),
        breakdown: {
            priceToSales,
            priceToEarnings,
            priceToFreeCashFlow,
            priceToSalesScore,
            priceToEarningsScore,
            priceToFreeCashFlowScore,
        },
    }
}