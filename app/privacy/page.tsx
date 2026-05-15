import Link from "next/link"
import NavBar from "../components/navBar"

export const metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for stokr, an informational AI-powered stock research platform.",
}

export default function PrivacyPage() {
  return (
    <main className="stokr-page">
      <section className="relative min-h-screen px-6 py-5 md:px-10 lg:px-20">
        <div className="stokr-bg" />

        <div className="relative z-10 mx-auto max-w-5xl">
          <NavBar />

          <article className="stokr-card my-12 p-6 md:p-10">
            <p className="stokr-kicker">
              Legal
            </p>

            <h1 className="mt-4 text-5xl font-semibold italic leading-[0.98] tracking-normal md:text-6xl">
              Privacy Policy
            </h1>

            <p className="mt-4 text-sm text-slate-400">
              Last updated: May 6, 2026
            </p>

            <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-300">
              <section>
                <h2 className="text-xl font-bold text-white">
                  1. Overview
                </h2>
                <p className="mt-3">
                  This Privacy Policy explains how stokr collects, uses, stores,
                  and shares information when you access or use our website,
                  stock research tools, AI-generated reports, watchlists,
                  dashboard features, subscription services, and related
                  functionality.
                </p>
                <p className="mt-3">
                  stokr is an informational stock research platform. stokr does
                  not provide financial advice, investment advice, trading
                  advice, tax advice, legal advice, brokerage services,
                  investment advisory services, personalized recommendations, or
                  fiduciary services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white">
                  2. Information We Collect
                </h2>

                <p className="mt-3">
                  We may collect the following categories of information:
                </p>

                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>
                    <span className="font-semibold text-white">
                      Account information:
                    </span>{" "}
                    username, email address, account identifier, account status,
                    accepted Terms of Service status, accepted Terms timestamp,
                    and accepted Terms version.
                  </li>

                  <li>
                    <span className="font-semibold text-white">
                      Authentication information:
                    </span>{" "}
                    login session data and authentication tokens handled through
                    Supabase Auth. stokr does not directly store your plaintext
                    password in the application database.
                  </li>

                  <li>
                    <span className="font-semibold text-white">
                      Watchlist information:
                    </span>{" "}
                    watchlist names, watchlist descriptions, saved stock
                    tickers, watchlist settings, and related account-linked
                    watchlist records.
                  </li>

                  <li>
                    <span className="font-semibold text-white">
                      Report usage information:
                    </span>{" "}
                    tickers requested for AI reports, report usage counts,
                    visitor identifiers, account identifiers when logged in, and
                    timestamps used to enforce free report limits and premium
                    access rules.
                  </li>

                  <li>
                    <span className="font-semibold text-white">
                      Subscription and billing status:
                    </span>{" "}
                    Stripe customer ID, Stripe subscription ID, Stripe price ID,
                    subscription status, subscription renewal period, cancellation
                    status, premium access tier, and premium access timestamps.
                    Payment card details are processed by Stripe and are not
                    directly stored by stokr.
                  </li>

                  <li>
                    <span className="font-semibold text-white">
                      Stock research data:
                    </span>{" "}
                    tickers searched or viewed, generated report access activity,
                    financial metrics, cached market data, cached AI analysis,
                    SEC filing references, and filing comparison data.
                  </li>

                  <li>
                    <span className="font-semibold text-white">
                      Device, usage, and analytics information:
                    </span>{" "}
                    pages viewed, interactions, approximate device/browser
                    information, referring pages, and similar analytics data if
                    analytics tools are enabled.
                  </li>

                  <li>
                    <span className="font-semibold text-white">
                      Technical information:
                    </span>{" "}
                    IP address, request headers, logs, error messages, security
                    events, and other technical data needed to operate, secure,
                    debug, and improve the service.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white">
                  3. Information Stored Locally on Your Device
                </h2>

                <p className="mt-3">
                  stokr may use browser storage, including localStorage, to
                  support site functionality. For example, stokr may store a
                  visitor identifier named{" "}
                  <span className="font-semibold text-white">
                    stokr_visitor_id
                  </span>{" "}
                  to enforce free AI report limits for users who are not logged
                  in.
                </p>

                <p className="mt-3">
                  stokr may also use browser storage, authentication session
                  storage, cookies, or similar technologies through third-party
                  tools such as Supabase, Stripe, Google Analytics, or the
                  browser itself. The site may also register a service worker for
                  progressive web app functionality and offline asset handling.
                </p>

                <p className="mt-3">
                  You can control cookies and local storage through your browser
                  settings. Blocking or deleting storage may affect login,
                  report-limit tracking, analytics, and other site features.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white">
                  4. How We Use Information
                </h2>

                <p className="mt-3">
                  We may use collected information to:
                </p>

                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>Create, authenticate, and manage user accounts.</li>
                  <li>Provide stock research pages, AI reports, charts, metrics, watchlists, and dashboards.</li>
                  <li>Enforce free usage limits, premium access rules, rate limits, and anti-abuse controls.</li>
                  <li>Process subscriptions, cancellations, billing portal access, and premium account status through Stripe.</li>
                  <li>Generate and cache AI-powered stock analysis based on public company filings and market-related data.</li>
                  <li>Retrieve and display public company information, SEC filing data, financial metrics, and market data.</li>
                  <li>Maintain, debug, secure, and improve stokr.</li>
                  <li>Analyze site usage and performance if analytics tools are enabled.</li>
                  <li>Prevent fraud, abuse, unauthorized access, scraping, excessive API usage, and misuse of the service.</li>
                  <li>Comply with legal, tax, accounting, security, and operational obligations.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white">
                  5. AI Processing
                </h2>

                <p className="mt-3">
                  stokr uses OpenAI or similar AI service providers to generate
                  stock analysis from public company information, including SEC
                  filing text, ticker symbols, company names, and related
                  financial research inputs.
                </p>

                <p className="mt-3">
                  Based on the current application code, AI report generation is
                  designed around public company data and does not need to send
                  your password, payment card details, or full account profile to
                  the AI provider.
                </p>

                <p className="mt-3">
                  AI-generated content may be inaccurate, incomplete, outdated,
                  or misleading. You should independently verify all financial
                  information before relying on it.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white">
                  6. Payment Processing
                </h2>

                <p className="mt-3">
                  stokr uses Stripe to process subscriptions, checkout sessions,
                  billing portal access, subscription updates, cancellations,
                  and related payment events.
                </p>

                <p className="mt-3">
                  stokr stores Stripe-related identifiers and subscription status
                  information so that premium access can be granted, updated, or
                  removed. stokr does not directly store full payment card
                  numbers, card security codes, or complete banking details.
                </p>

                <p className="mt-3">
                  Your use of Stripe checkout, billing, and payment features is
                  also subject to Stripe’s own terms and privacy practices.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white">
                  7. Third-Party Services
                </h2>

                <p className="mt-3">
                  stokr may use third-party services to operate the platform,
                  process payments, authenticate users, provide market data,
                  generate AI analysis, measure usage, and maintain site
                  performance.
                </p>

                <p className="mt-3">
                  These services may include:
                </p>

                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>
                    <span className="font-semibold text-white">Supabase</span>{" "}
                    for authentication, account data, database storage, access
                    control, and backend records.
                  </li>
                  <li>
                    <span className="font-semibold text-white">Stripe</span>{" "}
                    for checkout, subscription billing, billing portal sessions,
                    payment events, and payment-related records.
                  </li>
                  <li>
                    <span className="font-semibold text-white">OpenAI</span>{" "}
                    for AI-generated stock analysis based on public filing and
                    company data.
                  </li>
                  <li>
                    <span className="font-semibold text-white">Finnhub</span>{" "}
                    and{" "}
                    <span className="font-semibold text-white">
                      Alpha Vantage
                    </span>{" "}
                    for stock quotes, company profile data, chart data, and
                    market data.
                  </li>
                  <li>
                    <span className="font-semibold text-white">SEC EDGAR</span>{" "}
                    for public company filings and related filing information.
                  </li>
                  <li>
                    <span className="font-semibold text-white">
                      Google Analytics
                    </span>{" "}
                    if enabled through the site’s analytics configuration.
                  </li>
                  <li>
                    Hosting, infrastructure, logging, security, and deployment
                    providers used to operate the website.
                  </li>
                </ul>

                <p className="mt-3">
                  Third-party services may process information according to
                  their own terms, privacy policies, security practices, and
                  legal obligations.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white">
                  8. How We Share Information
                </h2>

                <p className="mt-3">
                  We may share information in the following circumstances:
                </p>

                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>
                    <span className="font-semibold text-white">
                      Service providers:
                    </span>{" "}
                    with vendors that help operate stokr, including hosting,
                    database, authentication, payment, analytics, AI, and market
                    data providers.
                  </li>

                  <li>
                    <span className="font-semibold text-white">
                      Payment processing:
                    </span>{" "}
                    with Stripe to create customer records, process
                    subscriptions, manage billing, and update premium access.
                  </li>

                  <li>
                    <span className="font-semibold text-white">
                      Security and abuse prevention:
                    </span>{" "}
                    when needed to detect, prevent, investigate, or respond to
                    fraud, unauthorized access, scraping, excessive usage,
                    security incidents, or violations of our Terms of Service.
                  </li>

                  <li>
                    <span className="font-semibold text-white">
                      Legal compliance:
                    </span>{" "}
                    when required to comply with law, regulation, subpoena,
                    court order, tax obligations, accounting obligations, or
                    lawful government requests.
                  </li>

                  <li>
                    <span className="font-semibold text-white">
                      Business transfers:
                    </span>{" "}
                    in connection with a merger, acquisition, financing,
                    reorganization, sale of assets, or transfer of all or part of
                    stokr.
                  </li>
                </ul>

                <p className="mt-3">
                  stokr does not sell personal information for money. If stokr
                  later uses advertising, affiliate tracking, retargeting, or
                  analytics practices that qualify as a “sale” or “sharing” under
                  applicable privacy laws, this Privacy Policy should be updated
                  and additional opt-out mechanisms may be required.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white">
                  9. Affiliate Links and Brokerage Offers
                </h2>

                <p className="mt-3">
                  stokr may display affiliate links, sponsored links, referral
                  links, brokerage offers, or partner offers. If you click an
                  affiliate or referral link, the destination provider or
                  affiliate network may receive information such as the referring
                  page, link identifier, browser information, approximate device
                  information, and conversion activity.
                </p>

                <p className="mt-3">
                  stokr may receive compensation if you open an account,
                  subscribe, sign up, or complete another qualifying action
                  through certain partner links. Affiliate relationships do not
                  make stokr a broker, investment adviser, financial adviser, or
                  fiduciary.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white">
                  10. Data Retention
                </h2>

                <p className="mt-3">
                  stokr keeps information for as long as reasonably necessary to
                  provide the service, maintain accounts, enforce usage limits,
                  process subscriptions, comply with legal obligations, resolve
                  disputes, prevent abuse, improve the platform, and maintain
                  security.
                </p>

                <p className="mt-3">
                  Specific retention periods may vary depending on the type of
                  information. The current codebase does not define a single
                  universal deletion schedule for all tables, logs, analytics
                  records, billing records, or cached research data.
                </p>

                <p className="mt-3">
                  Cached market data, cached AI analysis, SEC filing analysis,
                  and other non-user-specific research records may remain after
                  an individual account is deleted because those records are used
                  to operate the platform and may not be tied only to one user.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white">
                  11. Account Deletion
                </h2>

                <p className="mt-3">
                  stokr provides an account deletion flow from account settings.
                  Based on the current application code, account deletion removes
                  your profile record, watchlists, watchlist items, and Supabase
                  authentication account.
                </p>

                <p className="mt-3">
                  Account deletion may not immediately remove all information
                  from backups, logs, analytics systems, billing systems,
                  third-party processors, cached non-user-specific research
                  records, fraud-prevention records, or records that must be kept
                  for legal, tax, accounting, dispute-resolution, or security
                  reasons.
                </p>

                <p className="mt-3">
                  If you have an active paid subscription, you should also manage
                  or cancel the subscription through the billing portal before or
                  during account deletion to avoid future billing issues.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white">
                  12. Security
                </h2>

                <p className="mt-3">
                  We use technical and organizational measures intended to
                  protect information, including authentication, authorization,
                  backend access controls, third-party payment processing, and
                  server-side handling of sensitive service-role operations.
                </p>

                <p className="mt-3">
                  No website, application, database, API, hosting provider, or
                  internet transmission is completely secure. We cannot guarantee
                  that unauthorized access, data loss, misuse, service
                  interruption, or security incidents will never occur.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white">
                  13. Your Choices
                </h2>

                <p className="mt-3">
                  Depending on your location and applicable law, you may have the
                  right to request access to personal information, correction of
                  personal information, deletion of personal information,
                  information about how personal information is used or shared,
                  or other privacy rights.
                </p>

                <p className="mt-3">
                  You can also:
                </p>

                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>Delete or block cookies and local storage through your browser settings.</li>
                  <li>Log out of your account when you are done using stokr.</li>
                  <li>Use account settings to manage your account and subscription options.</li>
                  <li>Use the billing portal to manage paid subscription status when available.</li>
                  <li>Request account deletion through the account settings flow.</li>
                  <li>Contact stokr about privacy-related requests using the contact information below.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white">
                  14. California Privacy Notice
                </h2>

                <p className="mt-3">
                  If California privacy law applies to you and to stokr, you may
                  have rights to know what categories of personal information are
                  collected, used, disclosed, sold, or shared; request deletion;
                  request correction; opt out of certain sale or sharing
                  practices; limit certain uses of sensitive personal
                  information; and avoid discrimination for exercising privacy
                  rights.
                </p>

                <p className="mt-3">
                  stokr does not currently sell personal information for money.
                  If stokr later implements advertising, affiliate tracking,
                  retargeting, data sharing, or analytics practices that qualify
                  as a sale or sharing under applicable law, this policy should
                  be updated and the required opt-out methods should be provided.
                </p>

                <p className="mt-3">
                  To make a privacy request, contact stokr using the contact
                  information below. We may need to verify your identity before
                  fulfilling certain requests.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white">
                  15. Children’s Privacy
                </h2>

                <p className="mt-3">
                  stokr is not intended for children under 13 years old. We do
                  not knowingly collect personal information from children under
                  13. If you believe a child has provided personal information to
                  stokr, contact us so we can review and take appropriate action.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white">
                  16. International Users
                </h2>

                <p className="mt-3">
                  stokr is operated from the United States. If you access stokr
                  from outside the United States, your information may be
                  processed in the United States or other jurisdictions where our
                  service providers operate. Privacy laws in those jurisdictions
                  may differ from the laws where you live.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white">
                  17. Changes to This Privacy Policy
                </h2>

                <p className="mt-3">
                  We may update this Privacy Policy from time to time. The
                  updated version will be posted on this page with a revised
                  “Last updated” date. Continued use of stokr after the updated
                  policy is posted means you acknowledge the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-white">
                  18. Contact
                </h2>

                <p className="mt-3">
                  For privacy questions, account deletion questions, or privacy
                  rights requests, contact:
                </p>

                <p className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-4 font-semibold text-white">
                  stokrsupport@stokr.live
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
                href="/terms"
                className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-[#0F172A] hover:bg-blue-100"
              >
                View Terms
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}
