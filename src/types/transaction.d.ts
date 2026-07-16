export type TransactionFormState = {
  status?: string;
  errors?: {
    categoryId?: string[];
    amount?: string[];
    note?: string[];
    transactionDate?: string[];
    _form?: string[];
  };
};

export type TransactionData = {
  id: string;
  amount: string;
  note?: string | null;
  transactionDate: string;
  categoryId: string;
  categoryName: string;
  categoryType: "income" | "expense";
  categoryIcon: string;
  categoryColor: string;
};
