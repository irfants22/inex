"use client";

import { CategoryIcon } from "@/components/common/category-icon";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CATEGORY_ICON_STYLES } from "@/constants/icon";
import { cn } from "@/lib/utils";
import { TransactionData } from "@/types/transaction";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import DialogUpdateTransaction from "./dialog-update-transaction";
import { useSearchParams } from "next/navigation";
import { MONTH_SELECT_ITEMS } from "@/constants/transaction";

interface TransactionHistoryCardProps {
  date: string;
  transactions: TransactionData[];
}

export default function TransactionHistoryCard({
  data,
}: {
  data: TransactionHistoryCardProps[];
}) {
  const params = useSearchParams();
  const [open, setOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionData | null>(null);

  const now = new Date();
  const year = params.get("year") || now.getFullYear();
  const month = Number(params.get("month")) || now.getMonth() + 1;
  const monthName = MONTH_SELECT_ITEMS.find(
    (m) => m.value === String(month),
  )?.label;

  return (
    <div className="w-full space-y-4 rounded-lg bg-transparent">
      <div>
        <p className="ml-1 text-lg font-medium">{`Transaction Summary for ${monthName} ${year}`}</p>
      </div>
      {data.map((group) => (
        <Collapsible
          key={group.date}
          defaultOpen
          className="rounded-md bg-slate-200 p-1 shadow-sm"
        >
          <CollapsibleTrigger
            render={
              <Button
                variant="ghost"
                className="w-full bg-transparent hover:bg-transparent data-panel-open:bg-transparent"
              >
                <p className="font-medium">{group.date}</p>
                <ChevronDownIcon className="ml-auto group-data-panel-open/button:rotate-180" />
              </Button>
            }
          />
          <CollapsibleContent className="flex flex-col items-center justify-center p-2.5 pt-0 text-sm">
            <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
              {group?.transactions.map((trx) => {
                const iconStyle =
                  CATEGORY_ICON_STYLES[
                    trx.categoryColor as keyof typeof CATEGORY_ICON_STYLES
                  ] ?? CATEGORY_ICON_STYLES.neutral;

                return (
                  <div
                    key={trx.id}
                    className="item-center hover:bg-muted flex w-full cursor-pointer justify-center gap-2 rounded-sm bg-white p-3 transition hover:translate-y-0.5"
                    onClick={() => {
                      setSelectedTransaction(trx);
                      setOpen(true);
                    }}
                  >
                    <div className="flex items-center justify-center">
                      <div
                        className={cn(
                          "flex aspect-square w-10 items-center justify-center rounded-sm",
                          iconStyle.bg,
                          iconStyle.text,
                        )}
                      >
                        <CategoryIcon
                          name={trx.categoryIcon}
                          className={iconStyle.text}
                        />
                      </div>
                    </div>
                    <div className="flex flex-1 items-center justify-between">
                      <div className="flex flex-col justify-between">
                        <p className="font-medium">{trx.categoryName}</p>
                        <div className="flex items-center justify-center gap-1">
                          <p className="text-muted-foreground text-xs capitalize">
                            {trx.categoryType}
                          </p>{" "}
                          ·{" "}
                          <p className="text-muted-foreground max-w-40 truncate text-xs">
                            {trx.note || "Other"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-end">
                        <p
                          className={cn(
                            "font-medium",
                            trx.categoryType === "income"
                              ? "text-green-500"
                              : "text-red-500",
                          )}
                        >
                          {trx.categoryType === "income" ? "+" : "-"}Rp.{" "}
                          {Number(trx.amount).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
      <DialogUpdateTransaction
        open={open}
        setOpen={setOpen}
        currentData={selectedTransaction}
      />
    </div>
  );
}
