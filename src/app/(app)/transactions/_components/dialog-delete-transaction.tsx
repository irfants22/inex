import { deleteTransaction } from "@/app/actions/transaction-actions";
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
import { Loader2 } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";

const initialStateTransaction: TransactionFormState = {};

export default function DialogDeleteTransaction({
  open,
  setOpen,
  currentData,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  currentData: TransactionData | null;
}) {
  const [
    deleteTransactionState,
    deleteTransactionAction,
    isPendingDeleteTransaction,
  ] = useActionState(deleteTransaction, initialStateTransaction);

  const handleDelete = () => {
    if (!currentData) return;

    const formData = new FormData();
    formData.append("id", currentData.id);
    startTransition(() => deleteTransactionAction(formData));
  };

  useEffect(() => {
    if (deleteTransactionState.status === "success") {
      toast.success("Successfully delete transaction");
      setOpen(false);
    }
    if (deleteTransactionState?.status === "error") {
      toast.error("Failed to delete transaction", {
        description: deleteTransactionState.errors?._form?.[0],
        descriptionClassName: "!text-black",
      });
      setOpen(false);
    }
  }, [deleteTransactionState, setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-106.25">
        <form className="grid gap-6">
          <DialogHeader>
            <DialogTitle>Delete Transaction</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this transaction ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose
              render={
                <Button variant="outline" disabled={isPendingDeleteTransaction}>
                  Cancel
                </Button>
              }
            />
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPendingDeleteTransaction}
            >
              {isPendingDeleteTransaction ? (
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
