import { getRecurringTransactions } from "@/app/actions/recurring-transaction-actions";
import RecurringTransactionHeader from "./recurring-transaction-header";
import RecurringTransactionList from "./recurring-transaction-list";

export default async function RecurringTransaction({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const { status } = searchParams;

  const recurringTransactionData = await getRecurringTransactions(
    status || "all",
  );

  const groupedRecurringTransactions = Object.entries(
    Object.groupBy(recurringTransactionData || [], (recurrings) =>
      recurrings.isActive ? "active" : "inactive",
    ),
  ).map(([status, recurring]) => ({
    status: status as "active" | "inactive",
    recurrings: recurring || [],
  }));
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <RecurringTransactionHeader />
      <RecurringTransactionList data={groupedRecurringTransactions} />
    </div>
  );
}
