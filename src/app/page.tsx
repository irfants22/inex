import Navbar from "@/components/common/navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-200 text-slate-800 antialiased">
      <Navbar />
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-between gap-16 px-6 py-12 lg:flex-row lg:py-24">
        <div className="flex max-w-xl flex-1 flex-col text-left">
          <div className="mb-6 inline-flex items-center gap-1.5 self-start rounded-md border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-800">
            <Sparkles className="size-3.5 fill-emerald-600 text-emerald-600" />
            <span>Practical Financial Recording</span>
          </div>
          <h1 className="text-4xl leading-tight font-bold tracking-tight text-slate-900 sm:text-5xl">
            Manage Finances More Simply with{" "}
            <span className="text-emerald-500">INEX</span>
          </h1>
          <p className="text-muted-foreground mt-6 text-base leading-relaxed sm:text-lg">
            INEX helps you track daily income and expenses efficiently. Get a
            clear overview of your financial condition in real-time without the
            hassle.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href="/login" passHref className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full cursor-pointer rounded-lg bg-emerald-500 px-6 py-6 text-base font-semibold text-white transition-colors hover:bg-emerald-600 sm:w-auto"
              >
                Start Now
                <ArrowRight className="ml-1 size-5" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex w-full max-w-md flex-1 items-center justify-center lg:max-w-none">
          <div className="flex w-full max-w-md flex-col gap-6 rounded-2xl border border-slate-300/80 bg-white p-6 shadow-xs">
            <div>
              <p className="text-muted-foreground text-xs">Total Balance</p>
              <h3 className="mt-1 text-3xl font-bold tracking-tight">
                Rp 12.500.000
              </h3>
            </div>

            <div className="relative h-24 w-full border-b border-slate-100 pb-2">
              <svg
                className="h-full w-full"
                viewBox="0 0 100 30"
                preserveAspectRatio="none"
              >
                <line
                  x1="0"
                  y1="10"
                  x2="100"
                  y2="10"
                  stroke="#f1f5f9"
                  strokeWidth="0.5"
                />
                <line
                  x1="0"
                  y1="20"
                  x2="100"
                  y2="20"
                  stroke="#f1f5f9"
                  strokeWidth="0.5"
                />
                <path
                  d="M 0,25 Q 20,28 40,15 T 80,18 T 100,5"
                  fill="none"
                  stroke="oklch(69.6% 0.17 162.48)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="5" r="2" fill="oklch(69.6% 0.17 162.48)" />
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-6 border-b border-slate-100 pb-4">
              <div>
                <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Income
                </span>
                <p className="mt-1 flex items-center gap-1 text-sm font-bold">
                  Rp 17.200.000
                  <ArrowUpRight className="size-3.5 text-emerald-600" />
                </p>
              </div>
              <div>
                <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  Expense
                </span>
                <p className="mt-1 flex items-center gap-1 text-sm font-bold">
                  Rp 4.700.000
                  <ArrowDownRight className="size-3.5 text-red-500" />
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-xs font-medium text-slate-400">
                Transaction Summary
              </span>

              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between py-1 text-xs">
                  <div className="flex flex-col">
                    <span className="font-semibold">Monthly Salary</span>
                    <span className="text-[10px] text-slate-400">Job</span>
                  </div>
                  <span className="font-bold text-emerald-600">
                    +Rp 15.000.000
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-50 py-1 text-xs">
                  <div className="flex flex-col">
                    <span className="font-semibold">Monthly Shopping</span>
                    <span className="text-[10px] text-slate-400">Needs</span>
                  </div>
                  <span className="font-bold text-red-500">-Rp 1.700.000</span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-50 py-1 text-xs">
                  <div className="flex flex-col">
                    <span className="font-semibold">Lunch & Coffee</span>
                    <span className="text-[10px] text-slate-400">Culinary</span>
                  </div>
                  <span className="font-bold text-red-500">-Rp 170.000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
