import PremiumRouteGuard from "../components/auth/premiumRouteGuard"
import OptimizedDashboardContent from "../components/dashboard/OptimizedDashboardContent"

export const revalidate = 300

export default function DashboardPage() {
  return (
    <PremiumRouteGuard>
      <OptimizedDashboardContent />
    </PremiumRouteGuard>
  )
}