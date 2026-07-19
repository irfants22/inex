import CategoryList from "./category-list";
import { getCategories } from "@/app/actions/category-actions";

import CategoryHeader from "./category-header";

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
      <CategoryHeader />
      <CategoryList data={groupedCategories} />
    </div>
  );
}
