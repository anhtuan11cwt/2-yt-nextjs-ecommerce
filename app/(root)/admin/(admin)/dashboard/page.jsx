import CountOverview from "@/components/application/admin/count-overview";
import QuickActions from "@/components/application/admin/quick-actions";

export default function AdminDashboardPage() {
	return (
		<div className="p-6 space-y-6">
			<CountOverview />
			<QuickActions />
		</div>
	);
}
