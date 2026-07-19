export type CategoryFormState = {
  status?: string;
  errors?: {
    name?: string[];
    type?: string[];
    color?: string[];
    icon?: string[];
    _form?: string[];
  };
};

export type CategoryData = {
  id: string;
  name: string;
  type: "income" | "expense";
  color: string;
  icon: string;
};
