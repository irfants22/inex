import {
  getRecentTransactions,
  getTransactions,
} from "@/app/actions/transaction-actions";
import BalanceSummary from "./balance-summary";
import TransactionActivityChart from "./transaction-activity-chart";
import RecentTransactionList from "./recent-transaction-list";

export default async function Home() {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const [transactions, recentTransactions] = await Promise.all([
    getTransactions(currentMonth, currentYear, "all"),
    getRecentTransactions(5),
  ]);

  const transactionByDate = Object.entries(
    Object.groupBy(
      transactions || [],
      (transaction) => transaction.transactionDate,
    ),
  )
    .map(([date, trxs]) => {
      const income = (trxs || [])
        .filter((trx) => trx.categoryType === "income")
        .reduce((acc, trx) => acc + Number(trx.amount), 0);
      const expense = (trxs || [])
        .filter((trx) => trx.categoryType === "expense")
        .reduce((acc, trx) => acc + Number(trx.amount), 0);

      return { date, income, expense };
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="flex w-full flex-col justify-center gap-4 p-4">
      <BalanceSummary />
      <div className="grid grid-cols-[repeat(1,minmax(200px,1fr))] items-start gap-2 md:grid-cols-[repeat(2,minmax(200px,1fr))]">
        <TransactionActivityChart transactionByDate={transactionByDate} />
        <RecentTransactionList recentTransactions={recentTransactions} />
      </div>
    </div>
  );
}
