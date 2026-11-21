import SidebarLogo from "./SidebarLogo";
import SidebarNav from "./SidebarNav";
import SidebarUser from "./SidebarUser";

const Sidebar = () => {
  return (
    <aside className="fixed inset-y-0 z-30 flex w-60 flex-col bg-background px-4 pt-6 pb-5 max-lg:hidden">
      <SidebarLogo className="px-1" />
      <div className="mt-8 flex-1 overflow-y-auto">
        <SidebarNav />
      </div>
      <SidebarUser />
    </aside>
  );
};

export default Sidebar;
