import * as z from "zod";

export const recurringTransactionFormSchema = z.object({
  categoryId: z.string().min(1, "Category must be selected"),
  amount: z.coerce
    .number({
      error: "The number must be filled in with numbers",
    })
    .positive("The amount entered must be greater than 0"),
  note: z.string().max(255, "Maximum note 255 characters").or(z.literal("")),
  frequency: z.enum(["daily", "weekly", "monthly", "yearly"], {
    error: "Frequency must be selected",
  }),
  nextRun: z.string().min(1, "Next run date is required"),
  endDate: z.string().optional().or(z.literal("")),
  isActive: z.boolean(),
});

export type RecurringTransactionFormInput = z.input<
  typeof recurringTransactionFormSchema
>;
