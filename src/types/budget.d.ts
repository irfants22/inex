export type BudgetFormState = {
  status?: string;
  errors?: {
    monthlyLimit?: string[];
    _form?: string[];
  };
};

export type BudgetData = {
  id: string;
  monthlyLimit: string;
};
