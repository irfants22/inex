import { RecurringTransactionFormInput } from "@/validations/recurring-transaction-validation";

export const FREQUENCY_SELECT_ITEMS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

export const INITIAL_RECURRING_TRANSACTION_FORM: RecurringTransactionFormInput =
  {
    categoryId: "",
    amount: 0,
    note: "",
    frequency: "monthly",
    nextRun: "",
    endDate: "",
    isActive: true,
  };
