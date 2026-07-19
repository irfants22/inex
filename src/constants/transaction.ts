import { TransactionFormInput } from "@/validations/transaction-validation";
import { format } from "date-fns";

export const MONTH_SELECT_ITEMS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export const TRANSACTION_TYPES_SELECT_ITEMS = [
  { value: "all", label: "All" },
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
];

export const INITIAL_TRANSACTION_FORM: TransactionFormInput = {
  categoryId: "",
  amount: 0,
  note: "",
  transactionDate: format(new Date(), "yyyy-MM-dd"),
};
