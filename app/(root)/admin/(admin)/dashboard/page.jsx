import CountOverview from "@/components/application/admin/count-overview";
import LatestOrdersTable from "@/components/application/admin/latest-orders-table";
import LatestReviewsList from "@/components/application/admin/latest-reviews-list";
import MonthlySalesChart from "@/components/application/admin/monthly-sales-chart";
import OrderStatusChart from "@/components/application/admin/order-status-chart";
import QuickActions from "@/components/application/admin/quick-actions";

// Trang tổng quan admin
export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <CountOverview />
      <QuickActions />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MonthlySalesChart />
        <OrderStatusChart />
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <LatestOrdersTable />
        </div>
        <div className="xl:col-span-2">
          <LatestReviewsList />
        </div>
      </div>
    </div>
  );
}
