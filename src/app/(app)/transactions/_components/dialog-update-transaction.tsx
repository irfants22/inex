import { getCategories } from "@/app/actions/category-actions";
import { updateTransaction } from "@/app/actions/transaction-actions";
import { CategoryIcon } from "@/components/common/category-icon";
import FormDate from "@/components/common/form-date";
import FormInput from "@/components/common/form-input";
import FormSelect from "@/components/common/form-select";
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
import { TransactionData, TransactionFormState } from "@/types/transaction";

import {
  TransactionFormInput,
  transactionFormSchema,
} from "@/validations/transaction-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const initialStateTransaction: TransactionFormState = {};

export default function DialogUpdateTransaction({
  open,
  setOpen,
  currentData,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  currentData: TransactionData | null;
}) {
  const { handleSubmit, control, reset, setValue } =
    useForm<TransactionFormInput>({
      resolver: zodResolver(transactionFormSchema),
    });

  const [
    updateTransactionState,
    updateTransactionAction,
    isPendingUpdateTransaction,
  ] = useActionState(updateTransaction, initialStateTransaction);

  const onSubmit = handleSubmit((data) => {
    if (!currentData) return;

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    formData.append("id", currentData?.id);

    startTransition(() => updateTransactionAction(formData));
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
      setValue("transactionDate", currentData.transactionDate);
    }
  }, [currentData, setValue]);

  useEffect(() => {
    if (updateTransactionState.status === "success") {
      toast.success("Successfully update transaction");
      reset();
      setOpen(false);
    }
    if (updateTransactionState?.status === "error") {
      toast.error("Failed to update transaction", {
        description: updateTransactionState.errors?._form?.[0],
        descriptionClassName: "!text-black",
      });
    }
  }, [updateTransactionState, reset, setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-emerald-500">
            Update Transaction
          </DialogTitle>
          <DialogDescription className="text-sm font-normal">
            Update your transaction history
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
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
          <FormDate control={control} name="transactionDate" label="Date" />
          <FormInput
            control={control}
            label="Note"
            name="note"
            type="textarea"
            placeholder="Enter your notes here"
          />
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600"
              disabled={isPendingUpdateTransaction}
            >
              {isPendingUpdateTransaction ? (
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
