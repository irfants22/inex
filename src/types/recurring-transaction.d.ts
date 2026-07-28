export type RecurringTransactionFormState = {
  status?: string;
  errors?: {
    categoryId?: string[];
    amount?: string[];
    note?: string[];
    frequency?: string[];
    nextRun?: string[];
    endDate?: string[];
    isActive?: string[];
    _form?: string[];
  };
};

export type RecurringTransactionData = {
  id: string;
  amount: string;
  note?: string | null;
  frequency: string;
  nextRun: string;
  endDate?: string | null;
  isActive: boolean;
  categoryId: string;
  categoryName: string;
  categoryType: "income" | "expense";
  categoryIcon: string;
  categoryColor: string;
};
