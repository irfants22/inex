import { TransactionFilter } from "./transaction-filter";
import { getTransactions } from "@/app/actions/transaction-actions";
import TransactionHistoryCard from "./transaction-history-card";

export default async function Transaction({
  searchParams,
}: {
  searchParams: { month?: string; year?: string; type?: string };
}) {
  const { month, year, type } = searchParams;

  const now = new Date();
  const targetMonth = month ? Number(month) : now.getMonth() + 1;
  const targetYear = year ? Number(year) : now.getFullYear();
  const targetType = type || "all";

  const transactionData = await getTransactions(
    targetMonth,
    targetYear,
    targetType,
  );

  const groupedTransactions = Object.entries(
    Object.groupBy(
      transactionData || [],
      (transaction) => transaction.transactionDate,
    ),
  ).map(([date, transaction]) => ({
    date,
    transactions: transaction ?? [],
  }));

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <TransactionFilter />
      <TransactionHistoryCard data={groupedTransactions} />
    </div>
  );
}
