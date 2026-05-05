import Link from "next/link"
import NavBar from "../components/navBar"

export const metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for stokr, an informational AI-powered stock research platform.",
}

export default function TermsPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0F172A] text-white">
      <section className="relative min-h-screen px-6 py-5 md:px-10 lg:px-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_18%,rgba(255,138,101,0.22),transparent_38%),radial-gradient(circle_at_82%_20%,rgba(124,157,255,0.24),transparent_42%),radial-gradient(circle_at_50%_70%,rgba(124,157,255,0.08),transparent_48%)]" />
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 mx-auto max-w-5xl">
          <NavBar />

          <article className="my-12 rounded-[30px] border border-[#7C9DFF]/40 bg-white/[0.045] p-6 shadow-[0_0_24px_rgba(124,157,255,0.12)] backdrop-blur-md md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#7C9DFF]">
              Legal
            </p>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">
              Terms of Service
            </h1>

            <p className="mt-4 text-sm text-slate-400">
              Last updated: May 4, 2026
            </p>

            <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-300">
              <section>
                <h2 className="text-xl font-bold text-white">
                  1. Acceptance of Terms
                </h2>
                <p className="mt-3">
                  These Terms of Service govern your access to and use of stokr,
                  including our website, stock research tools, AI-generated reports,
                  watchlists, dashboard features, subscription services, and related
                  functionality. By creating an account, accessing the site, generating
                  reports, purchasing a subscription, or using any part of stokr, you
                  agree to these Terms.
                </p>
                <p className="mt-3">
                  If you do not agree to these Terms, do not use stokr.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white">
                  2. Description of Service
                </h2>
                <p className="mt-3">
                  stokr is an informational stock research platform that provides
                  AI-powered company summaries, SEC filing analysis, risk highlights,
                  filing comparisons, financial health insights, watchlists, and
                  dashboard tools. stokr is designed to help users organize and review
                  public company information more efficiently.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white">
                  3. Informational Purposes Only; Not Financial Advice
                </h2>
                <p className="mt-3">
                  stokr provides informational research only. stokr does not provide
                  financial advice, investment advice, trading advice, tax advice,
                  legal advice, brokerage services, investment advisory services,
                  personalized recommendations, or fiduciary services.
                </p>
                <p className="mt-3">
                  Nothing on stokr should be interpreted as a recommendation to buy,
                  sell, hold, short, trade, or otherwise transact in any security,
                  option, derivative, cryptocurrency, fund, or financial instrument.
                  You are solely responsible for your own investment and trading
                  decisions.
                </p>
                <p className="mt-3">
                  You should consult qualified financial, legal, tax, or investment
                  professionals before making financial decisions.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white">
                  4. No Guarantee of Accuracy, Completeness, or Results
                </h2>
                <p className="mt-3">
                  stokr may display AI-generated analysis, third-party market data,
                  SEC filing information, cached data, calculated scores, risk
                  summaries, watchlist data, and other research outputs. This
                  information may be inaccurate, incomplete, delayed, outdated,
                  unavailable, or incorrectly interpreted.
                </p>
                <p className="mt-3">
                  stokr does not guarantee the accuracy, completeness, reliability,
                  timeliness, or usefulness of any information provided through the
                  service.
                </p>
                <p className="mt-3">
                  stokr does not guarantee any investment outcome, trading result,
                  stock price movement, financial return, or profit. Past performance
                  does not guarantee future results.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white">
                  5. AI-Generated Content Disclaimer
                </h2>
                <p className="mt-3">
                  Some content on stokr is generated or assisted by artificial
                  intelligence. AI-generated content may contain errors, omissions,
                  hallucinations, outdated information, unsupported interpretations,
                  or misleading conclusions.
                </p>
                <p className="mt-3">
                  You agree to independently verify all information before relying on
                  it. AI-generated reports are not a substitute for professional
                  advice, independent research, or direct review of official filings
                  and data sources.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white">
                  6. Third-Party Data and External Services
                </h2>
                <p className="mt-3">
                  stokr may rely on third-party data providers, public filings,
                  financial APIs, payment processors, analytics tools, and cloud
                  services. We are not responsible for third-party data errors,
                  downtime, delays, interruptions, missing data, API limits, incorrect
                  market prices, incomplete filings, or external service failures.
                </p>
                <p className="mt-3">
                  Market data and analysis may be delayed, cached, estimated, or
                  unavailable. You should verify financial information using official
                  sources before making decisions.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white">
                  7. User Accounts
                </h2>
                <p className="mt-3">
                  You may need an account to access certain features. You are
                  responsible for maintaining the confidentiality of your login
                  credentials and for all activity that occurs under your account.
                </p>
                <p className="mt-3">
                  You agree to provide accurate account information and to keep your
                  account information current. You may not share, sell, transfer, or
                  misuse your account.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white">
                  8. Free Features, Limits, and Changes
                </h2>
                <p className="mt-3">
                  stokr may offer free access with limits, including limits on AI
                  stock reports, watchlists, saved stocks, dashboard access, report
                  history, processing priority, or other features.
                </p>
                <p className="mt-3">
                  We may change free limits, pricing, feature availability, rate
                  limits, report access rules, or premium benefits at any time. We may
                  also restrict or suspend access to prevent abuse, protect system
                  performance, control API costs, or comply with legal or operational
                  requirements.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white">
                  9. Subscriptions, Billing, and Cancellation
                </h2>
                <p className="mt-3">
                  stokr Premium is a paid subscription that may provide unlimited AI
                  stock reports, expanded watchlist tools, dashboard access, deeper
                  filing analysis, and other premium features. Subscription billing is
                  processed by Stripe or another third-party payment processor.
                </p>
                <p className="mt-3">
                  By purchasing a subscription, you authorize recurring charges at
                  the price and billing interval shown at checkout until you cancel.
                  Prices, features, and billing terms may change, but changes will
                  not apply retroactively unless required by law.
                </p>
                <p className="mt-3">
                  You can manage or cancel your subscription through the account
                  settings or billing portal provided in stokr. If you cancel, your
                  Premium access may continue until the end of the current billing
                  period unless otherwise stated or required by law.
                </p>
                <p className="mt-3">
                  Subscription payments are generally non-refundable except where
                  required by law or expressly stated by stokr. We may issue refunds
                  at our discretion.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white">
                  10. Payment Failures and Access Changes
                </h2>
                <p className="mt-3">
                  If a payment fails, your subscription becomes past due, or your
                  subscription is canceled, stokr may limit, suspend, or downgrade
                  your access to free features. We are not responsible for loss of
                  access caused by failed payments, expired cards, payment processor
                  errors, chargebacks, or billing disputes.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white">
                  11. Acceptable Use
                </h2>
                <p className="mt-3">
                  You agree not to misuse stokr. Prohibited activity includes:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>Using bots, scripts, scrapers, or automated systems without permission.</li>
                  <li>Attempting to bypass report limits, paywalls, rate limits, or account restrictions.</li>
                  <li>Sharing, reselling, or redistributing reports commercially without permission.</li>
                  <li>Reverse engineering, copying, or attacking the service.</li>
                  <li>Interfering with APIs, servers, billing systems, or user accounts.</li>
                  <li>Using stokr for illegal, fraudulent, abusive, or harmful activity.</li>
                  <li>Submitting false payment information or abusing chargebacks.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white">
                  12. Intellectual Property
                </h2>
                <p className="mt-3">
                  stokr and its software, design, branding, logos, user interface,
                  report structure, generated layouts, platform content, and related
                  materials are owned by stokr or its licensors. You may not copy,
                  reproduce, modify, sell, license, distribute, or exploit any part of
                  stokr except as allowed by these Terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white">
                  13. Account Suspension or Termination
                </h2>
                <p className="mt-3">
                  We may suspend, limit, or terminate your access to stokr at any time
                  if we believe you violated these Terms, abused the service,
                  attempted to bypass limits, created security or operational risk,
                  engaged in fraud, or used the service unlawfully.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white">
                  14. Service Availability
                </h2>
                <p className="mt-3">
                  stokr may be unavailable, delayed, interrupted, or modified at any
                  time. We do not guarantee uninterrupted access, error-free
                  operation, permanent availability of reports, or continued support
                  for any feature.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white">
                  15. Disclaimer of Warranties
                </h2>
                <p className="mt-3">
                  stokr is provided “as is” and “as available.” To the fullest extent
                  permitted by law, we disclaim all warranties, express or implied,
                  including warranties of accuracy, merchantability, fitness for a
                  particular purpose, non-infringement, reliability, availability, and
                  suitability for investment or trading decisions.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white">
                  16. Limitation of Liability
                </h2>
                <p className="mt-3">
                  To the fullest extent permitted by law, stokr and its owners,
                  operators, employees, contractors, service providers, and affiliates
                  will not be liable for investment losses, trading losses, lost
                  profits, lost revenue, lost data, inaccurate reports, delayed data,
                  third-party service failures, indirect damages, incidental damages,
                  consequential damages, special damages, punitive damages, or damages
                  arising from your reliance on stokr.
                </p>
                <p className="mt-3">
                  To the fullest extent permitted by law, our total liability for any
                  claim related to stokr will not exceed the amount you paid to stokr
                  during the three months before the claim arose.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white">
                  17. Indemnification
                </h2>
                <p className="mt-3">
                  You agree to defend, indemnify, and hold harmless stokr from claims,
                  damages, liabilities, losses, costs, and expenses, including
                  reasonable attorneys’ fees, arising from your use of the service,
                  violation of these Terms, misuse of reports, violation of law, or
                  infringement of third-party rights.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white">
                  18. Privacy
                </h2>
                <p className="mt-3">
                  Your use of stokr may involve the collection and processing of
                  account information, watchlists, report usage, analytics data, and
                  payment status. Payment card information is processed by Stripe or
                  another payment processor and is not directly stored by stokr.
                </p>
                <p className="mt-3">
                  A Privacy Policy should be made available separately and will
                  explain how information is collected, used, and shared.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white">
                  19. Changes to These Terms
                </h2>
                <p className="mt-3">
                  We may update these Terms from time to time. The updated Terms will
                  be posted on this page with a revised “Last updated” date. Continued
                  use of stokr after changes become effective means you accept the
                  updated Terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white">
                  20. Contact
                </h2>
                <p className="mt-3">
                  For questions about these Terms, contact:
                </p>
                <p className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-4 font-semibold text-white">
                  support@stokr.live
                </p>
              </section>
            </div>

            <div className="mt-10 flex flex-wrap gap-3 border-t border-white/10 pt-6">
              <Link
                href="/"
                className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/15"
              >
                Back Home
              </Link>

              <Link
                href="/pricing"
                className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-[#0F172A] hover:bg-blue-100"
              >
                View Pricing
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}