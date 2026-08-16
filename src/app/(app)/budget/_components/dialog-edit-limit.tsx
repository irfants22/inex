import { setBudgetLimit } from "@/app/actions/budget-actions";
import FormInput from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { INITIAL_BUDGET_FORM } from "@/constants/budget";
import { BudgetData, BudgetFormState } from "@/types/budget";
import {
  BudgetFormInput,
  budgetFormSchema,
} from "@/validations/budget-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const initialStateBudget: BudgetFormState = {};

export default function DialogEditLimit({
  open,
  setOpen,
  budget,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  budget: BudgetData | null;
}) {
  const { handleSubmit, control, reset, setValue } = useForm<BudgetFormInput>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: INITIAL_BUDGET_FORM,
  });

  const [
    editBudgetLimitState,
    editBudgetLimitAction,
    isPendingEditBudgetLimit,
  ] = useActionState(setBudgetLimit, initialStateBudget);

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    formData.append("monthlyLimit", String(data.monthlyLimit));

    startTransition(() => editBudgetLimitAction(formData));
  });

  useEffect(() => {
    if (editBudgetLimitState.status === "success") {
      toast.success("Successfully update monthly limit");
      setOpen(false);
    }
    if (editBudgetLimitState?.status === "error") {
      toast.error("Failed to update monthly limit", {
        description: editBudgetLimitState.errors?._form?.[0],
        descriptionClassName: "!text-black",
      });
    }
  }, [editBudgetLimitState, setOpen]);

  useEffect(() => {
    if (open) {
      if (budget) {
        setValue("monthlyLimit", Number(budget.monthlyLimit));
      }
    } else {
      reset();
    }
  }, [budget, setValue, open, reset]);

  return (
    <DialogContent className="sm:max-w-sm">
      <DialogHeader>
        <DialogTitle className="text-xl font-medium text-emerald-500">
          Edit Limit
        </DialogTitle>
        <DialogDescription className="text-sm font-normal">
          Edit your monthly spending limit
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormInput
          control={control}
          label="Monthly Limit"
          name="monthlyLimit"
          type="number"
          placeholder="Enter Monthly Limit"
        />
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-600/80"
            disabled={isPendingEditBudgetLimit}
          >
            {isPendingEditBudgetLimit ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
