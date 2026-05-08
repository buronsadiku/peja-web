"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth/client";

const links = [
  { href: "/admin/activities", label: "Activities" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/registrations", label: "Registrations" },
];

export const Sidebar = ({ adminEmail }: { adminEmail: string }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border p-6 flex flex-col">
      <Link href="/admin/activities" className="mb-10">
        <h1 className="text-2xl font-black text-primary">PEJA.FEST</h1>
        <p className="text-xs text-muted-foreground mt-1">Admin</p>
      </Link>

      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-3 rounded-xl transition-colors ${
                active
                  ? "bg-primary/20 text-primary border-l-4 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-background"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border pt-4 mt-4">
        <p className="text-xs text-muted-foreground mb-2 truncate">
          {adminEmail}
        </p>
        <button
          onClick={handleSignOut}
          className="w-full text-sm text-destructive hover:underline text-left"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
};
