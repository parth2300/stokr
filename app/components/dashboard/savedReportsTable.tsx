import Link from "next/link"
import { SavedReport } from "@/app/lib/dashboardTypes"

export default function SavedReportsTable({
  reports,
}: {
  reports: SavedReport[]
}) {
  return (
    <section className="min-w-0 rounded-xl border border-white/[0.09] bg-[#11141C] p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#7C8CFF]">
            Reports
          </p>

          <h2 className="mt-1 text-xl font-bold text-white">
            Saved AI Reports
          </h2>
        </div>

        <button className="text-xs font-semibold text-[#9AA6FF] hover:text-white">
          View All Reports
        </button>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.18em] text-slate-400">
              <th className="pb-3">Ticker</th>
              <th className="pb-3">Company</th>
              <th className="pb-3">Score</th>
              <th className="pb-3">Filing Date</th>
              <th className="pb-3">Generated</th>
              <th className="pb-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((report) => (
              <tr key={`${report.ticker}-${report.generatedAt}`} className="border-b border-white/6 last:border-b-0">
                <td className="py-3 font-bold text-white">{report.ticker}</td>

                <td className="py-3 text-slate-300">{report.companyName}</td>

                <td className="py-3">
                  <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                    {report.healthScore}
                  </span>
                </td>

                <td className="py-3 text-slate-400">{report.filingDate}</td>

                <td className="py-3 text-slate-400">{report.generatedAt}</td>

                <td className="py-3 text-right">
                  <Link
                    href={report.href}
                    className="rounded-lg border border-white/[0.10] bg-[#151923] px-2.5 py-1.5 text-[10px] font-semibold text-[#DDE2FF] hover:bg-[#191E29]"
                  >
                    View Report
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

