import AppSidebar from "@/components/application/admin/AppSidebar";
import ThemeProvider from "@/components/application/admin/ThemeProvider";
import Topbar from "@/components/application/admin/Topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const AdminLayout = ({ children }) => {
	return (
		<ThemeProvider>
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset className="min-w-0">
					<Topbar />
					<main className="min-w-0 flex-1 overflow-x-auto p-4 md:p-6">
						{children}
					</main>
				</SidebarInset>
			</SidebarProvider>
		</ThemeProvider>
	);
};

export default AdminLayout;
