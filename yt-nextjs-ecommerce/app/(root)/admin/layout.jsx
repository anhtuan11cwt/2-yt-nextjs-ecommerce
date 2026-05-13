import AppSidebar from "@/components/application/admin/AppSidebar";
import ThemeProvider from "@/components/application/admin/ThemeProvider";
import Topbar from "@/components/application/admin/Topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const AdminLayout = ({ children }) => {
	return (
		<ThemeProvider>
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset>
					<Topbar />
					<main className="p-4 md:p-6">{children}</main>
				</SidebarInset>
			</SidebarProvider>
		</ThemeProvider>
	);
};

export default AdminLayout;
