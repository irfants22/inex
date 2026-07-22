import { CategoryIcon } from "@/components/common/category-icon";
import { CATEGORY_ICON_STYLES } from "@/constants/icon";
import { cn } from "@/lib/utils";
import { CategoryData } from "@/types/category";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";
import DialogUpdateCategory from "./dialog-update-category";
import DialogDeleteCategory from "./dialog-delete-category";

type CategoryTabContentProps = {
  type: "income" | "expense";
  categories: CategoryData[];
};

export default function CategoryTabContent({
  data,
}: {
  data: CategoryTabContentProps[];
}) {
  const [openDialogUpdate, setOpenDialogUpdate] = useState(false);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(
    null,
  );
  return (
    <div className="flex w-full flex-col justify-center gap-y-4 p-1">
      {data.map((group) => (
        <div
          key={group.type}
          className="flex w-full flex-col justify-center gap-2"
        >
          <p className="text-muted-foreground tracking-wide capitalize">
            {group.type} · {group.categories.length} Categories
          </p>
          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            {group.categories.map((category) => {
              const iconStyle =
                CATEGORY_ICON_STYLES[
                  category.color as keyof typeof CATEGORY_ICON_STYLES
                ] ?? CATEGORY_ICON_STYLES.neutral;
              return (
                <div
                  key={category.id}
                  className="item-center flex w-full justify-center gap-2 rounded-sm bg-white p-3"
                >
                  <div className="flex items-center justify-center">
                    <div
                      className={cn(
                        "flex aspect-square w-10 items-center justify-center rounded-sm",
                        iconStyle.bg,
                        iconStyle.text,
                      )}
                    >
                      <CategoryIcon
                        name={category.icon}
                        className={iconStyle.text}
                      />
                    </div>
                  </div>
                  <div className="flex flex-1 items-center justify-between">
                    <div className="flex flex-col justify-between">
                      <p className="font-medium">{category.name}</p>
                      <div className="flex items-center justify-center gap-1">
                        <p className="text-muted-foreground text-xs capitalize">
                          {category.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <Edit
                        className="size-4 cursor-pointer text-gray-500 transition hover:scale-105"
                        onClick={() => {
                          setSelectedCategory(category);
                          setOpenDialogUpdate(true);
                        }}
                      />
                      <Trash
                        className="size-4 cursor-pointer text-red-500 transition hover:scale-105"
                        onClick={() => {
                          setSelectedCategory(category);
                          setOpenDialogDelete(true);
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <DialogUpdateCategory
        open={openDialogUpdate}
        setOpen={setOpenDialogUpdate}
        currentData={selectedCategory}
      />
      <DialogDeleteCategory
        open={openDialogDelete}
        setOpen={setOpenDialogDelete}
        currentData={selectedCategory}
      />
    </div>
  );
}
