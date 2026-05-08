import {
  SidebarInset,
  SidebarProvider,
} from "@peja/ui/components/Sidebar";
import { SettingsSidebar } from "./SettingsSidebar";

type SettingsLayoutProps = {
  children: React.ReactNode;
};

export const SettingsLayout = ({ children }: SettingsLayoutProps) => (
  <SidebarProvider>
    <SettingsSidebar />
    <SidebarInset>
      <div className="tablet:px-10 tablet:py-11 mx-auto w-full max-w-4xl px-6 py-8">
        {children}
      </div>
    </SidebarInset>
  </SidebarProvider>
);
