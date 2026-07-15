"use server";

import { requireUser } from "./auth-actions";
import { db } from "@/db";
import { categories, transactions } from "@/db/schema";
import { and, desc, eq, gte, lt } from "drizzle-orm";
import { TransactionFormState } from "@/types/transaction";
import { transactionFormSchema } from "@/validations/transaction-validation";
import z from "zod";
import { revalidatePath } from "next/cache";
import { format } from "date-fns";

export async function getTransactions(
  month: number,
  year: number,
  type: string,
) {
  const user = await requireUser();

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  const conditions = [
    eq(transactions.userId, user.id),
    gte(transactions.transactionDate, format(startDate, "yyyy-MM-dd")),
    lt(transactions.transactionDate, format(endDate, "yyyy-MM-dd")),
  ];

  if (type !== "all") {
    conditions.push(eq(categories.type, type as "income" | "expense"));
  }

  return db
    .select({
      id: transactions.id,
      amount: transactions.amount,
      note: transactions.note,
      transactionDate: transactions.transactionDate,
      categoryName: categories.name,
      categoryType: categories.type,
      categoryIcon: categories.icon,
      categoryColor: categories.color,
    })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(and(...conditions))
    .orderBy(desc(transactions.transactionDate), desc(transactions.id));
}

export async function createTransaction(
  prevState: TransactionFormState,
  formData: FormData,
): Promise<TransactionFormState> {
  const user = await requireUser();

  const validatedFields = transactionFormSchema.safeParse({
    categoryId: formData.get("categoryId"),
    amount: formData.get("amount"),
    note: formData.get("note"),
    transactionDate: formData.get("transactionDate"),
  });

  if (!validatedFields.success) {
    const tree = z.treeifyError(validatedFields.error);
    return {
      status: "error",
      errors: {
        categoryId: tree.properties?.categoryId?.errors,
        amount: tree.properties?.amount?.errors,
        note: tree.properties?.note?.errors,
        transactionDate: tree.properties?.transactionDate?.errors,
        _form: tree.errors,
      },
    };
  }

  const { categoryId, amount, note, transactionDate } = validatedFields.data;

  try {
    await db.insert(transactions).values({
      userId: user.id,
      categoryId,
      amount: String(amount),
      note: note || null,
      transactionDate,
    });
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: ["Failed to save transaction, please try again"],
      },
    };
  }

  revalidatePath("/home", "layout");

  return { status: "success" };
}
