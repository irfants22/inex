"use client";

import { updateCategory } from "@/app/actions/category-actions";
import { CategoryIcon } from "@/components/common/category-icon";
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
import { CATEGORY_TYPE_SELECT_ITEMS } from "@/constants/category";
import {
  CATEGORY_COLOR_NAMES,
  CATEGORY_ICON_NAMES,
  CATEGORY_ICON_STYLES,
} from "@/constants/icon";
import { cn } from "@/lib/utils";
import { CategoryData, CategoryFormState } from "@/types/category";
import {
  CategoryFormInput,
  categoryFormSchema,
} from "@/validations/category-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const initialStateCategory: CategoryFormState = {};

export default function DialogUpdateCategory({
  open,
  setOpen,
  currentData,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  currentData: CategoryData | null;
}) {
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset, setValue } = useForm<CategoryFormInput>(
    {
      resolver: zodResolver(categoryFormSchema),
    },
  );

  const [updateCategoryState, updateCategoryAction, isPendingUpdateCategory] =
    useActionState(updateCategory, initialStateCategory);

  const onSubmit = handleSubmit((data) => {
    if (!currentData) return;

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    formData.append("id", currentData.id);

    startTransition(() => updateCategoryAction(formData));
  });

  useEffect(() => {
    if (currentData) {
      setValue("name", currentData.name);
      setValue("type", currentData.type);
      setValue("icon", currentData.icon);
      setValue("color", currentData.color);
    }
  }, [currentData, setValue]);

  useEffect(() => {
    if (updateCategoryState.status === "success") {
      toast.success("Successfully update category");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      reset();
      setOpen(false);
    }
    if (updateCategoryState?.status === "error") {
      toast.error("Failed to update category", {
        description: updateCategoryState.errors?._form?.[0],
        descriptionClassName: "!text-black",
      });
    }
  }, [updateCategoryState, reset, setOpen, queryClient]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-emerald-500">
            Update Category
          </DialogTitle>
          <DialogDescription className="text-sm font-normal">
            Update your category as needed
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormInput
            control={control}
            label="Name"
            name="name"
            type="text"
            placeholder="Enter Name"
          />
          <FormSelect
            control={control}
            label="Type"
            name="type"
            selectItem={(CATEGORY_TYPE_SELECT_ITEMS ?? []).map((category) => ({
              value: `${category.value}`,
              label: `${category.label}`,
            }))}
            isDisabled
          />
          <FormSelect
            control={control}
            label="Icon"
            name="icon"
            selectItem={(CATEGORY_ICON_NAMES ?? []).map((icon) => ({
              value: icon,
              label: icon,
              renderItem: <CategoryIcon name={icon} className="mr-0.5" />,
            }))}
          />
          <FormSelect
            control={control}
            label="Color"
            name="color"
            selectItem={(CATEGORY_COLOR_NAMES ?? []).map((color) => {
              const style =
                CATEGORY_ICON_STYLES[
                  color as keyof typeof CATEGORY_ICON_STYLES
                ] ?? CATEGORY_ICON_STYLES.neutral;

              return {
                value: color,
                label: color,
                renderItem: (
                  <div className={cn("h-6 w-6 rounded-full", style.bg)} />
                ),
              };
            })}
          />
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600/80"
              disabled={isPendingUpdateCategory}
            >
              {isPendingUpdateCategory ? (
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
