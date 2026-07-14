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
