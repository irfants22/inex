import { deleteCategory } from "@/app/actions/category-actions";
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
import { CategoryData, CategoryFormState } from "@/types/category";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";

const initialStateCategory: CategoryFormState = {};

export default function DialogDeleteCategory({
  open,
  setOpen,
  currentData,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  currentData: CategoryData | null;
}) {
  const queryClient = useQueryClient();
  const [deleteCategoryState, deleteCategoryAction, isPendingDeleteCategory] =
    useActionState(deleteCategory, initialStateCategory);

  const handleDelete = () => {
    if (!currentData) return;

    const formData = new FormData();
    formData.append("id", currentData.id);
    startTransition(() => deleteCategoryAction(formData));
  };

  useEffect(() => {
    if (deleteCategoryState.status === "success") {
      toast.success("Successfully delete category");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setOpen(false);
    }
    if (deleteCategoryState?.status === "error") {
      toast.error("Failed to delete category", {
        description: deleteCategoryState.errors?._form?.[0],
        descriptionClassName: "!text-black",
      });
      setOpen(false);
    }
  }, [deleteCategoryState, setOpen, queryClient]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-106.25">
        <form className="grid gap-6">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose
              render={
                <Button variant="outline" disabled={isPendingDeleteCategory}>
                  Cancel
                </Button>
              }
            />
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPendingDeleteCategory}
            >
              {isPendingDeleteCategory ? (
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
