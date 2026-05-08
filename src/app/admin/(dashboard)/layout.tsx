import { requireAdmin } from "@/lib/auth/server";
import { Sidebar } from "@/features/admin/Sidebar";
import { Providers } from "@/features/layout/Providers";

const DashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await requireAdmin();

  return (
    <Providers>
      <div className="flex">
        <Sidebar adminEmail={session.user.email} />
        <main className="flex-1 p-10 max-h-screen overflow-y-auto">
          {children}
        </main>
      </div>
    </Providers>
  );
};

export default DashboardLayout;
