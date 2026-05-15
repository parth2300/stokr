import Link from "next/link"
import { SavedReport } from "@/app/lib/dashboardTypes"

function cleanValue(value: string | undefined, fallback: string) {
  if (!value || value === "Pending") return fallback
  return value
}

export default function SavedReportsTable({
  reports,
}: {
  reports: SavedReport[]
}) {
  return (
    <section className="min-w-0 border border-[#222120] bg-[#111111] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="stokr-kicker">
            Continue Research
          </p>

          <h2 className="mt-1 text-xl font-semibold text-white">
            Recent Research Briefs
          </h2>
        </div>

        <p className="font-mono text-xs uppercase tracking-[0.12em] text-[#3E3D3A]">
          {reports.length} cached {reports.length === 1 ? "brief" : "briefs"}
        </p>
      </div>

      <div className="mt-5 divide-y divide-[#222120] border-y border-[#222120]">
        {reports.slice(0, 6).map((report) => {
          const formType = cleanValue(report.formType, "")

          return (
            <article
              key={`${report.ticker}-${report.generatedAt}`}
              className="py-3.5"
            >
              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.45fr)_auto] md:items-center">
                <div className="min-w-0">
                  <p className="font-mono text-lg font-semibold text-white">
                    {report.ticker}
                  </p>
                  {report.companyName && (
                    <p className="mt-1 min-w-0 break-words text-sm text-[#CBD5E1]">
                      {report.companyName}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-[#7B8494] md:justify-start">
                  <span>Generated {cleanValue(report.generatedAt, "Not available")}</span>
                  <span aria-hidden="true">&middot;</span>
                  <span>Filing {cleanValue(report.filingDate, "Filing not available")}</span>
                  {formType && (
                    <>
                      <span aria-hidden="true">&middot;</span>
                      <span>{formType}</span>
                    </>
                  )}
                  {report.healthScore ? (
                    <>
                      <span aria-hidden="true">&middot;</span>
                      <span>Score {report.healthScore}</span>
                    </>
                  ) : null}
                </div>

                <Link
                  href={report.href}
                  className="stokr-button-primary shrink-0 md:justify-self-end"
                >
                  Open Brief
                </Link>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

