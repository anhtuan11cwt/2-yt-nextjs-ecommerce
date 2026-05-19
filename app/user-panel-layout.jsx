// Layout chung cho User Panel (Dashboard, Profile, Orders)
import UserPanelNavigation from "./user-panel-navigation";

export default function UserPanelLayout({ children }) {
  return (
    <div className="flex lg:flex-nowrap flex-wrap gap-10 lg:px-32 px-5 my-20">
      {/* Sidebar điều hướng */}
      <div className="lg:w-64 w-full lg:mb-0 mb-5">
        <UserPanelNavigation />
      </div>

      {/* Vùng nội dung */}
      <div className="lg:w-[calc(100%-16rem)] w-full">{children}</div>
    </div>
  );
}
