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