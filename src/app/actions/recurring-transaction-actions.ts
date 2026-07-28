"use server";

import { categories, recurringTransactions } from "@/db/schema";
import { requireUser } from "./auth-actions";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { recurringTransactionFormSchema } from "@/validations/recurring-transaction-validation";
import { RecurringTransactionFormState } from "@/types/recurring-transaction";
import z from "zod";
import { revalidatePath } from "next/cache";

const VALID_CATEGORY_TYPES = ["income", "expense"] as const;

function isValidCategoryType(type: string): type is "income" | "expense" {
  return VALID_CATEGORY_TYPES.includes(type as "income" | "expense");
}

export async function getRecurringTransactions(type: string) {
  const user = await requireUser();

  const conditions = [eq(recurringTransactions.userId, user.id)];

  if (type !== "all" && isValidCategoryType(type)) {
    conditions.push(eq(categories.type, type));
  }

  return db
    .select({
      id: recurringTransactions.id,
      amount: recurringTransactions.amount,
      note: recurringTransactions.note,
      categoryId: categories.id,
      categoryName: categories.name,
      categoryType: categories.type,
      categoryIcon: categories.icon,
      categoryColor: categories.color,
    })
    .from(recurringTransactions)
    .innerJoin(categories, eq(recurringTransactions.categoryId, categories.id))
    .where(and(...conditions));
  // .orderBy(desc(recurringTransactions.transactionDate), desc(recurringTransactions.id));
}

export async function createRecurringTransaction(
  prevState: RecurringTransactionFormState,
  formData: FormData,
): Promise<RecurringTransactionFormState> {
  const user = await requireUser();

  const validatedFields = recurringTransactionFormSchema.safeParse({
    categoryId: formData.get("categoryId"),
    amount: formData.get("amount"),
    note: formData.get("note"),
    frequency: formData.get("frequency"),
    nextRun: formData.get("nextRun"),
    endDate: formData.get("endDate"),
    isActive: formData.get("isActive") === "true",
  });

  if (!validatedFields.success) {
    const tree = z.treeifyError(validatedFields.error);
    return {
      status: "error",
      errors: {
        categoryId: tree.properties?.categoryId?.errors,
        amount: tree.properties?.amount?.errors,
        note: tree.properties?.note?.errors,
        frequency: tree.properties?.frequency?.errors,
        nextRun: tree.properties?.nextRun?.errors,
        endDate: tree.properties?.endDate?.errors,
        isActive: tree.properties?.isActive?.errors,
        _form: tree.errors,
      },
    };
  }

  const { categoryId, amount, note, frequency, nextRun, endDate, isActive } =
    validatedFields.data;

  try {
    await db.insert(recurringTransactions).values({
      userId: user.id,
      categoryId,
      amount: String(amount),
      note: note || null,
      frequency,
      nextRun,
      endDate: endDate || null,
      isActive,
    });
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: ["Failed to save recurring transaction, please try again"],
      },
    };
  }

  revalidatePath("/recurring-transactions");
  revalidatePath("/transactions");

  return { status: "success" };
}
