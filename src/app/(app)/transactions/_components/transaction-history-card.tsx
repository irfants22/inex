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

interface TransactionHistoryCardProps {
  date: string;
  transactions: TransactionData[];
}

export default function TransactionHistoryCard({
  data,
}: {
  data: TransactionHistoryCardProps[];
}) {
  return (
    <div className="w-full space-y-4 rounded-lg bg-transparent">
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
                    className="item-center flex w-full justify-center gap-2 rounded-sm bg-white p-3"
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
                          <p className="text-xs capitalize">
                            {trx.categoryType}
                          </p>{" "}
                          ·{" "}
                          <p className="max-w-40 truncate text-xs">
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
    </div>
  );
}
