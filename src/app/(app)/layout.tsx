export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full min-h-svh bg-slate-200 justify-center items-center">
      <div className="w-full max-w-sm flex flex-col">{children}</div>
    </div>
  );
}
