import * as z from "zod";

export const transactionFormSchema = z.object({
  categoryId: z.string().min(1, "Category must be selected"),
  amount: z.coerce
    .number({
      error: "The number must be filled in with numbers",
    })
    .positive("The amount entered must be greater than 0"),
  note: z.string().max(255, "Maximum note 255 characters").or(z.literal("")),
  transactionDate: z.string().min(1, "Date is required"),
});

export type TransactionFormInput = z.input<typeof transactionFormSchema>;
export type TransactionFormOutput = z.output<typeof transactionFormSchema>;
