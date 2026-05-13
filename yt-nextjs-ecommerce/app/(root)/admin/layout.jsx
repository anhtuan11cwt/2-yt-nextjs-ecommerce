import AppSidebar from "@/components/application/admin/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const AdminLayout = ({ children }) => {
	return (
		<SidebarProvider>
			<AppSidebar />
			<main className="flex-1">{children}</main>
		</SidebarProvider>
	);
};

export default AdminLayout;
