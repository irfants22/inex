import { getBudgetLimit } from "@/app/actions/budget-actions";
import { getDashboardSummary } from "@/app/actions/transaction-actions";
import { formatToIDR } from "@/lib/utils";
import {
  ArrowDownRight,
  ArrowUpRight,
  TriangleAlert,
  Wallet,
} from "lucide-react";
import Link from "next/link";

export default async function BalanceSummary() {
  const budget = await getBudgetLimit();
  const summary = await getDashboardSummary();
  const isOverLimit = summary.monthExpense > Number(budget.monthlyLimit);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-2">
      <div className="flex w-full flex-wrap items-center gap-2">
        <div className="gap-.5 flex flex-1 flex-col rounded-md bg-white p-2">
          <div className="flex flex-col justify-center gap-1 p-2">
            <div className="flex items-center gap-1">
              <div className="text-muted-foreground h-fit w-fit rounded-full bg-black/20 p-1">
                <Wallet size={12} />
              </div>
              <p className="text-muted-foreground text-xs font-normal">
                Total Balance
              </p>
            </div>
            <p className="text-3xl font-semibold text-emerald-500">
              {formatToIDR(summary.totalBalance)}
            </p>
          </div>
        </div>

        <div className="gap-.5 flex flex-1 flex-col rounded-md bg-sky-500 p-2">
          <div className="flex flex-col justify-center gap-1 p-2">
            <div className="flex items-center gap-1">
              <div className="h-fit w-fit rounded-full bg-black/20 p-1 text-white">
                <ArrowUpRight size={12} />
              </div>
              <p className="text-xs font-normal text-white">
                This Month Income
              </p>
            </div>
            <p className="text-3xl font-semibold text-white">
              {formatToIDR(summary.monthIncome)}
            </p>
          </div>
        </div>

        <div className="gap-.5 flex flex-1 flex-col rounded-md bg-rose-500 p-2">
          <div className="flex flex-col justify-center gap-1 p-2">
            <div className="flex items-center gap-1">
              <div className="h-fit w-fit rounded-full bg-black/20 p-1 text-white">
                <ArrowDownRight size={12} />
              </div>
              <p className="text-xs font-normal text-white">
                This Month Expense
              </p>
            </div>
            <p className="text-3xl font-semibold text-white">
              {formatToIDR(summary.monthExpense)}
            </p>
          </div>
        </div>
      </div>

      {isOverLimit && (
        <Link
          href={"/budget"}
          className="mt-3 flex w-full items-start gap-2 rounded-md bg-red-300/80 p-3"
        >
          <TriangleAlert size={18} className="text-red-500" />
          <p className="text-sm font-medium text-red-500">
            You have exceeded your monthly spending limit.
          </p>
        </Link>
      )}
    </div>
  );
}
