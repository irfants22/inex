"use client";

import FormInput from "@/components/common/form-input";
import FormSelect from "@/components/common/form-select";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { CategoryIcon } from "@/components/common/category-icon";
import {
  RecurringTransactionFormInput,
  recurringTransactionFormSchema,
} from "@/validations/recurring-transaction-validation";
import {
  FREQUENCY_SELECT_ITEMS,
  INITIAL_RECURRING_TRANSACTION_FORM,
} from "@/constants/recurring-transaction";
import { RecurringTransactionFormState } from "@/types/recurring-transaction";
import { createRecurringTransaction } from "@/app/actions/recurring-transaction-actions";
import FormDate from "@/components/common/form-date";
import { getCategories } from "@/app/actions/category-actions";
import FormSwitch from "@/components/common/form-switch";

const initialStateRecurringTransaction: RecurringTransactionFormState = {};

export default function DialogCreateRecurringTransaction({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { handleSubmit, control, reset } =
    useForm<RecurringTransactionFormInput>({
      resolver: zodResolver(recurringTransactionFormSchema),
      defaultValues: INITIAL_RECURRING_TRANSACTION_FORM,
    });

  const [
    createRecurringTransactionState,
    recurringTransactionCreateAction,
    isPendingCreateRecurringTransaction,
  ] = useActionState(
    createRecurringTransaction,
    initialStateRecurringTransaction,
  );

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    startTransition(() => recurringTransactionCreateAction(formData));
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
    refetchOnMount: true,
  });

  useEffect(() => {
    if (createRecurringTransactionState.status === "success") {
      toast.success("Successfully added recurring transaction");
      setOpen(false);
    }
    if (createRecurringTransactionState?.status === "error") {
      toast.error("Failed to add recurring transaction", {
        description: createRecurringTransactionState.errors?._form?.[0],
        descriptionClassName: "!text-black",
      });
    }
  }, [createRecurringTransactionState, reset, setOpen]);

  useEffect(() => {
    if (open === false) {
      reset();
    }
  }, [open, reset]);

  return (
    <DialogContent className="max-h-[90vh] sm:max-w-sm">
      <DialogHeader>
        <DialogTitle className="text-xl font-medium text-emerald-500">
          Add Recurring
        </DialogTitle>
        <DialogDescription className="text-sm font-normal">
          create your recurring transaction schedule
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
            disabled={isPendingCreateRecurringTransaction}
          >
            {isPendingCreateRecurringTransaction ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Add"
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
