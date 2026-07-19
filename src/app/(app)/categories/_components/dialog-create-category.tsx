"use client";

import { createCategory } from "@/app/actions/category-actions";
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
import {
  CATEGORY_TYPES_SELECT_ITEMS,
  INITIAL_CATEGORY_FORM,
} from "@/constants/category";
import {
  CategoryFormInput,
  categoryFormSchema,
} from "@/validations/category-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { CategoryFormState } from "@/types/category";
import { toast } from "sonner";
import {
  CATEGORY_COLOR_NAMES,
  CATEGORY_ICON_NAMES,
  CATEGORY_ICON_STYLES,
} from "@/constants/icon";
import { CategoryIcon } from "@/components/common/category-icon";
import { cn } from "@/lib/utils";

const initialStateCategory: CategoryFormState = {};

export default function DialogCreateCategory({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const { handleSubmit, control, reset } = useForm<CategoryFormInput>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: INITIAL_CATEGORY_FORM,
  });

  const [categoryState, categoryCreateAction, isPendingCreateCategory] =
    useActionState(createCategory, initialStateCategory);

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    startTransition(() => categoryCreateAction(formData));
  });

  useEffect(() => {
    if (categoryState.status === "success") {
      toast.success("Successfully added category");
      reset();
      setOpen(false);
    }
    if (categoryState?.status === "error") {
      toast.error("Failed to add category", {
        description: categoryState.errors?._form?.[0],
        descriptionClassName: "!text-black",
      });
    }
  }, [categoryState, reset, setOpen]);

  return (
    <DialogContent className="sm:max-w-sm">
      <DialogHeader>
        <DialogTitle className="text-xl font-medium text-emerald-500">
          Add Category
        </DialogTitle>
        <DialogDescription className="text-sm font-normal">
          Create the category you want
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
          selectItem={(CATEGORY_TYPES_SELECT_ITEMS ?? []).map((category) => ({
            value: `${category.value}`,
            label: `${category.label}`,
          }))}
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
            className="bg-emerald-500 hover:bg-emerald-600"
            disabled={isPendingCreateCategory}
          >
            {isPendingCreateCategory ? (
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
