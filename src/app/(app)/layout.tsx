import Navbar from "@/components/common/navbar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-200">
      <Navbar />
      <div className="w-full flex-1">{children}</div>
      <div className="sticky bottom-5 h-12 w-full bg-emerald-500/50 text-center"></div>
    </div>
  );
}
