"use client";

import { Progress } from "@/components/ui/progress";
import { TransactionData } from "@/types/transaction";
import { TriangleAlert } from "lucide-react";
import { useMemo } from "react";

export default function BudgetTrackerCard({
  monthlyLimit,
  transactions,
}: {
  monthlyLimit: number;
  transactions: TransactionData[] | null;
}) {
  const monthlyExpense = useMemo(() => {
    return (transactions ?? []).reduce(
      (acc, trx) => acc + Number(trx.amount),
      0,
    );
  }, [transactions]);

  const progress = useMemo(() => {
    if (monthlyLimit <= 0) return 0;

    const expense = monthlyExpense ?? 0;
    return Math.min((expense / monthlyLimit) * 100, 100);
  }, [monthlyExpense, monthlyLimit]);

  const currentMonth = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date());

  const isOverLimit = monthlyExpense > monthlyLimit;

  return (
    <div className="w-full px-4 py-2">
      <div className="flex w-full flex-col gap-2 rounded-md bg-slate-100/60 p-4">
        <div className="mb-2 flex w-full items-center justify-between">
          <p className="text-muted-foreground text-sm font-medium">
            Spent this month
          </p>
          <p className="text-muted-foreground text-sm font-medium">
            {currentMonth}
          </p>
        </div>
        <p className="text-4xl font-semibold tracking-wide text-emerald-500">{`Rp ${monthlyExpense.toLocaleString("id-ID")}`}</p>
        {isOverLimit && (
          <p className="text-sm font-medium text-red-500">{`Rp ${(monthlyExpense - monthlyLimit).toLocaleString("id-ID")} over your Rp ${monthlyLimit.toLocaleString("id-ID")} limit`}</p>
        )}
        <div className="mt-4 flex w-full flex-col gap-1.5">
          <Progress
            value={progress}
            className="w-full"
            indicatorClassName={isOverLimit ? "bg-red-500" : "bg-emerald-500"}
            trackClassName="h-3"
          />
          <div className="mt-1 flex w-full items-center justify-end">
            <p className="text-muted-foreground text-xs font-medium">{`Limit: Rp ${monthlyLimit.toLocaleString("id-ID")}`}</p>
          </div>
        </div>
      </div>

      {isOverLimit && (
        <div className="mt-3 flex w-full items-start gap-2 rounded-md bg-red-300/80 p-3">
          <TriangleAlert size={18} className="text-red-500" />
          <p className="text-sm font-medium text-red-500">
            You have exceeded your monthly spending limit.
          </p>
        </div>
      )}
    </div>
  );
}
