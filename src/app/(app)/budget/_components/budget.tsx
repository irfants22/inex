import { getBudgetLimit } from "@/app/actions/budget-actions";
import BudgetHeader from "./budget-header";
import BudgetSetLimit from "./budget-set-limit";

export default async function Budget() {
  const budget = await getBudgetLimit();
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <BudgetHeader budget={budget} />
      {!budget && <BudgetSetLimit />}
    </div>
  );
}
