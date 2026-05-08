import { SidebarInset, SidebarProvider } from "@peja/ui/components/Sidebar";
import type { Subscription, User } from "@/lib/api/types";
import { AppSideBar } from "./AppSidebar";
import { AppHeaderDesktop } from "./AppHeaderDesktop";
import { AppHeaderMobile } from "./AppHeaderMobile";

type AppLayoutProps = {
  user: User;
  subscription: Subscription | null;
  children: React.ReactNode;
};

export const AppLayout = ({ user, subscription, children }: AppLayoutProps) => {
  return (
    <SidebarProvider>
      <AppSideBar user={user} />
      <div className="flex w-full flex-1 flex-col overflow-hidden pb-6">
        <AppHeaderDesktop subscription={subscription} />
        <AppHeaderMobile />
        <SidebarInset>{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
};
