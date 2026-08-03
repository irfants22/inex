import { deleteRecurringTransaction } from "@/app/actions/recurring-transaction-actions";
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
import {
  RecurringTransactionData,
  RecurringTransactionFormState,
} from "@/types/recurring-transaction";
import { Loader2 } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";

const initialStateRecurringTransaction: RecurringTransactionFormState = {};

export default function DialogDeleteRecurringTransaction({
  open,
  setOpen,
  currentData,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  currentData: RecurringTransactionData | null;
}) {
  const [
    deleteRecurringTransactionState,
    deleteRecurringTransactionAction,
    isPendingRecurringDeleteTransaction,
  ] = useActionState(
    deleteRecurringTransaction,
    initialStateRecurringTransaction,
  );

  const handleDelete = () => {
    if (!currentData) return;

    const formData = new FormData();
    formData.append("id", currentData.id);
    startTransition(() => deleteRecurringTransactionAction(formData));
  };

  useEffect(() => {
    if (deleteRecurringTransactionState.status === "success") {
      toast.success("Successfully delete recurring transaction");
      setOpen(false);
    }
    if (deleteRecurringTransactionState?.status === "error") {
      toast.error("Failed to delete recurring transaction", {
        description: deleteRecurringTransactionState.errors?._form?.[0],
        descriptionClassName: "!text-black",
      });
      setOpen(false);
    }
  }, [deleteRecurringTransactionState, setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-106.25">
        <form className="grid gap-6">
          <DialogHeader>
            <DialogTitle>Delete Recurring</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this recurring transaction ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose
              render={
                <Button
                  variant="outline"
                  disabled={isPendingRecurringDeleteTransaction}
                >
                  Cancel
                </Button>
              }
            />
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPendingRecurringDeleteTransaction}
            >
              {isPendingRecurringDeleteTransaction ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
