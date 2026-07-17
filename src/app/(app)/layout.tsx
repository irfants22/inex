import AppSidebar from "@/components/common/app-sidebar";
import FloatingActionButton from "@/components/common/floating-action-button";
import Navbar from "@/components/common/navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-200">
          <Navbar showSidebarTrigger />
          <main className="w-full flex-1">{children}</main>
          <FloatingActionButton />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
