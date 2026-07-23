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
import { ChevronDownIcon, Edit, Trash } from "lucide-react";
import { useState } from "react";
import DialogUpdateTransaction from "./dialog-update-transaction";
import { useSearchParams } from "next/navigation";
import { MONTH_SELECT_ITEMS } from "@/constants/transaction";
import DialogDeleteTransaction from "./dialog-delete-transaction";
import { Separator } from "@/components/ui/separator";

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
  const [openDialogUpdate, setOpenDialogUpdate] = useState(false);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
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
            <div className="grid w-full grid-cols-[repeat(1,minmax(240px,1fr))] gap-2 sm:grid-cols-[repeat(2,minmax(240px,1fr))] md:grid-cols-[repeat(3,minmax(240px,1fr))]">
              {group?.transactions.map((trx) => {
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
                          "flex aspect-square w-12 items-center justify-center rounded-md",
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

                    <div className="flex min-w-0 flex-1 flex-col items-start justify-between">
                      <p className="w-full truncate text-sm font-medium">
                        {trx.categoryName}
                      </p>
                      <div className="flex w-full items-center gap-1">
                        <p className="text-muted-foreground text-xs capitalize">
                          {trx.categoryType}
                        </p>
                        <Separator orientation="vertical" />
                        <p className="text-muted-foreground truncate text-xs">
                          {trx.note || "Other"}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-end justify-between">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          trx.categoryType === "income"
                            ? "text-green-500"
                            : "text-red-500",
                        )}
                      >
                        {trx.categoryType === "income" ? "+" : "-"}Rp.{" "}
                        {Number(trx.amount).toLocaleString("id-ID")}
                      </p>
                      <div className="flex items-center gap-x-2">
                        <Edit
                          className="text-muted-foreground size-4 cursor-pointer transition hover:text-black"
                          onClick={() => {
                            setSelectedTransaction(trx);
                            setOpenDialogUpdate(true);
                          }}
                        />
                        <Trash
                          className="text-muted-foreground size-4 cursor-pointer transition hover:text-red-500"
                          onClick={() => {
                            setSelectedTransaction(trx);
                            setOpenDialogDelete(true);
                          }}
                        />
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
        open={openDialogUpdate}
        setOpen={setOpenDialogUpdate}
        currentData={selectedTransaction}
      />
      <DialogDeleteTransaction
        open={openDialogDelete}
        setOpen={setOpenDialogDelete}
        currentData={selectedTransaction}
      />
    </div>
  );
}
