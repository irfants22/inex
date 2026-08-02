import { getCategories } from "@/app/actions/category-actions";
import { updateRecurringTransaction } from "@/app/actions/recurring-transaction-actions";
import { CategoryIcon } from "@/components/common/category-icon";
import FormDate from "@/components/common/form-date";
import FormInput from "@/components/common/form-input";
import FormSelect from "@/components/common/form-select";
import FormSwitch from "@/components/common/form-switch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FREQUENCY_SELECT_ITEMS } from "@/constants/recurring-transaction";
import {
  RecurringTransactionData,
  RecurringTransactionFormState,
} from "@/types/recurring-transaction";
import {
  RecurringTransactionFormInput,
  recurringTransactionFormSchema,
} from "@/validations/recurring-transaction-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const initialStateRecurringTransaction: RecurringTransactionFormState = {};

export default function DialogUpdateRecurringTransaction({
  open,
  setOpen,
  currentData,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  currentData: RecurringTransactionData | null;
}) {
  const { handleSubmit, control, reset, setValue } =
    useForm<RecurringTransactionFormInput>({
      resolver: zodResolver(recurringTransactionFormSchema),
    });

  const [
    updateRecurringTransactionState,
    updateRecurringTransactionAction,
    isPendingUpdateRecurringTransaction,
  ] = useActionState(
    updateRecurringTransaction,
    initialStateRecurringTransaction,
  );

  const onSubmit = handleSubmit((data) => {
    if (!currentData) return;

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    formData.append("id", currentData?.id);

    startTransition(() => updateRecurringTransactionAction(formData));
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
    refetchOnMount: true,
  });

  useEffect(() => {
    if (currentData) {
      setValue("amount", Number(currentData.amount).toString());
      setValue("categoryId", currentData.categoryId);
      setValue("note", currentData.note ?? "");
      setValue(
        "frequency",
        currentData.frequency as "daily" | "weekly" | "monthly" | "yearly",
      );
      setValue("nextRun", currentData.nextRun);
      setValue("endDate", currentData.endDate ?? "");
      setValue("isActive", currentData.isActive);
    }
  }, [currentData, setValue]);

  useEffect(() => {
    if (updateRecurringTransactionState.status === "success") {
      toast.success("Successfully update recurring transaction");
      setOpen(false);
    }
    if (updateRecurringTransactionState?.status === "error") {
      toast.error("Failed to update recurring transaction", {
        description: updateRecurringTransactionState.errors?._form?.[0],
        descriptionClassName: "!text-black",
      });
    }
  }, [updateRecurringTransactionState, reset, setOpen]);

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-emerald-500">
            Update Recurring
          </DialogTitle>
          <DialogDescription className="text-sm font-normal">
            Update your recurring transaction schedule
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="max-h-[50vh] space-y-4 overflow-y-auto p-1">
            <FormInput
              control={control}
              label="Amount"
              name="amount"
              type="number"
              placeholder="Enter Amount"
            />
            <FormSelect
              control={control}
              label="Category"
              name="categoryId"
              selectItem={(categoriesData ?? []).map((category) => ({
                value: `${category.id}`,
                label: `${category.name} - ${category.type}`,
                renderItem: (
                  <CategoryIcon name={category.icon} className="mr-0.5" />
                ),
              }))}
            />
            <FormSelect
              control={control}
              label="Frequency"
              name="frequency"
              selectItem={(FREQUENCY_SELECT_ITEMS ?? []).map((frequency) => ({
                value: `${frequency.value}`,
                label: `${frequency.label}`,
              }))}
            />
            <FormDate control={control} name="nextRun" label="Next Run" />
            <FormDate control={control} name="endDate" label="End Date" />
            <FormInput
              control={control}
              label="Note"
              name="note"
              type="textarea"
              placeholder="Enter your notes here"
            />
            <FormSwitch control={control} name="isActive" label="Is Active" />
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600/80"
              disabled={isPendingUpdateRecurringTransaction}
            >
              {isPendingUpdateRecurringTransaction ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
