import { CategoryFormInput } from "@/validations/category-validation";

export const INITIAL_CATEGORY_FORM: CategoryFormInput = {
  name: "",
  type: "",
  icon: "",
  color: "",
};

export const CATEGORY_TYPE_SELECT_ITEMS = [
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
];
