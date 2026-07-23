"use client";

import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  transactionFormSchema,
  TransactionFormInput,
} from "@/validations/transaction-validation";
import FormInput from "./form-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { INITIAL_TRANSACTION_FORM } from "@/constants/transaction";
import FormSelect from "./form-select";
import FormDate from "./form-date";
import { useQuery } from "@tanstack/react-query";

import { getCategories } from "@/app/actions/category-actions";
import { startTransition, useActionState, useEffect } from "react";
import { createTransaction } from "@/app/actions/transaction-actions";
import { TransactionFormState } from "@/types/transaction";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CategoryIcon } from "./category-icon";

const initialStateTransaction: TransactionFormState = {};

export default function DialogCreateTransaction({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const { handleSubmit, control, reset } = useForm<TransactionFormInput>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: INITIAL_TRANSACTION_FORM,
  });

  const [
    createTransactionState,
    createTransactionAction,
    isPendingCreateTransaction,
  ] = useActionState(createTransaction, initialStateTransaction);

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    startTransition(() => createTransactionAction(formData));
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
    refetchOnMount: true,
  });

  useEffect(() => {
    if (createTransactionState.status === "success") {
      toast.success("Successfully added transaction");
      reset();
      setOpen(false);
    }
    if (createTransactionState?.status === "error") {
      toast.error("Failed to add transaction", {
        description: createTransactionState.errors?._form?.[0],
        descriptionClassName: "!text-black",
      });
    }
  }, [createTransactionState, reset, setOpen]);

  return (
    <DialogContent className="sm:max-w-sm">
      <DialogHeader>
        <DialogTitle className="text-xl font-medium text-emerald-500">
          Add Transaction
        </DialogTitle>
        <DialogDescription className="text-sm font-normal">
          Record your transaction history
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
            className="bg-emerald-500 hover:bg-emerald-600/80"
            disabled={isPendingCreateTransaction}
          >
            {isPendingCreateTransaction ? (
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
