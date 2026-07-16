import Navbar from "@/components/common/navbar";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center bg-slate-200">
      <Navbar />
      <div className="flex w-full max-w-sm flex-1 flex-col justify-center">
        {children}
      </div>
    </div>
  );
}
