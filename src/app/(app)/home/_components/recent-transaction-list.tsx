"use client";

import { CategoryIcon } from "@/components/common/category-icon";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CATEGORY_ICON_STYLES } from "@/constants/icon";
import { cn, formatToIDR } from "@/lib/utils";
import { TransactionData } from "@/types/transaction";
import Link from "next/link";

export default function RecentTransactionList({
  recentTransactions,
}: {
  recentTransactions: Omit<TransactionData, "note" | "categoryId">[];
}) {
  return (
    <div className="w-full rounded-md bg-slate-100/60 p-4">
      <div className="flex items-center justify-between">
        <Label>Recent Transactions</Label>
        <Link
          href={"/transactions"}
          className="mr-1 text-xs font-medium text-blue-500"
        >
          See All
        </Link>
      </div>
      <ScrollArea className="mt-4 h-72 w-full pr-4">
        <div className="mb-2 flex flex-col gap-1.5 py-1">
          {recentTransactions.map((trx) => {
            const iconStyle =
              CATEGORY_ICON_STYLES[
                trx.categoryColor as keyof typeof CATEGORY_ICON_STYLES
              ] ?? CATEGORY_ICON_STYLES.neutral;

            return (
              <div
                key={trx.id}
                className="item-center flex w-full gap-3 rounded-md bg-white p-3 transition-all"
              >
                <div className="flex shrink-0 items-center justify-center">
                  <div
                    className={cn(
                      "flex aspect-square w-10 items-center justify-center rounded-md",
                      iconStyle.bg,
                      iconStyle.text,
                    )}
                  >
                    <CategoryIcon
                      name={trx.categoryIcon}
                      className={iconStyle.text}
                      size={16}
                    />
                  </div>
                </div>

                <div className="flex min-w-0 flex-1 flex-col items-start justify-between">
                  <p className="w-full truncate text-sm font-medium">
                    {trx.categoryName}
                  </p>
                  <div className="flex w-full items-center gap-1">
                    <p className="text-muted-foreground text-xs capitalize">
                      {trx.categoryType}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col justify-center">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      trx.categoryType === "income"
                        ? "text-green-500"
                        : "text-red-500",
                    )}
                  >
                    {`${trx.categoryType === "income" ? "+" : "-"}${formatToIDR(Number(trx.amount))}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        {recentTransactions.length < 4 && (
          <p className="text-muted-foreground text-center text-xs tracking-wide">
            No more transactions this month
          </p>
        )}
      </ScrollArea>
    </div>
  );
}
