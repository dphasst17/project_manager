import LayoutNavbar from "@/components/ui/layout-navbar";
const Layout = ({ children }: any) => {
  return <LayoutNavbar>
    <div className="w-full min-h-[90vh]">{children}</div>
  </LayoutNavbar>;
};
export default Layout;
