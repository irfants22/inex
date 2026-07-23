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
          <div className="grid w-full grid-cols-[repeat(1,minmax(200px,1fr))] gap-2 sm:grid-cols-[repeat(2,minmax(200px,1fr))] md:grid-cols-[repeat(3,minmax(200px,1fr))]">
            {group.categories.map((category) => {
              const iconStyle =
                CATEGORY_ICON_STYLES[
                  category.color as keyof typeof CATEGORY_ICON_STYLES
                ] ?? CATEGORY_ICON_STYLES.neutral;
              return (
                <div
                  key={category.id}
                  className="item-center flex w-full gap-3 rounded-md bg-white p-3 transition-all"
                >
                  <div className="flex shrink-0 items-center justify-center">
                    <div
                      className={cn(
                        "flex aspect-square w-12 items-center justify-center rounded-md",
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

                  <div className="flex flex-1 flex-col items-start justify-between">
                    <p className="text-sm font-medium">{category.name}</p>
                    <div className="flex items-center justify-center gap-1">
                      <p className="text-muted-foreground text-xs capitalize">
                        {category.type}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center justify-end gap-x-2">
                    <Edit
                      className="text-muted-foreground size-4 cursor-pointer transition hover:text-black"
                      onClick={() => {
                        setSelectedCategory(category);
                        setOpenDialogUpdate(true);
                      }}
                    />
                    <Trash
                      className="text-muted-foreground size-4 cursor-pointer transition hover:text-red-500"
                      onClick={() => {
                        setSelectedCategory(category);
                        setOpenDialogDelete(true);
                      }}
                    />
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
