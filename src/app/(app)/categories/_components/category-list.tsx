"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategoryTabContent from "./category-tab-content";
import { CategoryData } from "@/types/category";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type CategoryListProps = {
  type: "income" | "expense";
  categories: CategoryData[];
};

export default function CategoryList({ data }: { data: CategoryListProps[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentType = searchParams.get("type") || "all";

  function setCategoryType(type: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", type);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex w-full items-center px-4 py-2">
      <Tabs
        value={currentType}
        onValueChange={setCategoryType}
        className="w-full"
      >
        <TabsList variant="line">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expense">Expense</TabsTrigger>
        </TabsList>
        <TabsContent value={currentType}>
          <CategoryTabContent data={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
