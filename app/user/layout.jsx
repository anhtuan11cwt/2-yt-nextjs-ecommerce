// Layout User Panel — bọc tất cả trang con bằng UserPanelLayout
import UserPanelLayout from "../user-panel-layout";

export default function UserLayout({ children }) {
  return <UserPanelLayout>{children}</UserPanelLayout>;
}
