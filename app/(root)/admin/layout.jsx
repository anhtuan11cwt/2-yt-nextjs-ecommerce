import AppSidebar from "@/components/application/admin/AppSidebar";
import ThemeProvider from "@/components/application/admin/ThemeProvider";
import Topbar from "@/components/application/admin/Topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

// Layout admin với sidebar, topbar và theme provider
const AdminLayout = ({ children }) => {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="min-w-0">
          <Topbar />
          <main className="min-w-0 flex-1 overflow-x-auto p-3 sm:p-5 lg:p-8">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default AdminLayout;
