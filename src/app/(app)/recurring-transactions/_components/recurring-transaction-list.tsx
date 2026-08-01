"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import RecurringTransactionTabContent from "./recurring-transaction-tab-content";
import { RecurringTransactionData } from "@/types/recurring-transaction";

type RecurringTransactionListProps = {
  status: "active" | "inactive";
  recurrings: RecurringTransactionData[];
};

export default function RecurringTransactionList({
  data,
}: {
  data: RecurringTransactionListProps[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentRecurringStatus = searchParams.get("status") || "all";

  function setRecurringStatus(status: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", status);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex w-full items-center px-4 py-2">
      <Tabs
        value={currentRecurringStatus}
        onValueChange={setRecurringStatus}
        className="w-full"
      >
        <TabsList variant="line">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
        <TabsContent value={currentRecurringStatus}>
          <RecurringTransactionTabContent data={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
