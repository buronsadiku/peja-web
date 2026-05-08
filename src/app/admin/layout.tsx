import "../globals.css";
import { Rubik } from "next/font/google";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
  display: "optional",
});

const AdminRootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className={`${rubik.variable} antialiased`}>
      <body className="font-sans bg-background text-foreground min-h-screen">
        {children}
      </body>
    </html>
  );
};

export default AdminRootLayout;
