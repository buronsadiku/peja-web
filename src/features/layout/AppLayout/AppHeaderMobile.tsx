import { Logo } from "@peja/ui/components/Logo";
import { SidebarTrigger } from "@peja/ui/components/Sidebar";

export const AppHeaderMobile = () => {
  return (
    <header className="border-border bg-card desktop:hidden flex items-center justify-between border-b px-4 py-3">
      <Logo />
      <SidebarTrigger />
    </header>
  );
};
