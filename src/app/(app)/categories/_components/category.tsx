import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CategoryList from "./category-list";
import { getCategories } from "@/app/actions/category-actions";

export default async function Category({
  searchParams,
}: {
  searchParams: { type?: string };
}) {
  const { type } = searchParams;

  const categoryData = await getCategories(type || "all");

  const groupedCategories = Object.entries(
    Object.groupBy(categoryData || [], (categories) => categories.type),
  ).map(([type, category]) => ({
    type: type as "income" | "expense",
    categories: category || [],
  }));

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <div className="flex w-full items-center justify-between rounded-lg px-4 py-2">
        <div>
          <h1 className="text-2xl leading-tight font-medium">Categories</h1>
          <p className="text-sm">Manage your income and expense categories.</p>
        </div>
        <div>
          <Button className="rounded-lg bg-emerald-500 px-3 py-5 text-white hover:bg-emerald-600/80">
            <Plus className="size-4" />
            New Category
          </Button>
        </div>
      </div>
      <CategoryList data={groupedCategories} />
    </div>
  );
}
