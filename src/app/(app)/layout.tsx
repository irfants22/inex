import BottomNavigation from "@/components/common/bottom-navigation";
import Navbar from "@/components/common/navbar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-200">
      <Navbar />
      <main className="w-full flex-1">{children}</main>
      <BottomNavigation />
    </div>
  );
}
