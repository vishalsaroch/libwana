'use client';

// If the alias is not configured, use a relative path like:
import AnalyticsDashboard from '../../../components/dashboard/AnalyticsDashboard';

export default function SellerAnalyticsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Seller Analytics</h1>
      <AnalyticsDashboard />
    </div>
  );
}
