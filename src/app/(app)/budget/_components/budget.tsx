import BudgetHeader from "./budget-header";
import BudgetSetLimit from "./budget-set-limit";

export default function Budget() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <BudgetHeader />
      <BudgetSetLimit />
    </div>
  );
}
