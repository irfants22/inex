import { getBudgetLimit } from "@/app/actions/budget-actions";
import BudgetHeader from "./budget-header";
import BudgetSetLimit from "./budget-set-limit";
import BudgetTrackerCard from "./budget-tracker-card";
import { getTransactions } from "@/app/actions/transaction-actions";

export default async function Budget() {
  const budget = await getBudgetLimit();

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const transactions = await getTransactions(month, year, "expense");

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <BudgetHeader budget={budget} />
      {!budget ? (
        <BudgetSetLimit />
      ) : (
        <BudgetTrackerCard
          monthlyLimit={Number(budget.monthlyLimit) || 0}
          transactions={transactions}
        />
      )}
    </div>
  );
}
