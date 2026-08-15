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
import { BudgetFormState } from "@/types/budget";
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

export default function DialogSetLimit({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { handleSubmit, control, reset } = useForm<BudgetFormInput>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: INITIAL_BUDGET_FORM,
  });

  const [setBudgetLimitState, setBudgetLimitAction, isPendingSetBudgetLimit] =
    useActionState(setBudgetLimit, initialStateBudget);

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    formData.append("monthlyLimit", data.monthlyLimit as string);

    startTransition(() => setBudgetLimitAction(formData));
  });

  useEffect(() => {
    if (setBudgetLimitState.status === "success") {
      toast.success("Successfully set monthly limit");
      setOpen(false);
    }
    if (setBudgetLimitState?.status === "error") {
      toast.error("Failed to set monthly limit", {
        description: setBudgetLimitState.errors?._form?.[0],
        descriptionClassName: "!text-black",
      });
    }
  }, [setBudgetLimitState, setOpen]);

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <DialogContent className="sm:max-w-sm">
      <DialogHeader>
        <DialogTitle className="text-xl font-medium text-emerald-500">
          Set Limit
        </DialogTitle>
        <DialogDescription className="text-sm font-normal">
          Set your monthly spending limit
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
            disabled={isPendingSetBudgetLimit}
          >
            {isPendingSetBudgetLimit ? (
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
