import * as z from "zod";

export const budgetFormSchema = z.object({
  monthlyLimit: z.coerce
    .number({
      error: "Monthly limit must be a number",
    })
    .positive("Monthly limit must be greater than 0"),
});

export type BudgetFormInput = z.input<typeof budgetFormSchema>;
