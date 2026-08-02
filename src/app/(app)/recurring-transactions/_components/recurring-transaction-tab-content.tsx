import { CategoryIcon } from "@/components/common/category-icon";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { CATEGORY_ICON_STYLES } from "@/constants/icon";
import { cn } from "@/lib/utils";
import { RecurringTransactionData } from "@/types/recurring-transaction";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";
import DialogUpdateRecurringTransaction from "./dialog-update-recurring-transaction";

type RecurringTransactionTabContentProps = {
  status: "active" | "inactive";
  recurrings: RecurringTransactionData[];
};

export default function RecurringTransactionTabContent({
  data,
}: {
  data: RecurringTransactionTabContentProps[];
}) {
  const [openDialogUpdate, setOpenDialogUpdate] = useState(false);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [selectedRecurringTransaction, setSelectedRecurringTransaction] =
    useState<RecurringTransactionData | null>(null);
  return (
    <div className="flex w-full flex-col justify-center gap-y-4 p-1">
      {data.map((group) => (
        <div
          key={group.status}
          className="flex w-full flex-col justify-center gap-2"
        >
          <p className="text-muted-foreground tracking-wide capitalize">
            {group.status} · {group.recurrings.length} Recurrings
          </p>
          <div className="grid w-full grid-cols-[repeat(1,minmax(200px,1fr))] gap-2 sm:grid-cols-[repeat(2,minmax(200px,1fr))]">
            {group?.recurrings.map((recurring) => {
              const iconStyle =
                CATEGORY_ICON_STYLES[
                  recurring.categoryColor as keyof typeof CATEGORY_ICON_STYLES
                ] ?? CATEGORY_ICON_STYLES.neutral;

              return (
                <div
                  key={recurring.id}
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
                        name={recurring.categoryIcon}
                        className={iconStyle.text}
                      />
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col items-start justify-between gap-y-1">
                    <div className="flex w-full flex-wrap items-center gap-1">
                      <p className="truncate text-sm font-medium">
                        {recurring.categoryName}
                      </p>
                      <p
                        className={cn(
                          "rounded-md px-2 py-0.5 text-[10px] text-white capitalize",
                          recurring.isActive ? "bg-green-500" : "bg-red-500",
                        )}
                      >
                        {recurring.isActive ? "active" : "inactive"}
                      </p>
                    </div>
                    <div className="flex w-full items-center gap-1">
                      <p className="text-muted-foreground text-xs capitalize">
                        Next run · {recurring.nextRun}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end justify-between">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        recurring.categoryType === "income"
                          ? "text-green-500"
                          : "text-red-500",
                      )}
                    >
                      {recurring.categoryType === "income" ? "+" : "-"}Rp.{" "}
                      {Number(recurring.amount).toLocaleString("id-ID")}
                    </p>
                    <div className="flex items-center gap-x-2">
                      <Switch
                        defaultChecked={recurring.isActive}
                        checked={recurring.isActive}
                        onCheckedChange={(value) => {
                          console.log(value);
                        }}
                        id="status-recurring-toggle"
                        className="data-checked:bg-emerald-500"
                      />
                      <Separator orientation="vertical" />
                      <Edit
                        className="text-muted-foreground size-4 cursor-pointer transition hover:text-black"
                        onClick={() => {
                          setOpenDialogUpdate(true);
                          setSelectedRecurringTransaction(recurring);
                        }}
                      />
                      <Trash
                        className="text-muted-foreground size-4 cursor-pointer transition hover:text-red-500"
                        onClick={() => {
                          setOpenDialogDelete(true);
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <DialogUpdateRecurringTransaction
        open={openDialogUpdate}
        setOpen={setOpenDialogUpdate}
        currentData={selectedRecurringTransaction}
      />
    </div>
  );
}
